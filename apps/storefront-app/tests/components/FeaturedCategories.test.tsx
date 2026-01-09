import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturedCategories } from '../../components/FeaturedCategories';

describe('FeaturedCategories Component', () => {
  it('should render all default categories', () => {
    render(<FeaturedCategories />);

    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
  });

  it('should render 4 category cards', () => {
    const { container } = render(<FeaturedCategories />);

    const categoryCards = container.querySelectorAll('.bg-white.rounded-lg');
    expect(categoryCards).toHaveLength(4);
  });

  it('should render category images', () => {
    render(<FeaturedCategories />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);

    expect(images[0]).toHaveAttribute('alt', 'Electronics');
    expect(images[1]).toHaveAttribute('alt', 'Fitness');
    expect(images[2]).toHaveAttribute('alt', 'Home');
    expect(images[3]).toHaveAttribute('alt', 'Accessories');
  });

  it('should have correct image sources', () => {
    render(<FeaturedCategories />);

    const electronicsImg = screen.getByAltText('Electronics');
    expect(electronicsImg).toHaveAttribute('src', '/images/electronics.jpg');

    const fitnessImg = screen.getByAltText('Fitness');
    expect(fitnessImg).toHaveAttribute('src', '/images/fitness.jpg');
  });

  it('should render grid layout', () => {
    const { container } = render(<FeaturedCategories />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-2');
    expect(grid).toHaveClass('md:grid-cols-4');
  });

  it('should have rounded-full images', () => {
    render(<FeaturedCategories />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveClass('rounded-full');
    });
  });
});
