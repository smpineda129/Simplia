import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GDI API - Sistema de Gestión Documental Inteligente',
      version: '1.0.0',
      description: `
# Sistema de Gestión Documental Inteligente (GDI)

API completa para la gestión documental empresarial con las siguientes características:

## Módulos Principales

- **Autenticación**: Sistema JWT con refresh tokens
- **Usuarios**: Gestión completa de usuarios con roles y permisos
- **Empresas**: Soporte multi-tenant
- **Áreas**: Gestión de departamentos y áreas
- **Correspondencia**: Sistema de radicados automáticos con tracking
- **Documentos**: Gestión de documentos digitales y físicos
- **Plantillas**: Sistema de templates dinámicos
- **Expedientes**: Gestión de expedientes documentales
- **Retenciones**: Tablas de Retención Documental (TRD)
- **Entidades**: Gestión de entidades externas
- **Bodegas**: Control de ubicaciones físicas y cajas
- **Roles y Permisos**: Sistema RBAC completo

## Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Paginación en todos los listados
- ✅ Búsqueda y filtros avanzados
- ✅ Validación de datos
- ✅ Manejo centralizado de errores
- ✅ Multi-tenancy (múltiples empresas)
- ✅ Sistema de permisos granular

## Autenticación

La mayoría de los endpoints requieren autenticación. Para autenticarte:

1. Obtén un token mediante \`POST /api/auth/login\`
2. Incluye el token en el header: \`Authorization: Bearer <token>\`
3. El access token expira en 15 minutos
4. Usa \`POST /api/auth/refresh\` para renovar el token

## Recursos Adicionales

- [Guía del Desarrollador](https://github.com/tu-repo/docs/DEVELOPER_GUIDE.md)
- [Referencia de API](https://github.com/tu-repo/docs/api-reference.md)
      `,
      contact: {
        name: 'GDI Team',
        email: 'support@gdi.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.gdi.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu access token JWT obtenido del endpoint /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Descripción del error',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operación exitosa',
            },
            data: {
              type: 'object',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'integer',
                      example: 100,
                    },
                    page: {
                      type: 'integer',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      example: 10,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 10,
                    },
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            role: {
              type: 'string',
              example: 'USER',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Empresa ABC',
            },
            identifier: {
              type: 'string',
              example: '900123456-1',
            },
            short: {
              type: 'string',
              example: 'ABC',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@abc.com',
            },
            maxUsers: {
              type: 'integer',
              example: 50,
            },
          },
        },
        Correspondence: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Solicitud de información',
            },
            in_settled: {
              type: 'string',
              example: 'RAD-2024-001',
              description: 'Radicado de entrada generado automáticamente',
            },
            out_settled: {
              type: 'string',
              example: 'RAD-2024-002',
              description: 'Radicado de salida generado automáticamente',
            },
            tracking_number: {
              type: 'string',
              example: 'TRK-ABC123',
              description: 'Número de seguimiento único',
            },
            status: {
              type: 'string',
              enum: ['registered', 'in_transit', 'delivered'],
              example: 'registered',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              example: 'medium',
            },
            content: {
              type: 'string',
              example: 'Contenido de la correspondencia',
            },
            sender_id: {
              type: 'integer',
              example: 1,
            },
            recipient_id: {
              type: 'integer',
              example: 2,
            },
            origin_area_id: {
              type: 'integer',
              example: 1,
            },
            destination_area_id: {
              type: 'integer',
              example: 2,
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Area: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Recursos Humanos',
            },
            code: {
              type: 'string',
              example: 'RH',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Document: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Contrato de trabajo',
            },
            file: {
              type: 'string',
              example: '/uploads/documents/contract.pdf',
            },
            medium: {
              type: 'string',
              enum: ['digital', 'physical'],
              example: 'digital',
            },
            documentDate: {
              type: 'string',
              format: 'date',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            fileSize: {
              type: 'number',
              example: 1024.5,
            },
            filePages: {
              type: 'integer',
              example: 5,
            },
            meta: {
              type: 'object',
              description: 'Metadatos JSON adicionales',
            },
            notes: {
              type: 'string',
              example: 'Notas adicionales del documento',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Template: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Plantilla de Oficio',
            },
            description: {
              type: 'string',
              example: 'Plantilla para oficios formales',
            },
            content: {
              type: 'string',
              example: 'Estimado {{nombre}}, por medio de la presente...',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Proceeding: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Expediente Contratación 2024',
            },
            code: {
              type: 'string',
              example: 'EXP-2024-001',
            },
            startDate: {
              type: 'string',
              format: 'date',
            },
            endDate: {
              type: 'string',
              format: 'date',
            },
            loan: {
              type: 'string',
              enum: ['custody', 'loan', 'returned'],
              example: 'custody',
              description: 'Estado de préstamo del expediente',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            retentionLineId: {
              type: 'integer',
              example: 1,
            },
            views: {
              type: 'integer',
              example: 10,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Retention: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'TRD Recursos Humanos 2024',
            },
            code: {
              type: 'string',
              example: 'TRD-RH-2024',
            },
            date: {
              type: 'string',
              format: 'date',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            areaId: {
              type: 'integer',
              example: 1,
            },
            comments: {
              type: 'string',
              example: 'Tabla de retención aprobada',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RetentionLine: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            retentionId: {
              type: 'integer',
              example: 1,
            },
            series: {
              type: 'string',
              example: 'Contratos',
            },
            subseries: {
              type: 'string',
              example: 'Contratos laborales',
            },
            code: {
              type: 'string',
              example: 'CL-001',
            },
            localRetention: {
              type: 'integer',
              example: 5,
              description: 'Años de retención local',
            },
            centralRetention: {
              type: 'integer',
              example: 10,
              description: 'Años de retención central',
            },
            disposition_ct: {
              type: 'boolean',
              example: false,
              description: 'Conservación Total',
            },
            disposition_e: {
              type: 'boolean',
              example: true,
              description: 'Eliminación',
            },
            disposition_m: {
              type: 'boolean',
              example: false,
              description: 'Microfilmación',
            },
            disposition_d: {
              type: 'boolean',
              example: false,
              description: 'Digitalización',
            },
            disposition_s: {
              type: 'boolean',
              example: false,
              description: 'Selección',
            },
            comments: {
              type: 'string',
              example: 'Disposición según normativa',
            },
          },
        },
        Entity: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Juan Pérez',
            },
            identification: {
              type: 'string',
              example: '1234567890',
            },
            entity_category_id: {
              type: 'integer',
              example: 1,
            },
            meta: {
              type: 'object',
              description: 'Metadatos JSON adicionales',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Warehouse: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Bodega Principal',
            },
            code: {
              type: 'string',
              example: 'BOD-001',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'bodega@empresa.com',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Box: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            code: {
              type: 'string',
              example: 'CAJA-001',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Administrador',
            },
            guardName: {
              type: 'string',
              example: 'web',
            },
            roleLevel: {
              type: 'integer',
              example: 1,
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'users.create',
            },
            guardName: {
              type: 'string',
              example: 'web',
            },
            permissionLevel: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CorrespondenceType: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Oficio',
            },
            description: {
              type: 'string',
              example: 'Comunicación oficial',
            },
            expiration: {
              type: 'integer',
              example: 30,
              description: 'Días de expiración',
            },
            companyId: {
              type: 'integer',
              example: 1,
            },
            areaId: {
              type: 'integer',
              example: 1,
            },
            public: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CorrespondenceThread: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            correspondenceId: {
              type: 'integer',
              example: 1,
            },
            from_id: {
              type: 'integer',
              example: 1,
            },
            to_id: {
              type: 'integer',
              example: 2,
            },
            message: {
              type: 'string',
              example: 'Mensaje del hilo de conversación',
            },
            answer: {
              type: 'string',
              example: 'Respuesta al mensaje',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticación no válido o no proporcionado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Token no proporcionado',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'No tienes permisos para acceder a este recurso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Recurso no encontrado',
              },
            },
          },
        },
        ValidationError: {
          description: 'Error de validación de datos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Error de validación',
                errors: [
                  {
                    field: 'email',
                    message: 'Email inválido',
                  },
                ],
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y gestión de sesiones',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios del sistema',
      },
      {
        name: 'Companies',
        description: 'Gestión de empresas (multi-tenant)',
      },
      {
        name: 'Areas',
        description: 'Gestión de áreas y departamentos',
      },
      {
        name: 'Correspondences',
        description: 'Sistema de correspondencia con radicados automáticos',
      },
      {
        name: 'Documents',
        description: 'Gestión de documentos digitales y físicos',
      },
      {
        name: 'Templates',
        description: 'Sistema de plantillas dinámicas',
      },
      {
        name: 'Proceedings',
        description: 'Gestión de expedientes documentales',
      },
      {
        name: 'Retentions',
        description: 'Tablas de Retención Documental (TRD)',
      },
      {
        name: 'Entities',
        description: 'Gestión de entidades externas',
      },
      {
        name: 'Warehouses',
        description: 'Gestión de bodegas y ubicaciones físicas',
      },
      {
        name: 'Roles',
        description: 'Gestión de roles del sistema',
      },
      {
        name: 'Permissions',
        description: 'Gestión de permisos del sistema',
      },
      {
        name: 'CorrespondenceTypes',
        description: 'Tipos de correspondencia',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
