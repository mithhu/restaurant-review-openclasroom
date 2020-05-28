export const averageStar = (ratings) => {
  let totalStar = 0;
  let avgStar;
  ratings.map((rating) => {
    totalStar = totalStar + rating.stars;
    return totalStar;
  });
  avgStar = totalStar / ratings.length;
  return avgStar;
};
