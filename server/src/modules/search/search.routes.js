import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { prisma } from '../../db/prisma.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    let companyId = req.user.companyId ? parseInt(req.user.companyId) : null;

    const [correspondences, proceedings, documents] = await Promise.all([
      prisma.correspondence.findMany({
        where: {
          deletedAt: null,
          ...(companyId && { companyId }),
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { in_settled: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, in_settled: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.proceeding.findMany({
        where: {
          deletedAt: null,
          ...(companyId && { companyId }),
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, code: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.document.findMany({
        where: {
          deletedAt: null,
          ...(companyId && { companyId }),
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { file_original_name: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, file_original_name: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const results = [
      ...correspondences.map(c => ({
        type: 'correspondence',
        id: c.id,
        label: `${c.in_settled ? c.in_settled + ' — ' : ''}${c.title}`,
      })),
      ...proceedings.map(p => ({
        type: 'proceeding',
        id: p.id,
        label: `${p.code} — ${p.name}`,
      })),
      ...documents.map(d => ({
        type: 'document',
        id: d.id,
        label: d.file_original_name || d.name,
      })),
    ];

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
