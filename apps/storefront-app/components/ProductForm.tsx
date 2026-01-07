'use client';

import React, { useState } from 'react';
import CategoryModal from './CategoryModal';
import { useCategories } from '@/lib/hooks/useCategories';
import { Input } from '3a-ecommerce-ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface ProductFormProps {
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
  };
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || '',
    stock: initialData.stock || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleClearCategory = () => {
    setFormData((prev) => ({
      ...prev,
      category: '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price (USD) *</label>
        <Input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <Input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category *</label>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {formData.category ? (
              <span className="font-medium">{formData.category}</span>
            ) : (
              <span className="text-gray-500">Select a category...</span>
            )}
          </button>
          {formData.category && (
            <button
              type="button"
              onClick={handleClearCategory}
              className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={handleCategorySelect}
        categories={categories}
        selectedCategory={formData.category}
        isLoading={categoriesLoading}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
