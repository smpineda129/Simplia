import { prisma } from '../../db/prisma.js';

class TemplateService {
  // Helpers disponibles para las plantillas
  getAvailableHelpers() {
    return {
      general: [
        { key: '{dia}', description: 'Día actual' },
        { key: '{mes}', description: 'Mes actual' },
        { key: '{ano}', description: 'Año actual' },
        { key: '{fecha}', description: 'Fecha completa' },
      ],
      destinatario: [
        { key: '{nombre}', description: 'Nombre del destinatario' },
        { key: '{apellido}', description: 'Apellido del destinatario' },
        { key: '{dni}', description: 'DNI del destinatario' },
        { key: '{correo}', description: 'Correo del destinatario' },
      ],
      correspondencia: [
        { key: '{radicado_entrada}', description: 'Radicado de entrada' },
        { key: '{radicado_salida}', description: 'Radicado de salida' },
      ],
      usuario: [
        { key: '{firma}', description: 'Firma del usuario' },
        { key: '{mi_nombre}', description: 'Nombre del usuario activo' },
        { key: '{mi_correo}', description: 'Correo del usuario activo' },
        { key: '{mi_cargo}', description: 'Cargo del usuario activo' },
      ],
    };
  }

  async getAll(filters = {}) {
    const { search, companyId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              short: true,
            },
          },
        },
      }),
      prisma.template.count({ where }),
    ]);

    return {
      templates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const template = await prisma.template.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
      },
    });

    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    return template;
  }

  async create(data) {
    const template = await prisma.template.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        companyId: parseInt(data.companyId),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
      },
    });

    return template;
  }

  async update(id, data) {
    const template = await prisma.template.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const updated = await prisma.template.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id) {
    const template = await prisma.template.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    // Soft delete
    await prisma.template.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Plantilla eliminada correctamente' };
  }

  // Procesar plantilla con datos reales
  async processTemplate(templateId, data) {
    const template = await this.getById(templateId);
    
    let content = template.content;
    
    // Reemplazar helpers con datos reales
    const replacements = {
      '{dia}': new Date().getDate(),
      '{mes}': new Date().toLocaleString('es-ES', { month: 'long' }),
      '{ano}': new Date().getFullYear(),
      '{fecha}': new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      '{nombre}': data.destinatario?.nombre || '',
      '{apellido}': data.destinatario?.apellido || '',
      '{dni}': data.destinatario?.dni || '',
      '{correo}': data.destinatario?.correo || '',
      '{radicado_entrada}': data.correspondencia?.radicadoEntrada || '',
      '{radicado_salida}': data.correspondencia?.radicadoSalida || '',
      '{firma}': data.usuario?.firma || '',
      '{mi_nombre}': data.usuario?.nombre || '',
      '{mi_correo}': data.usuario?.correo || '',
      '{mi_cargo}': data.usuario?.cargo || '',
    };

    Object.keys(replacements).forEach(key => {
      content = content.replace(new RegExp(key, 'g'), replacements[key]);
    });

    return {
      template,
      processedContent: content,
    };
  }
}

export default new TemplateService();
