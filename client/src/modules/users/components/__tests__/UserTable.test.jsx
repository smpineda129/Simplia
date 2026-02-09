import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserTable from '../UserTable';
import { usePermissions } from '../../../../hooks/usePermissions';
import { useAuth } from '../../../../hooks/useAuth';

// Mock hooks
jest.mock('../../../../hooks/usePermissions');
jest.mock('../../../../hooks/useAuth');

describe('UserTable', () => {
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Admin',
      email: 'jane@example.com',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  const mockCurrentUser = {
    id: 'admin-id',
    name: 'Admin User',
    role: 'ADMIN',
  };

  beforeEach(() => {
    // Setup default mock return values
    usePermissions.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
      canImpersonateUser: jest.fn().mockReturnValue(true),
    });

    useAuth.mockReturnValue({
      user: mockCurrentUser,
      startImpersonation: jest.fn(),
      isImpersonating: false,
    });
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('debe renderizar la tabla con usuarios', () => {
    renderWithRouter(<UserTable users={mockUsers} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('debe mostrar skeleton de carga', () => {
    const { container } = renderWithRouter(<UserTable users={[]} {...mockHandlers} loading={true} />);
    
    // Verificamos que existan elementos Skeleton (MUI usa esta clase)
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay usuarios', () => {
    renderWithRouter(<UserTable users={[]} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
  });
});
