/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getCustomer, updateStatus, deleteCustomer } from "../../services/Api";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";
import CommonModal from "../../shared/components/CommonModal";
import { formatDate, formatDateTime } from "../../shared/utils/formatDate";

const ListCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState({ show: false, userId: null, type: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCustomerData(refreshKey);
  }, [refreshKey]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const res = await getCustomer();
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách khách hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers
    .filter((c) =>
      searchName.trim() === ""
        ? true
        : c.fullName?.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((c) => {
      const role = c.role?.toLowerCase();
      return filterRole === "Tất cả"
        ? role === "customer" || role === "repairman"
        : role === filterRole.toLowerCase();
    })
    .filter((c) => {
      if (filterStatus === "Tất cả") return true;
      return c.status === filterStatus;
    })
    .sort((a, b) => a.fullName?.localeCompare(b.fullName));

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (userId) => {
    setModalData({ show: true, userId, type: "delete" });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCustomer(modalData.userId);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Lỗi xoá người dùng", err);
    } finally {
      setModalData({ show: false, userId: null, type: "" });
    }
  };

  const handleConfirmToggleStatus = async () => {
    try {
      const user = customers.find((u) => u.id === modalData.userId);
      const newStatus = user?.status === "Active" ? "Inactive" : "Active";
      const res = await updateStatus(modalData.userId, { status: newStatus });
      if (res.status === 200) {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái", err);
    } finally {
      setModalData({ show: false, userId: null, type: "" });
    }
  };

  const handleToggleStatus = (userId) => {
    setModalData({ show: true, userId, type: "confirm" });
  };

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <h4 className="card-title mb-0">Danh sách khách hàng & kỹ thuật viên</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="form-select w-auto"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Đã vô hiệu hóa</option>
          </select>
          <select
            className="form-select w-auto"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Tất cả">Tất cả vai trò</option>
            <option value="Customer">Khách hàng</option>
            <option value="Repairman">Kỹ thuật viên</option>
          </select>
        </div>
      </div>

      <div className="card-body table-responsive">
        {loading ? (
          <div className="text-center">Đang tải dữ liệu...</div>
        ) : (
          <>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">Không có dữ liệu</td>
                  </tr>
                ) : (
                  paginatedCustomers.map((cus, index) => (
                    <tr key={cus.id}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td>{cus.fullName || "Chưa có"}</td>
                      <td>{cus.phone || "Chưa có"}</td>
                      <td>{cus.email || "Chưa có"}</td>
                      <td>
                        {cus.createdAt
                          ? formatDateTime(cus.createdAt)
                          : "Không có"}
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 ${
                          cus.role?.toLowerCase() === "repairman" ? "bg-warning text-dark" : "bg-info"
                        }`}>
                          {cus.role || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 ${
                          cus.status === "Active" ? "bg-success" : "bg-secondary"
                        }`}>
                          {cus.status || "Không rõ"}
                        </span>
                      </td>
                      <td className="d-flex gap-2">
                        <button
                          className={`btn btn-sm border-0 ${cus.status === "Active" ? "text-success" : "text-secondary"}`}
                          title="Bật/tắt trạng thái"
                          onClick={() => handleToggleStatus(cus.id)}
                        >
                          <i className={`fas ${cus.status === "Active" ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
                        </button>
                        <button
                          className="btn btn-sm border-0 text-danger"
                          title="Xoá người dùng"
                          onClick={() => handleDelete(cus.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      <CommonModal
        show={modalData.show}
        type={modalData.type === "delete" ? "delete" : "confirm"}
        title={
          modalData.type === "delete"
            ? "Xác nhận xoá người dùng"
            : "Xác nhận thay đổi trạng thái"
        }
        payload={modalData.userId}
        onClose={() => setModalData({ show: false, userId: null, type: "" })}
        onSubmit={modalData.type === "delete" ? handleConfirmDelete : handleConfirmToggleStatus}
      />
    </div>
  );
};

export default ListCustomer;
