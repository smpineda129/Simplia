import express from 'express';
import { prisma } from '../../db/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import emailService from '../../utils/emailService.js';
import { presignKey } from '../../utils/s3Presign.js';
import { otpCodeEmailTemplate } from '../../templates/otpCodeEmail.js';

const router = express.Router();

// Middleware to authenticate external users
const authenticateExternal = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.secret);
    if (payload.type !== 'external') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    req.externalUser = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

// Generate 6-digit OTP
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// POST /api/external/request-otp
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email requerido' });

    const externalUser = await prisma.externalUser.findFirst({
      where: { email, deletedAt: null },
    });

    if (!externalUser) {
      // Return success to avoid email enumeration
      return res.json({ success: true, message: 'Si el correo está registrado, recibirás un código' });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.externalUser.update({
      where: { id: externalUser.id },
      data: { otpCode: hashedOtp, otpExpiresAt: expiresAt },
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const emailHtml = otpCodeEmailTemplate({
      userName: externalUser.name || 'Usuario',
      otpCode: otp,
      companyName: 'Simplia',
      logoUrl: `${clientUrl}/Horizontal_Logo.jpeg`,
    });

    await emailService.send({
      to: email,
      subject: '🔐 Tu código de acceso al Portal de Expedientes',
      html: emailHtml,
    });

    res.json({ success: true, message: 'Código enviado a tu correo' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/external/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Email y código requeridos' });

    const externalUser = await prisma.externalUser.findFirst({
      where: { email, deletedAt: null },
    });

    if (!externalUser?.otpCode || !externalUser?.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
    }

    if (new Date() > externalUser.otpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Código expirado' });
    }

    const valid = await bcrypt.compare(code, externalUser.otpCode);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Código incorrecto' });
    }

    // Clear OTP
    await prisma.externalUser.update({
      where: { id: externalUser.id },
      data: { otpCode: null, otpExpiresAt: null },
    });

    const token = jwt.sign(
      { externalUserId: externalUser.id.toString(), type: 'external' },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id: externalUser.id, name: externalUser.name, email: externalUser.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/external/proceedings
router.get('/proceedings', authenticateExternal, async (req, res) => {
  try {
    const links = await prisma.externalUserProceeding.findMany({
      where: { externalUserId: BigInt(req.externalUser.externalUserId) },
      include: {
        proceeding: {
          select: {
            id: true,
            name: true,
            code: true,
            startDate: true,
            endDate: true,
            loan: true,
            company: { select: { id: true, name: true } },
            retentionLine: { select: { id: true, code: true, series: true } },
          },
        },
      },
    });

    const proceedings = links.map(l => l.proceeding);
    res.json({ success: true, data: proceedings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/external/proceedings/:id
router.get('/proceedings/:id', authenticateExternal, async (req, res) => {
  try {
    const link = await prisma.externalUserProceeding.findFirst({
      where: {
        externalUserId: BigInt(req.externalUser.externalUserId),
        proceedingId: parseInt(req.params.id),
      },
    });

    if (!link) {
      return res.status(403).json({ success: false, message: 'Acceso denegado a este expediente' });
    }

    const proceeding = await prisma.proceeding.findFirst({
      where: { id: parseInt(req.params.id), deletedAt: null },
      include: {
        company: { select: { id: true, name: true } },
        retentionLine: { select: { id: true, code: true, series: true } },
        documentProceedings: {
          where: { deletedAt: null },
          include: {
            document: { select: { id: true, name: true, file: true, file_original_name: true, createdAt: true } },
          },
        },
      },
    });

    if (!proceeding) {
      return res.status(404).json({ success: false, message: 'Expediente no encontrado' });
    }

    // Generate presigned URLs for documents
    const documents = await Promise.all(
      proceeding.documentProceedings.map(async dp => {
        const doc = dp.document;
        let url = null;
        if (doc.file) {
          try { url = await presignKey(doc.file); } catch (_) {}
        }
        return { ...doc, url };
      })
    );

    res.json({
      success: true,
      data: {
        ...proceeding,
        documents,
        documentProceedings: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
