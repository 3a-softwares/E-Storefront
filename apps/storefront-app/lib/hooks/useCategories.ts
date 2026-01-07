import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { GQL_QUERIES } from '../apollo/queries/queries';
import type { CategoriesData } from '3a-ecommerce-types';
import { useCategoryStore } from '@/store/categoryStore';

export const useCategories = (options?: { skip?: boolean; forceRefetch?: boolean }) => {
  const {
    categories: storedCategories,
    setCategories,
    shouldRefetch,
    isLoaded,
  } = useCategoryStore();

  // Determine if we should skip the fetch
  const skipFetch = useMemo(() => {
    if (options?.skip) return true;
    if (options?.forceRefetch) return false;
    // Skip if we have loaded categories and cache is still valid
    return isLoaded && storedCategories.length > 0 && !shouldRefetch();
  }, [options?.skip, options?.forceRefetch, isLoaded, storedCategories.length, shouldRefetch]);

  const { data, loading, error, refetch } = useQuery<CategoriesData>(
    GQL_QUERIES.GET_CATEGORIES_QUERY,
    {
      variables: {
        filter: {
          isActive: true,
        },
      },
      skip: skipFetch,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: false,
    }
  );

  // Save fetched categories to store
  useEffect(() => {
    const fetchedCategories = data?.categories?.data || [];
    if (fetchedCategories.length > 0) {
      setCategories(fetchedCategories);
    }
  }, [data, setCategories]);

  // Return stored categories if available, otherwise return fetched data
  const categories = storedCategories.length > 0 ? storedCategories : data?.categories?.data || [];

  return {
    categories,
    data: { data: categories },
    loading: loading && storedCategories.length === 0,
    isLoading: loading && storedCategories.length === 0,
    error,
    refetch,
    isFromCache: storedCategories.length > 0 && !loading,
  };
};

export default useCategories;
