'use client';

import { Input } from '3a-ecommerce-ui-library';
import { faCheck, faChevronDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  categories: Category[];
  selectedCategory?: string;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  categories,
  selectedCategory = '',
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const categoryExists = categories.some(
    (cat) => cat.name.toLowerCase() === searchTerm.toLowerCase()
  );

  const handleSelectCategory = (categoryName: string) => {
    onSelect(categoryName);
    resetForm();
    onClose();
  };

  const handleCreateCustom = () => {
    if (customCategory.trim()) {
      onSelect(customCategory.trim());
      resetForm();
      onClose();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowCustomInput(false);

    if (value && !categoryExists) {
      setShowCustomInput(true);
    }
  };

  const resetForm = () => {
    setSearchTerm('');
    setCustomCategory('');
    setShowCustomInput(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Select Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
          <FontAwesomeIcon
            icon={faChevronDown}
            className="absolute right-3 top-2.5 size-4 text-gray-400 pointer-events-none"
          />
        </div>
        <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading categories...</div>
          ) : filteredCategories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleSelectCategory(category.name)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      {category.description && (
                        <p className="text-xs text-gray-500">{category.description}</p>
                      )}
                    </div>
                    {selectedCategory === category.name && <FontAwesomeIcon icon={faCheck} />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No categories found</div>
          )}
        </div>

        {showCustomInput && searchTerm && !categoryExists && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="mb-2 text-xs font-medium text-blue-900">
              Create new category: <span className="font-semibold">"{searchTerm}"</span>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Category name"
                value={customCategory || searchTerm}
                onChange={(e) => setCustomCategory(e.target.value)}
                size="sm"
              />
              <button
                onClick={handleCreateCustom}
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="mb-4 rounded-lg bg-green-50 p-3">
            <p className="text-xs font-medium text-green-900">Selected</p>
            <p className="font-medium text-green-700">{selectedCategory}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {selectedCategory && (
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
