export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Bỏ hết ký tự không phải số
  const digits = phone.replace(/\D/g, "");

  // Nếu bắt đầu bằng 84 ➝ chuyển về 0
  const standardized = digits.startsWith("84") && digits.length === 11
    ? "0" + digits.slice(2)
    : digits;

  // Định dạng: 4-3-3 (0987 654 321)
  if (standardized.length === 10) {
    return standardized.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  return standardized;
};
