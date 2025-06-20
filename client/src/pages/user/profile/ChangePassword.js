import React, { useContext, useState } from 'react';
import { updatePassword } from '../../../services/Api';
import { AuthContext } from '../../../contexts/AuthContext';

const ChangePassword = () => {
const {userInfo, loading} = useContext(AuthContext)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
    if (!newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    if (newPassword.length < 6) newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        const res = await updatePassword(userInfo?.data.id, { oldPassword, newPassword });
        // console.log(res)
        if (res.data.status === 200) {
          alert("Đổi mật khẩu thành công!");
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      } catch {
        setErrors({ oldPassword: "Mật khẩu cũ không đúng hoặc lỗi hệ thống." });
      }
    }
  };

  const renderPasswordInput = (label, value, setValue, error, typeKey) => (
    <div className="mb-3 position-relative">
      <label className="mb-2">{label}</label>
      <input
        type={showPassword[typeKey] ? "text" : "password"}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span
        className="position-absolute"
        style={{ top: 38, right: 15, cursor: "pointer" }}
        onClick={() => toggleShowPassword(typeKey)}
      >
        <i className={`pt-2 fa ${showPassword[typeKey] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </span>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
if (loading || !userInfo) return <p>Đang tải thông tin người dùng...</p>;
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-md-12 col-lg-6">
            <form onSubmit={handleSubmit}>
              {renderPasswordInput("Mật khẩu cũ", oldPassword, setOldPassword, errors.oldPassword, "old")}
              {renderPasswordInput("Mật khẩu mới", newPassword, setNewPassword, errors.newPassword, "new")}
              {renderPasswordInput("Xác nhận mật khẩu", confirmPassword, setConfirmPassword, errors.confirmPassword, "confirm")}

              <div className="submit-section">
                <button type="submit" className="btn btn-primary submit-btn">
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
