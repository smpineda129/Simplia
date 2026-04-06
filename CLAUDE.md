# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GDI is a professional **React + Node.js + PostgreSQL monolith** for document and correspondence management. It's a full-stack application with multi-company support, role-based access control, and advanced features like digital custody, surveys, and support tickets.

**Tech Stack:**
- **Frontend**: React 18 with Vite, MUI, Tailwind CSS, React Router
- **Backend**: Node.js/Express with Prisma ORM for PostgreSQL and Mongoose for MongoDB
- **Databases**: PostgreSQL (primary), MongoDB (surveys/diagnostics)
- **Architecture**: Monorepo (client + server folders), module-based

## Development Commands

### Setup & Installation
```bash
npm run install:all          # Install all dependencies (root, client, server)
```

### Running the Application
```bash
npm run dev                  # Run both client (port 5173) and server (port 3000) concurrently
npm run dev:client          # Run client only (Vite dev server)
npm run dev:server          # Run server only (nodemon)
```

### Building
```bash
npm run build               # Build React client for production
```

### Testing
```bash
npm run test                # Run all tests (client + server)
npm run test:client         # Run Jest tests for React components
npm run test:watch          # Run client tests in watch mode (cd client && npm run test:watch)
npm run test:coverage       # Generate coverage reports (cd client && npm run test:coverage)
npm run test:server         # Run server tests with experimental modules
npm run test:watch          # Server watch mode (cd server && npm run test:watch)
```

### Database Management (Prisma)
```bash
npm run prisma:migrate      # Create and apply database migrations
npm run prisma:generate     # Regenerate Prisma client
npm run prisma:studio       # Open Prisma Studio GUI (visual DB editor)
npm run prisma:seed         # Run database seed file (server/prisma/seed.js)
```

### Running Single Tests
- **Frontend**: `cd client && npm test -- ComponentName.test.jsx`
- **Backend**: `cd server && npm run test -- service.test.js`

## Architecture

### Backend Structure (`server/src/`)
**Module-based architecture** where each domain has its own folder:

```
modules/
├── auth/                  # Authentication & JWT
├── users/                 # User management
├── companies/             # Multi-company support
├── areas/                 # Company departments/areas
├── roles/                 # Role definitions
├── permissions/           # Permission management
├── documents/             # Document storage & metadata
├── correspondences/       # Internal/external correspondence
├── proceedings/           # Document proceedings/custody
├── retentions/            # Document retention policies
├── entities/              # External entities/contacts
├── warehouses/            # Document warehouses/storage
├── support-tickets/       # PQRS/support system
├── surveys/               # SurveyJS surveys (MongoDB)
├── notifications/         # User notifications
├── audit/                 # Audit logging
└── templates/             # Document templates
```

Each module typically contains:
- `*.routes.js` - API route definitions
- `*.service.js` - Business logic
- `*.controller.js` - Request handlers (if pattern used)
- `*.test.js` - Tests

**Key Patterns:**
- Express server starts in `server.js`, Express app setup in `app.js`
- Routes aggregated in `routes/index.js`
- Prisma for PostgreSQL data access (`db/prisma.js`)
- Mongoose for MongoDB (`db/mongoose.js`)
- Authentication via JWT with `middlewares/auth.js`
- Permission checking via `middlewares/permission.middleware.js`
- Swagger API docs at `/api-docs` (configured in `config/swagger.js`)

### Frontend Structure (`client/src/`)
**Module-based + layout pattern**:

```
modules/
├── auth/                  # Login, authentication
├── dashboard/             # Main dashboard
├── users/                 # User list/profile
├── companies/             # Company management
├── areas/                 # Area management
├── documents/             # Document management
├── correspondences/       # Correspondence UI
├── proceedings/           # Proceedings UI
├── retentions/            # Retention policies UI
├── support-tickets/       # Support/PQRS system
├── surveys/               # Survey responses (SurveyJS)
├── custodia/              # Digital custody module
├── notifications/         # Notification center
└── [other modules]/       # Similar pattern
```

**Global Components & Context:**
- `context/AuthContext.jsx` - Auth state, permissions, user data
- `context/ThemeContext.jsx` - Theme customization
- `components/ProtectedRoute.jsx` - Route protection by permission
- `layouts/MainLayout.jsx` - Authenticated user layout
- `layouts/AuthLayout.jsx` - Login/public layout
- `App.jsx` - Main route definitions with permission guards

**Important Utilities:**
- `api/` - Axios API client configuration
- `hooks/useAuth` - Access auth context
- `utils/avatarUtils.js` - User avatar handling

### Database Schema Highlights
- **Multi-tenancy**: `Company` model is root, most entities have `companyId`
- **Soft deletes**: `deletedAt` field for logical deletion
- **Permissions**: `Permission` + `Role` models with many-to-many relations
- **Audit**: `Audit` model tracks changes on entities
- **Support tickets**: Full SupportTicket system with `TicketComment` and `TicketHistory`
- **Surveys**: MongoDB-based via Mongoose

## Important Files & Patterns

### Configuration
- `server/.env.example` - Environment variables for server
- `client/vite.config.js` - Client build & dev server config (proxy to `/api` at port 3000)
- `server/src/config/cors.js` - CORS policy
- `server/src/config/env.js` - Environment validation

### Key Middlewares
- `auth.js` - JWT verification, populates `req.user`
- `permission.middleware.js` - `hasPermission()` checks user permissions
- `errorHandler.js` - Global error handling
- `prismaAudit.js` - Automatic audit logging
- `rateLimiter.js` - Rate limiting

### Authentication & Permissions
- JWT stored in auth context on client
- Server validates JWT, populates user with permissions
- Routes protected with `hasPermission()` middleware
- Frontend uses `ProtectedRoute` component to check permissions before rendering
- Permission format: `"resource.action"` (e.g., `"user.view"`, `"correspondence.create"`)

### Deployment Notes
- Port 3000: Backend API
- Port 5173: Frontend dev server
- Client proxies `/api` calls to backend during dev
- Build outputs to `client/dist`
- Render platform deployment considerations noted in recent commits

## Common Development Tasks

### Adding a New Module (e.g., "reports")
1. Backend: Create `server/src/modules/reports/` with routes, services
2. Add route import to `server/src/routes/index.js`
3. Frontend: Create `client/src/modules/reports/` with pages, components
4. Add route to `App.jsx` with appropriate permission guard
5. Add permissions to database if needed via seeder

### Creating an API Endpoint
1. Create `server/src/modules/[feature]/[feature].routes.js`
2. Use `authenticate` + `hasPermission()` middleware
3. Return JSON response via Express handlers
4. Document in Swagger JSDoc comments
5. Call from client via axios instance in `client/src/api/`

### Adding Database Fields
1. Update Prisma schema at `server/prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migration
3. Run migration: follows prompts to name it
4. Regenerate types: `npm run prisma:generate`
5. Test seeder if adding required fields

### Testing Permissions
- Test route exists at `/api/test-permission` (requires `user.view` permission)
- Use Prisma Studio to verify user roles/permissions: `npm run prisma:studio`

## Context & State Management
- **Auth**: React Context (AuthContext) - no Redux
- **Theme**: React Context (ThemeContext) for customization
- **API calls**: Direct axios calls, no global state management library
- **Form validation**: Formik + Yup on client side

## Notable Features
- **Multi-company**: Users belong to companies, data isolation
- **Permission system**: Fine-grained permission control
- **Soft deletes**: Entities can be soft-deleted (not hard deleted)
- **Audit trail**: Changes tracked in Audit model
- **Support tickets**: PQRS system with internal/external comments
- **Surveys**: SurveyJS integration with MongoDB storage
- **Digital custody**: Proceeding threads for document tracking
- **Notifications**: Real-time notification system
- **Themes**: Customizable UI theme per user/company
- **Impersonation**: Admins can impersonate users (check ImpersonationBanner.jsx)

## Git Workflow Notes
- Main branch: `main`
- Recent commits show fixes for duplicate emails, Prisma migrations on Render
- Careful with destructive migrations - Render requires explicit data loss flag
