import { render, screen } from '@testing-library/react';
import UserTable from '../UserTable';

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

  it('debe renderizar la tabla con usuarios', () => {
    render(<UserTable users={mockUsers} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de carga', () => {
    render(<UserTable users={[]} {...mockHandlers} loading={true} />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay usuarios', () => {
    render(<UserTable users={[]} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
  });
});
