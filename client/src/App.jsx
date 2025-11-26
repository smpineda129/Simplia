import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './modules/auth/pages/LoginPage';
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
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/areas" element={<AreaList />} />
          <Route path="/retentions" element={<RetentionList />} />
          <Route path="/retentions/:id" element={<RetentionDetail />} />
          <Route path="/correspondence-types" element={<CorrespondenceTypeList />} />
          <Route path="/templates" element={<TemplateList />} />
          <Route path="/proceedings" element={<ProceedingList />} />
          <Route path="/correspondences" element={<CorrespondenceList />} />
          <Route path="/correspondences/:id" element={<CorrespondenceDetail />} />
          <Route path="/entities" element={<EntityList />} />
          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserProfileView />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/permissions" element={<PermissionList />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
