import React, { useState } from "react";
import { signIn } from "../../assets/img/banner";
import { Link, useNavigate } from "react-router-dom";
import { google_icon } from "../../assets/img/icon";
import { loginUser } from "../../services/Api"; // Gọi API login
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ phone, password });
      const { accessToken, refreshToken } = res.data;

      // Lưu token
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = jwtDecode(accessToken);
      const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // Chuyển hướng theo vai trò
      if (role === "Admin") {
        window.location.href = "/admin";
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      setError("Sai số điện thoại hoặc mật khẩu.");
    }
  };

  return (
    <div className="content">
      <div className="container-auth">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="background-container-auth">
                <img src={signIn} alt="Đăng nhập" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="login-container">
                <h1>Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                  <div className="form-group form-active active">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="password-container position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password_confirm"
                        name="confirm_password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#555",
                        }}
                      />
                    </div>

                    <Link to="/forgot-password" className="forgot-password">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <button type="submit">Đăng nhập</button>
                </form>
                <div className="or-separator">or</div>
                <button className="google-login">
                  <img src={google_icon} alt="Google logo" />
                  Đăng nhập bằng Google
                </button>
                <div className="signup-link">
                  Bạn chưa có tài khoản? <Link to="/register">Đăng kí</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
