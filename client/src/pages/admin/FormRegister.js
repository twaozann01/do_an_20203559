/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getInfo,
  getRepairmanForms,
  getService,
  updateRepairmanForm,
  getAddress,
  updateRole,
} from "../../services/Api";
import { formatDate } from "../../shared/utils";
import { getImage } from "../../shared/utils/getImage";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";

const FormRegister = () => {
  const [forms, setForms] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [mainAddressMap, setMainAddressMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const res = await getRepairmanForms({
          params: {
            offset: offset,
            limit: ITEMS_PER_PAGE,
          },
        });
        const formList = res.data.items;
        setForms(formList);
         setTotalItems(res.data.totalItems || 50);
        const userMap = {};
        const addressMap = {};

        await Promise.all(
          formList.map(async (form) => {
            const resUser = await getInfo(form.userId);
            userMap[form.userId] = resUser.data;

            try {
              const resAddress = await getAddress(form.userId);
              const main = resAddress.data.find((a) => a.addressMain === true);
              if (main) {
                addressMap[
                  form.userId
                ] = `${main.street}, ${main.ward}, ${main.district}, ${main.city}`;
              }
            } catch (err) {
              console.warn(
                "Không lấy được địa chỉ chính cho userId:",
                form.userId
              );
            }
          })
        );

        setUserInfoMap(userMap);
        setMainAddressMap(addressMap);

        const serviceIds = [
          ...new Set(
            formList.map((form) => form.detail?.serviceDevice?.serviceId)
          ),
        ].filter(Boolean);

        const serviceFetches = await Promise.all(
          serviceIds.map(async (serviceId) => {
            const resService = await getService(serviceId);
            return { id: serviceId, name: resService.data.name };
          })
        );
        const map = {};
        serviceFetches.forEach(({ id, name }) => {
          map[id] = name;
        });
        setServiceMap(map);
      } catch (error) {
        console.error("Lỗi khi lấy forms hoặc thông tin:", error);
      }
    };

    fetchForms();
  }, [currentPage, filterStatus]);

  const handleStatusChange = async (formId, newStatus) => {
    const actionText =
      newStatus === "Accepted"
        ? "duyệt đơn và cấp vai trò 'Thợ'"
        : "từ chối đơn";

    const confirmed = window.confirm(`Bạn có chắc muốn ${actionText} không?`);
    if (!confirmed) return;

    try {
      // Gọi API để cập nhật trạng thái đơn
      await updateRepairmanForm(formId, { status: newStatus });

      // Cập nhật UI: đổi trạng thái trong danh sách đơn
      setForms((prev) =>
        prev.map((form) =>
          form.id === formId ? { ...form, status: newStatus } : form
        )
      );

      // Thông báo kết quả
      alert(
        newStatus === "Accepted"
          ? "✅ Đã duyệt đơn thành công!"
          : "❌ Đã từ chối đơn thành công!"
      );
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
      alert("⚠️ Có lỗi xảy ra khi cập nhật, vui lòng thử lại.");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Processing":
        return "Đang xử lý";
      case "Accepted":
        return "Đã duyệt";
      case "Rejected":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const filteredForms = forms.filter((form) =>
    filterStatus === "All" ? true : form.status === filterStatus
  );
const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  return (
    <div>
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Danh sách đơn đăng ký thợ sửa chữa</h3>
          <select
            className="form-select w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Accepted">Đã duyệt</option>
            <option value="Rejected">Bị từ chối</option>
          </select>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Thiết bị</th>
              <th>Khu vực</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredForms.map((form, index) => {
              const device = form.detail?.serviceDevice;
              const serviceName = device?.service?.name || "Không rõ";
              const deviceName = device?.name || "Không có";
              const user = userInfoMap[form.userId] || {};
              const fullName = user.fullName || "Đang tải...";
              const createdDate = form.createdAt
                ? formatDate(form.createdAt)
                : "Không rõ";

              return (
                <tr key={form.id}>
                  <td>{index + 1}</td>
                  <td>{fullName}</td>
                  <td>{deviceName}</td>
                  <td>
                    {form.district || ""}, {form.city || ""}
                  </td>
                  <td>{createdDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        form.status === "Processing"
                          ? "bg-warning text-dark"
                          : form.status === "Accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {getStatusText(form.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => {
                        setSelectedForm(form);
                        setShowModal(true);
                      }}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
  <nav className="mt-3">
    <ul className="pagination justify-content-center">
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
)}

      {showModal && selectedForm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chi tiết đơn đăng ký kỹ thuật viên
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Avatar */}
                  <div className="col-md-12 text-center">
                    <img
                      src={getImage(userInfoMap[selectedForm.userId]?.avatar)}
                      alt="avatar"
                      className="rounded-circle mb-3"
                      width="120"
                      height="120"
                    />
                    <h5>
                      {userInfoMap[selectedForm.userId]?.fullName ||
                        "Đang tải..."}
                    </h5>
                  </div>

                  {/* Số điện thoại và email */}
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={userInfoMap[selectedForm.userId]?.phone || ""}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      readOnly
                      value={userInfoMap[selectedForm.userId]?.email || ""}
                    />
                  </div>

                  {/* Địa chỉ chính */}
                  <div className="col-md-12">
                    <label className="form-label">Địa chỉ thường trú</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={mainAddressMap[selectedForm.userId] || "Không rõ"}
                    />
                  </div>

                  {/* Khu vực hoạt động */}
                  <div className="col-md-12">
                    <label className="form-label">Khu vực hoạt động</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={`${selectedForm.district || ""}, ${
                        selectedForm.city || ""
                      }`}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Thiết bị</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={selectedForm.detail?.serviceDevice?.name || ""}
                    />
                  </div>

                  {/* Kinh nghiệm và mô tả */}
                  <div className="col-md-6">
                    <label className="form-label">Số năm kinh nghiệm</label>
                    <input
                      type="number"
                      className="form-control"
                      readOnly
                      value={selectedForm.detail?.yearsOfExperience || ""}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ngày gửi</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={formatDate(selectedForm.createdAt)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Trạng thái</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={getStatusText(selectedForm.status)}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows="2" readOnly>
                      {selectedForm.detail?.description || ""}
                    </textarea>
                  </div>

                  {/* Hình ảnh */}
                  <div className="col-md-12">
                    <label className="form-label">CCCD Mặt trước</label>
                    <img
                      src={getImage(selectedForm.cccdFront)}
                      className="img-fluid rounded border"
                      alt="cccd front"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">CCCD Mặt sau</label>
                    <img
                      src={getImage(selectedForm.cccdBack)}
                      className="img-fluid rounded border"
                      alt="cccd back"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Bằng cấp</label>
                    <img
                      src={getImage(selectedForm.detail?.degree) || "Không có"}
                      className="img-fluid rounded border"
                      alt="degree"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedForm.status === "Processing" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleStatusChange(selectedForm.id, "Accepted");
                        setShowModal(false);
                      }}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleStatusChange(selectedForm.id, "Rejected");
                        setShowModal(false);
                      }}
                    >
                      Từ chối
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormRegister;
