/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { forgot } from "../../assets/img/banner";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/verify-code')
    // try {
    //   await axios.post('/api/verify-phone', { phone: '0123456789' });
    //   navigate('/verify-code'); // chuyển trang sau khi gửi thành công
    // } catch (error) {
    //   console.error('Lỗi khi gửi mã:', error);
    // }
  };
  return (
    <div>
      {/* Page Content */}
      <div className="content">
        {/* Register */}
        <div className="container-auth">
          <div className="container">
            <div className="row">
              {/* Background  */}
              <div className="col-lg-7">
                <div className="background-container-auth">
                  <img src={forgot} alt className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-5">
                <div className="success-container">
                  <div className="login-container">
                    <h1>Khôi phục mật khẩu</h1>
                    <form>
                      <div
                        id="phoneInputGroup"
                        className="form-group form-active active"
                      >
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="container-submit">
                        <button
                          className="submit-request btn btn-primary w-100"
                          type="button"
                          onClick={handleSubmit} // function xử lý gửi mã
                        >
                          Nhận mã
                        </button>
                      </div>
                    </form>
                    <div className="signup-link">
                      Bạn nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        {/* End Register */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default ForgotPassword;
