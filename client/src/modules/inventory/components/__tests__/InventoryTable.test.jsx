import { render, screen } from '@testing-library/react';
import InventoryTable from '../InventoryTable';

describe('InventoryTable', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Laptop',
      category: 'Electrónica',
      quantity: 10,
      price: 1500,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mouse',
      category: 'Accesorios',
      quantity: 50,
      price: 25,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  it('debe renderizar la tabla con items', () => {
    render(<InventoryTable items={mockItems} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de carga', () => {
    render(<InventoryTable items={[]} {...mockHandlers} loading={true} />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay items', () => {
    render(<InventoryTable items={[]} {...mockHandlers} loading={false} />);
    
    expect(screen.getByText('No hay items en el inventario')).toBeInTheDocument();
  });
});
