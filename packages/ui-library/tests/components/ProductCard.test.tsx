import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { ProductCard } from '../../src/components/ProductCard/ProductCard';
import { Product } from '@3asoftwares/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  shortDescription: 'A great product',
  description: 'Full description',
  price: 99.99,
  compareAtPrice: 129.99,
  inventory: 10,
  images: [{ id: '1', url: '/test.jpg', alt: 'Test', isPrimary: true, order: 1 }],
  rating: 4.5,
  reviewCount: 100,
  categoryId: 'cat1',
  category: { id: 'cat1', name: 'Electronics', slug: 'electronics' } as Product['category'],
  sellerId: 'seller1',
  isFeatured: true,
  isActive: true,
  tags: [],
  variants: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  slug: 'test-product',
  sku: 'TP-001',
  sellerName: 'Test Seller',
  lowStockThreshold: 5,
  totalSold: 50,
  status: 'draft',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows discount badge when compareAtPrice is higher', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('-23%')).toBeInTheDocument();
  });

  it('shows featured badge when product is featured', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('shows out of stock badge when inventory is 0', () => {
    const outOfStockProduct = { ...mockProduct, inventory: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    const badges = screen.getAllByText('Out of Stock');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('renders product rating', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart is clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inventory: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    const button = screen.getByRole('button', { name: /Out of Stock/ });
    expect(button).toBeDisabled();
  });

  it('renders in list variant', () => {
    render(<ProductCard product={mockProduct} variant="list" />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A great product')).toBeInTheDocument();
  });

  it('renders in grid variant by default', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container.querySelector('.group')).toBeInTheDocument();
  });

  it('does not show actions when showActions is false', () => {
    render(<ProductCard product={mockProduct} showActions={false} />);
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });

  it('shows compareAt price with strikethrough', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$129.99')).toHaveClass('line-through');
  });

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('Test');
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('calls onQuickView when provided', () => {
    const onQuickView = vi.fn();
    render(<ProductCard product={mockProduct} onQuickView={onQuickView} />);
  });
});
