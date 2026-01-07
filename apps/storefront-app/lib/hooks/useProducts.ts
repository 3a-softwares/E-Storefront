

import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries/queries';
import type {
  ProductsResponse,
  ProductResponse,
  CategoriesResponse
} from '3a-ecommerce-types';
import { ProductFilters } from '3a-ecommerce-types/hooks.types';

export function useProducts(page: number = 1, limit: number = 20, filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: async () => {
      const { data } = await apolloClient.query<ProductsResponse>({
        query: GQL_QUERIES.GET_PRODUCTS_QUERY,
        variables: {
          page,
          limit,
          ...filters,
        },
        fetchPolicy: 'network-only',
      });

      return data.products as any;
    },
    staleTime: 0,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apolloClient.query<ProductResponse>({
        query: GQL_QUERIES.GET_PRODUCT_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return data.product;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, 
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apolloClient.query<CategoriesResponse>({
        query: GQL_QUERIES.GET_CATEGORIES_QUERY,
        fetchPolicy: 'cache-first',
      });

      return data.categories;
    },
    staleTime: 1000 * 60 * 30,
  });
}
