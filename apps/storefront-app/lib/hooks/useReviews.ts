import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries/queries';
import type { ReviewData as Review, ReviewConnection, CreateReviewInput } from '3a-ecommerce-types';

export function useProductReviews(productId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['productReviews', productId, page, limit],
    queryFn: async () => {
      const { data } = await apolloClient.query<{ productReviews: ReviewConnection }>({
        query: GQL_QUERIES.GET_PRODUCT_REVIEWS_QUERY,
        variables: { productId, page, limit },
        fetchPolicy: 'cache-first',
      });
      return data.productReviews;
    },
    enabled: !!productId,
    staleTime: 1000 * 60,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const { productId, rating, comment } = input;
      const { data } = await apolloClient.mutate<{
        createReview: { success: boolean; message: string; review: Review };
      }>({
        mutation: GQL_QUERIES.CREATE_REVIEW_MUTATION,
        variables: {
          productId,
          input: { rating, comment },
        },
      });
      return data?.createReview;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) => {
      const { data } = await apolloClient.mutate<{
        markReviewHelpful: { success: boolean; helpfulCount: number };
      }>({
        mutation: GQL_QUERIES.MARK_REVIEW_HELPFUL_MUTATION,
        variables: { reviewId },
      });
      return data?.markReviewHelpful;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', variables.productId] });
    },
  });
}
