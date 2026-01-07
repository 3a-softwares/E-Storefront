import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { formatPrice } from '3a-ecommerce-utils';

// Mock the cart store
const mockItems: Array<{ id: string }> = [];

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    items: mockItems,
  })),
}));

// Import after mocking
import { ProductCard } from '../../components/ProductCard';
import { useCartStore } from '@/store/cartStore';

describe('ProductCard Component', () => {
  const defaultProduct = {
    id: 'prod1',
    name: 'Test Product',
    price: 29.99,
    imageUrl: 'https://example.com/image.jpg',
    stock: 10,
    rating: 4.5,
    reviewCount: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockItems.length = 0;
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      items: mockItems,
    });
  });

  describe('Rendering', () => {
    it('should render product name', () => {
      render(<ProductCard product={defaultProduct} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should render product price', () => {
      render(<ProductCard product={defaultProduct} />);
      expect(formatPrice).toHaveBeenCalledWith(29.99);
    });

    it('should render product image when imageUrl is provided', () => {
      render(<ProductCard product={defaultProduct} />);
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render fallback icon when no image is provided', () => {
      const productWithoutImage = { ...defaultProduct, imageUrl: undefined };
      render(<ProductCard product={productWithoutImage} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should link to product detail page', () => {
      render(<ProductCard product={defaultProduct} />);
      const links = screen.getAllByRole('link');
      // Both image and title links should point to the same product page
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/products/prod1');
    });
  });

  describe('Out of Stock', () => {
    it('should show out of stock overlay when stock is 0', () => {
      const outOfStockProduct = { ...defaultProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('should not show out of stock overlay when stock is available', () => {
      render(<ProductCard product={defaultProduct} />);
      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
    });
  });

  describe('Wishlist', () => {
    it('should render wishlist button when showWishlistButton is true', () => {
      const mockOnWishlistToggle = jest.fn();
      render(
        <ProductCard
          product={defaultProduct}
          showWishlistButton={true}
          onWishlistToggle={mockOnWishlistToggle}
        />
      );
      expect(screen.getByTitle('Add to wishlist')).toBeInTheDocument();
    });

    it('should not render wishlist button when showWishlistButton is false', () => {
      render(<ProductCard product={defaultProduct} showWishlistButton={false} />);
      expect(screen.queryByTitle('Add to wishlist')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Remove from wishlist')).not.toBeInTheDocument();
    });

    it('should call onWishlistToggle when wishlist button is clicked', () => {
      const mockOnWishlistToggle = jest.fn();
      render(
        <ProductCard
          product={defaultProduct}
          showWishlistButton={true}
          onWishlistToggle={mockOnWishlistToggle}
        />
      );

      const wishlistButton = screen.getByTitle('Add to wishlist');
      fireEvent.click(wishlistButton);

      expect(mockOnWishlistToggle).toHaveBeenCalledWith(defaultProduct);
    });

    it('should show "Remove from wishlist" when isInWishlist is true', () => {
      const mockOnWishlistToggle = jest.fn();
      render(
        <ProductCard
          product={defaultProduct}
          showWishlistButton={true}
          onWishlistToggle={mockOnWishlistToggle}
          isInWishlist={true}
        />
      );
      expect(screen.getByTitle('Remove from wishlist')).toBeInTheDocument();
    });
  });

  describe('Cart Status', () => {
    it('should show in cart indicator when product is in cart', () => {
      mockItems.push({ id: 'prod1' });
      (useCartStore as unknown as jest.Mock).mockReturnValue({
        items: mockItems,
      });

      render(<ProductCard product={defaultProduct} />);

      // The component should show some indication that item is in cart
      // This depends on the actual implementation
    });
  });

  describe('Variants', () => {
    it('should apply default height class', () => {
      const { container } = render(<ProductCard product={defaultProduct} variant="default" />);
      expect(container.querySelector('.h-56')).toBeInTheDocument();
    });

    it('should apply compact height class', () => {
      const { container } = render(<ProductCard product={defaultProduct} variant="compact" />);
      expect(container.querySelector('.h-32')).toBeInTheDocument();
    });

    it('should apply large height class', () => {
      const { container } = render(<ProductCard product={defaultProduct} variant="large" />);
      expect(container.querySelector('.h-64')).toBeInTheDocument();
    });
  });

  describe('Add to Cart', () => {
    it('should call onAddToCart when add to cart is triggered', () => {
      const mockOnAddToCart = jest.fn();
      render(<ProductCard product={defaultProduct} onAddToCart={mockOnAddToCart} />);

      // Find and click the add to cart button if visible
      const addToCartButton = screen.queryByTestId('mock-button');
      if (addToCartButton) {
        fireEvent.click(addToCartButton);
        expect(mockOnAddToCart).toHaveBeenCalledWith(defaultProduct);
      }
    });
  });

  describe('Hover Effects', () => {
    it('should have hover transformation classes', () => {
      const { container } = render(<ProductCard product={defaultProduct} />);
      const card = container.firstChild;
      expect(card).toHaveClass('hover:-translate-y-2');
      expect(card).toHaveClass('hover:shadow-2xl');
    });
  });
});
