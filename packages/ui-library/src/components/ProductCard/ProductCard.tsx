

import { Product } from '@3asoftwares/types';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  variant?: 'grid' | 'list';
  showActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  variant = 'grid',
  showActions = true,
}) => {
  const primaryImage = product.images.find((img:any) => img.isPrimary) || product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  if (variant === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt || product.name}
          className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-700 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mt-1">{product.shortDescription}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-xs sm:text-sm font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
              <span className="ml-1 text-xs sm:text-sm text-gray-600">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-blue-700">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs sm:text-sm text-gray-600 line-through">
                    ${product.compareAtPrice!.toFixed(2)}
                  </span>
                  <span className="text-xs sm:text-sm text-green-700 font-bold">-{discountPercent}%</span>
                </>
              )}
            </div>
            {showActions && (
              <button
                onClick={() => onAddToCart?.(product)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all touch-manipulation"
                disabled={product.inventory === 0}
              >
                {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
            Featured
          </span>
        )}
        {product.inventory === 0 && (
          <span className="px-2 py-1 bg-gray-700 text-white text-xs font-bold rounded">
            Out of Stock
          </span>
        )}
      </div>

      {showActions && (
        <button
          onClick={() => onAddToWishlist?.(product.id)}
          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600 hover:text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => onQuickView?.(product)}
              className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mb-1 uppercase">
          {product.category?.name || 'Uncategorized'}
        </p>
        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 hover:text-blue-700 cursor-pointer mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="ml-1 text-sm font-semibold text-gray-900">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-600">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl font-bold text-blue-700">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-600 line-through">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {showActions && (
          <button
            onClick={() => onAddToCart?.(product)}
            className="w-full py-2 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation"
            disabled={product.inventory === 0}
          >
            {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};
