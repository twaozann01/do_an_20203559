export const formatPrice = (price) => {
  const safePrice = isNaN(price) ? 0 : Math.round(price);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  }).format(safePrice);
};
