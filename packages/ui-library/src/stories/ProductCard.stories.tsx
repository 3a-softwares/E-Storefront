import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from '../components/ProductCard';
import { ProductStatus } from '3a-ecommerce-types';

const meta = {
  title: 'Data Display/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProduct = {
  id: 'p1',
  slug: 'demo-product',
  name: 'Demo Product',
  description: 'Full product description',
  shortDescription: 'Short description',
  price: 29.99,
  compareAtPrice: 39.99,
  sku: 'DEMO-001',
  inventory: 5,
  rating: 4.5,
  reviewCount: 12,
  images: [{ id: 'img1', url: 'https://via.placeholder.com/300', alt: 'Demo Product Image', isPrimary: true, order: 0 }],
  isFeatured: true,
  isActive: true,
  sellerId: 'seller1',
  sellerName: 'Demo Seller',
  categoryId: 'cat1',
  category: { id: 'cat1', slug: 'category', name: 'Category', order: 0, isActive: true },
  tags: [],
  status: 'active' as ProductStatus,
  lowStockThreshold: 10,
  totalSold: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Grid: Story = { args: { product: mockProduct, variant: 'grid' } };
export const List: Story = { args: { product: mockProduct, variant: 'list' } };
