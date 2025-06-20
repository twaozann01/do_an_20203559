import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { getRepairmanFormUser } from "../../../services/Api";
import { formatDateTime } from "../../../shared/utils";

const FormRegistered = () => {
  const { userInfo } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await getRepairmanFormUser(userInfo?.data.id);
        setForms(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn:", error);
      }
    };

    if (userInfo?.data.id) {
      fetchForms();
    }
  }, [userInfo]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="badge bg-primary-light">Được chấp nhận</span>;
      case "Rejected":
        return <span className="badge bg-danger-light">Đã từ chối</span>;
      case "Processing":
      default:
        return <span className="badge bg-warning">Đang chờ duyệt</span>;
    }
  };

  const filteredForms = forms.filter((form) => {
    if (activeTab === "all") return true;
    return form.status === activeTab;
  });

  return (
    <div>
      <nav className="user-tabs mb-4">
        <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>Tất cả</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "Processing" ? "active" : ""}`} onClick={() => setActiveTab("Processing")}>Đang xử lý</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "Accepted" ? "active" : ""}`} onClick={() => setActiveTab("Accepted")}>Được chấp nhận</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "Rejected" ? "active" : ""}`} onClick={() => setActiveTab("Rejected")}>Bị từ chối</button>
          </li>
        </ul>
      </nav>

      <div className="table-responsive">
        <table className="table table-hover table-center mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Dịch vụ</th>
              <th>Ngày Gửi</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredForms.map((form, index) => (
              <tr key={form.id}>
                <td>{index + 1}</td>
                <td>{form.detail?.serviceDevice?.name || "Không rõ"}</td>
                <td>
                  {form.createdAt && form.createdAt !== "0001-01-01T00:00:00"
                    ? formatDateTime(form.createdAt)
                    : "Chưa xác định"}
                </td>
                <td>{getStatusBadge(form.status)}</td>
              </tr>
            ))}
            {filteredForms.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có đơn đăng ký nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormRegistered;
