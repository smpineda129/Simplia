import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './modules/auth/pages/LoginPage';
import ForbiddenPage from './modules/auth/pages/ForbiddenPage';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import { UserList, UserProfile, UserProfileView } from './modules/users';
import { CompanyList } from './modules/companies';
import CompanyDetail from './modules/companies/pages/CompanyDetail';
import { AreaList } from './modules/areas';
import { RetentionList, RetentionDetail } from './modules/retentions';
import { CorrespondenceTypeList } from './modules/correspondence-types';
import { TemplateList } from './modules/templates';
import { ProceedingList } from './modules/proceedings';
import { CorrespondenceList, CorrespondenceDetail } from './modules/correspondences';
import { EntityList } from './modules/entities';
import { WarehouseList } from './modules/warehouses';
import { RoleList } from './modules/roles';
import { PermissionList } from './modules/permissions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas de autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/companies"
            element={
              <ProtectedRoute requiredPermission="company.view">
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <ProtectedRoute requiredPermission="company.view">
                <CompanyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/areas"
            element={
              <ProtectedRoute requiredPermission="area.view">
                <AreaList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retentions"
            element={
              <ProtectedRoute requiredPermission="retention.view">
                <RetentionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retentions/:id"
            element={
              <ProtectedRoute requiredPermission="retention.view">
                <RetentionDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/correspondence-types"
            element={
              <ProtectedRoute requiredPermission="correspondence_type.view">
                <CorrespondenceTypeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute requiredPermission="template.view">
                <TemplateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proceedings"
            element={
              <ProtectedRoute requiredPermission="proceeding.view">
                <ProceedingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/correspondences"
            element={
              <ProtectedRoute requiredPermission="correspondence.view">
                <CorrespondenceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/correspondences/:id"
            element={
              <ProtectedRoute requiredPermission="correspondence.view">
                <CorrespondenceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entities"
            element={
              <ProtectedRoute requiredPermission="entity.view">
                <EntityList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouses"
            element={
              <ProtectedRoute requiredPermission="warehouse.view">
                <WarehouseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission="user.view">
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute requiredPermission="user.view">
                <UserProfileView />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredPermission="role.view">
                <RoleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute requiredPermission="permission.view">
                <PermissionList />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
