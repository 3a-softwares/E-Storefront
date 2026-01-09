import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedProducts } from '../../components/FeaturedProducts';

describe('FeaturedProducts Component', () => {
  const mockProducts = [
    {
      _id: { $oid: 'prod1' },
      name: 'Product 1',
      price: 29.99,
      images: ['https://example.com/image1.jpg'],
    },
    {
      _id: { $oid: 'prod2' },
      name: 'Product 2',
      price: 49.99,
      images: ['https://example.com/image2.jpg'],
    },
    {
      _id: { $oid: 'prod3' },
      name: 'Product 3',
      price: 19.99,
      images: ['https://example.com/image3.jpg'],
    },
  ];

  it('should render all products', () => {
    render(<FeaturedProducts products={mockProducts} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  it('should display product prices', () => {
    render(<FeaturedProducts products={mockProducts} />);

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('should render product images', () => {
    render(<FeaturedProducts products={mockProducts} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Product 1');
  });

  it('should render empty grid when no products', () => {
    const { container } = render(<FeaturedProducts products={[]} />);

    const productCards = container.querySelectorAll('.bg-white.rounded-lg');
    expect(productCards).toHaveLength(0);
  });

  it('should render grid layout', () => {
    const { container } = render(<FeaturedProducts products={mockProducts} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('md:grid-cols-4');
  });

  it('should handle single product', () => {
    render(<FeaturedProducts products={[mockProducts[0]]} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });
});
