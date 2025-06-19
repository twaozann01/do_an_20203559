const RatingStars = ({ average = 0, reviewCount = 0 }) => {
  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.25 && average - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating-stars mb-2">
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star text-warning" />
      ))}
      {hasHalfStar && <i className="fas fa-star-half-alt text-warning" />}
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star text-warning" />
      ))}
      <span className="text-muted ms-1">
        {(average??0).toFixed(1)} ({reviewCount} đánh giá)
      </span>
    </div>
  );
};
export default RatingStars;
