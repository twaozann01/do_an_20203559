export const isValidPhone = (phone) => /^0\d{9}$/.test(phone);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isEmpty = (str) => !str || str.trim() === "";

export const validateUserForm = (form) => {
  const errors = {};

  if (!form.fullName || form.fullName.trim() === "") {
    errors.fullName = "Vui lòng nhập họ tên";
  }

  if (!isValidPhone(form.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  if (form.email && !isValidEmail(form.email)) {
    errors.email = "Email không hợp lệ";
  }

  return errors;

  
};