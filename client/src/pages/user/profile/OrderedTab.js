/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getOrders,
  getDevice,
  getInfo,
  patchOrderCannel,
  patchOrderCompleted,
} from "../../../services/Api";
import { AuthContext } from "../../../contexts/AuthContext";
import { formatDateTime, formatPrice } from "../../../shared/utils";
import { ITEMS_PER_PAGE } from "../../../shared/constants/app";
const OrderedTab = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.data.id;

  const [order, setOrder] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrders({
      params: {
        customerId: id,
      },
    })
      .then(async (res) => {
        const orders = res.data.data.items;

        const orderWithDevice = await Promise.all(
          orders.map(async (order) => {
            const device = await getDevice(order.serviceDeviceId);

            let repairmanName = "Chưa có thợ";

            if (order.repairmanId) {
              const repairman = await getInfo(order.repairmanId);
              repairmanName = repairman.data.data.fullName;
            }

            return {
              ...order,
              deviceName: device.data.data.name,
              repairmanName,
              statusLabel: getStatusLabel(order.status),
            };
          })
        );
        setOrder(orderWithDevice);
        // console.log(orderWithDevice);
      })
      .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
  }, [id, currentPage]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
    try {
      await patchOrderCannel(orderId);
      setOrder((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "Canceled", statusLabel: "Đã hủy" }
            : o
        )
      );
      alert("Đã hủy đơn hàng thành công.");
    } catch (error) {
      console.log("Lỗi khi hủy đơn hàng!", error);
      alert("Không thể hủy đơn hàng! \n Vui lòng thử lại sau!");
    }
  };
  const handleCompleteOrder = async (orderId) => {
    if (
      !window.confirm("Bạn có chắc muốn đánh dấu đơn hàng này là hoàn thành?")
    )
      return;
    try {
      await patchOrderCompleted(orderId); // Gọi API bạn sẽ tạo ở bước 2
      setOrder((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "Completed", statusLabel: "Đã hoàn thành" }
            : o
        )
      );
      alert("Đã đánh dấu hoàn thành đơn hàng.");
    } catch (error) {
      console.log("Lỗi khi hoàn thành đơn hàng!", error);
      alert("Không thể hoàn thành đơn hàng! Vui lòng thử lại sau.");
    }
  };

  const tabs = [
    { id: "All", label: "Tất cả" },
    { id: "Pending", label: "Đang xử lý" },
    { id: "InProgress", label: "Đang sửa chữa" },
    { id: "Completed", label: "Đã hoàn thành" },
    { id: "Canceled", label: "Đã hủy" },
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Đang xử lý";
      case "InProgress":
        return "Đang sửa chữa";
      case "Completed":
        return "Đã hoàn thành";
      case "Canceled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning-light";
      case "InProgress":
        return "bg-primary-light";
      case "Completed":
        return "bg-success-light";
      case "Canceled":
        return "bg-danger-light";
      default:
        return "";
    }
  };

  const filteredOrder = (
    activeTab === "All" ? order : order.filter((o) => o.status === activeTab)
  ).filter((o) => o.orderCode?.toLowerCase().includes(searchCode.toLowerCase()));

  const totalPages = Math.ceil(filteredOrder.length / ITEMS_PER_PAGE);
  const paginatedOrder = filteredOrder.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  if (!id || !userInfo || loading) return <div>Lỗi khi tải đơn hàng......</div>;
  return (
    <div>
      {/* Tab Menu */}
      <nav className="user-tabs mb-4">
        <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "Pending" && (
                  <span className="text-warning">
                    {" "}
                    ({order.filter((o) => o.status === "Pending").length})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* /Tab Menu */}

      {/* Search */}
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mã đơn hàng..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>


      {/* Tab Content */}
      <div className="tab-content pt-0">
        <div className="tab-pane fade show active">
          <div className="card card-table mb-0">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <td>Mã đơn hàng</td>
                      <th>Thiết bị</th>
                      <th>Thợ sửa chữa</th>
                      <th>Chi phí</th>
                      <th>Trạng thái</th>
                      <th>Ngày hẹn</th>
                      <th>Tương tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrder.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order.orderCode}</td>
                        <td>{order.deviceName}</td>
                        <td>{order.repairmanName}</td>
                        <td>{formatPrice(order.total)}</td>
                        <td>
                          <span
                            className={`badge ${getStatusClass(order.status)}`}
                          >
                            {order.statusLabel}
                          </span>
                        </td>
                        <td>{formatDateTime(order.repairDate)}</td>
                        <td>
                          <div className="table-action">
                            {order.status === "Pending" && (
                              <button
                                className="btn btn-sm bg-danger-light me-2"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <i className="fas fa-times" /> Hủy
                              </button>
                            )}
                            {order.status === "InProgress" && (
                              <button
                                className="btn btn-sm bg-primary-light me-2"
                                onClick={() => handleCompleteOrder(order.id)}
                              >
                                <i className="fas fa-check" /> Hoàn thành
                              </button>
                            )}
                            <Link
                              to={`/user/order-detail/${order.id}`}
                              className="btn btn-sm bg-info-light"
                            >
                              <i className="far fa-eye" /> Xem
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages  > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Trang {currentPage} / {totalPages}
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-secondary me-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        ← Trước
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Sau →
                      </button>
                    </div>
                  </div>
                )}
                {filteredOrder.length === 0 && (
                  <p className="text-center mt-3">Không có đơn nào.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Tab Content */}
    </div>
  );
};

export default OrderedTab;
