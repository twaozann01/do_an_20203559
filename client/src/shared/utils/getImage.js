import { BASE_URL } from "../constants/app";

export const getImage = (image) => {
  if (!image) {
    console.warn("⚠️ getImage() được gọi với giá trị không hợp lệ:", image, new Error().stack);
    return "/default.png"; // hoặc ảnh mặc định nếu muốn
  }

  return `${BASE_URL}${image}`;
};
