/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/Api";
import { signUp } from "../../assets/img/banner/";
import { google_icon } from "../../assets/img/icon";
import { validateUserForm } from "../../shared/utils/validate";
import CommonModal from "../../shared/components/CommonModal";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalData, setModalData] = useState({ show: false, title: "", payload: null });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateUserForm(form);

    if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!form.agreed) {
      newErrors.agreed = "Bạn phải đồng ý với điều khoản dịch vụ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("FullName", form.fullName);
    formData.append("Phone", form.phone);
    formData.append("Password", form.password);

    try {
      await registerUser(formData);
      setModalData({
        show: true,
        title: "Đăng ký thành công",
        payload: {
          message: "Bạn đã đăng ký tài khoản thành công.\nBạn có muốn chuyển sang trang đăng nhập không?",
          showActions: true,
          submitText: "Đăng nhập",
        },
      });
    } catch (err) {
      console.log("API error:", err);
      const errorResponse = err.response?.data;

      if (errorResponse?.toString()?.includes("IX_Users_Phone")) {
        setErrors((prev) => ({ ...prev, phone: "Số điện thoại đã được sử dụng. Vui lòng chọn số khác." }));
      } else {
        setModalData({
          show: true,
          title: "Đăng ký không thành công",
          payload: {
            message: "Số điện thoại đã tồn tại",
            showActions: false,
          },
        });
      }
    }
  };

  const getInputClass = (field) => errors[field] ? "form-control border border-danger" : "form-control";

  return (
    <div className="content">
      <div className="container-auth">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="background-container-auth">
                <img src={signUp} alt="Đăng ký" className="img-fluid" />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="login-container">
                <h1>Đăng ký</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Họ & Tên</label>
                    <input type="text" name="fullName" className={getInputClass("fullName")} placeholder="Nhập tên của bạn" value={form.fullName} onChange={handleChange} />
                    {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" name="phone" className={getInputClass("phone")} placeholder="Nhập số điện thoại" value={form.phone} onChange={handleChange} />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <div className="password-container position-relative">
                      <input type={showPassword ? "text" : "password"} name="password" className={getInputClass("password")} placeholder="Nhập mật khẩu" value={form.password} onChange={handleChange} />
                      <span className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                      </span>
                    </div>
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <div className="password-container position-relative">
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" className={getInputClass("confirmPassword")} placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={handleChange} />
                      <span className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                      </span>
                    </div>
                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                  </div>
                  <div className="form-group form-check">
                    <input type="checkbox" name="agreed" className={errors.agreed ? "form-check-input border border-danger" : "form-check-input"} checked={form.agreed} onChange={handleChange} />
                    <label className="form-check-label">
                      Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
                    </label>
                    {errors.agreed && <small className="text-danger d-block">{errors.agreed}</small>}
                  </div>
                  <button type="submit">Đăng ký</button>
                </form>

                <div className="or-separator">hoặc</div>
                <button className="google-login">
                  <img src={google_icon} alt="Google" /> Đăng nhập bằng Google
                </button>
                <div className="signup-link">
                  Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <CommonModal
        show={modalData.show}
        type="notify"
        title={modalData.title}
        payload={modalData.payload}
        onClose={() => setModalData({ show: false, title: "", payload: null })}
        onSubmit={() => navigate("/login")}
      />
    </div>
  );
};

export default Register;
