import React, { useState } from "react";

const Profile = () => {
  const [adminInfo] = useState({
    name: "Admin Hệ thống",
    email: "admin@example.com",
    phone: "0123 456 789",
    address: "123 Hoàng Quốc Việt, Hà Nội",
    createdAt: "01/01/2024",
    avatar: "https://i.pravatar.cc/150?img=10",
    role: "Quản trị viên",
    gender: "Nam",
    dob: "15/05/1995",
    status: "Đang hoạt động"
  });

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body d-flex">
          <img
            src={adminInfo.avatar}
            alt="Admin Avatar"
            className="rounded-circle me-4"
            width={100}
            height={100}
          />
          <div>
            <h3 className="mb-1">{adminInfo.name}</h3>
            <p className="text-muted">{adminInfo.role}</p>
            <div className="row mt-3">
              <div className="col-md-6">
                <p><strong>Email:</strong> {adminInfo.email}</p>
                <p><strong>Điện thoại:</strong> {adminInfo.phone}</p>
                <p><strong>Giới tính:</strong> {adminInfo.gender}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Địa chỉ:</strong> {adminInfo.address}</p>
                <p><strong>Ngày sinh:</strong> {adminInfo.dob}</p>
                <p><strong>Ngày tạo tài khoản:</strong> {adminInfo.createdAt}</p>
                <p><strong>Trạng thái:</strong> {adminInfo.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
