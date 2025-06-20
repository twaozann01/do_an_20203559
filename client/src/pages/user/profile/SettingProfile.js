/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from "react";
import { putInfo, getInfo } from "../../../services/Api";
import CommonModal from "../../../shared/components/CommonModal";
import { getImage } from "../../../shared/utils/getImage";
import { AuthContext } from "../../../contexts/AuthContext";

const SettingProfile = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPayload, setModalPayload] = useState({
    message: "",
    showActions: false,
  });

  useEffect(() => {
    if (loading || !userInfo || !userInfo?.data.id) return;
    const fetchUser = async () => {
      try {
        const res = await getInfo(userInfo?.data.id);
        const data = res.data.data;
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }
        setUserData(data);
      } catch (err) {
        setModalPayload({
          message: "Lỗi khi tải thông tin người dùng.",
          showActions: false,
        });
        setShowModal(true);
      }
    };
    fetchUser();
  }, [userInfo.data.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        avatar: tempUrl,
      }));
    }
  };

  const handleCancel = async () => {
    try {
      const res = await getInfo(userInfo?.data.id);
      const data = res.data;
      if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth)
          .toISOString()
          .split("T")[0];
      }
      setUserData(data);
      setSelectedFile(null);
    } catch (err) {
      setModalPayload({
        message: "Không thể khôi phục dữ liệu.",
        showActions: false,
      });
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("FullName", userData.fullName || "");
    formData.append("Email", userData.email || "");
    formData.append("Gender", userData.gender || "");
    formData.append("DateOfBirth", userData.dateOfBirth || "");
    formData.append("Bio", userData.bio || "");
    if (selectedFile) {
      formData.append("AvatarFile", selectedFile);
    }

    try {
      const res = await putInfo(userInfo.data.id, formData);
      if (res.status === 200 || res.status === 204) {
        setModalPayload({
          message: "Cập nhật thành công!",
          showActions: false,
        });
        const newRes = await getInfo(userInfo?.data.id);
        const data = newRes.data;
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }
        setUserData(data);
        setSelectedFile(null);
      } else {
        setModalPayload({ message: "Cập nhật thất bại.", showActions: false });
      }
    } catch (err) {
      setModalPayload({
        message: "Đã xảy ra lỗi khi cập nhật.",
        showActions: false,
      });
    } finally {
      setShowModal(true);
    }
  };

  if (!userData) return <p>Đang tải thông tin...</p>;

  return (
    <div className="col-md-12 col-lg-12 col-xl-12">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Thông tin cơ bản</h4>
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <div className="change-avatar d-flex align-items-center">
                  <div className="profile-img me-3">
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : userData.avatar
                          ? getImage(userData.avatar)
                          : getImage(
                              "uploads/avatars/63a1b5dff69d422abece5d8f3c9f06c8.jpg"
                            )
                      }
                      alt="User Avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div className="upload-img">
                    <div className="change-photo-btn">
                      <span>
                        <i className="fa fa-upload" /> Tải ảnh lên
                      </span>
                      <input
                        type="file"
                        className="upload"
                        onChange={handleFileChange}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Cho phép JPG, GIF hoặc PNG. Tối đa 2MB
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="mb-2">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={userData.fullName || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="mb-2">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userData.email || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="mb-2">Giới tính</label>
                <select
                  className="form-select form-control"
                  name="gender"
                  value={userData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-0">
                <label className="mb-2">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={userData.dateOfBirth || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Tiểu sử</h4>
          <div className="mb-0">
            <label className="mb-2">Nội dung</label>
            <textarea
              className="form-control"
              rows={5}
              name="bio"
              value={userData.bio || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="submit-section submit-btn-bottom ms-4 d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary prime-btn"
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Hủy thay đổi
        </button>
      </div>

      <CommonModal
        show={showModal}
        onClose={() => setShowModal(false)}
        type="notify"
        title="Thông báo"
        payload={modalPayload}
      />
    </div>
  );
};

export default SettingProfile;
