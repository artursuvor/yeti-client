import { Review } from '../types/types';

export const calculateAverageRating = (reviews: Review[] | undefined) => {
  if (!reviews || reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};
