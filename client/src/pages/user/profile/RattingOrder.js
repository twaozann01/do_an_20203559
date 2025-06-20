import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { getDevice, getInfo, getOrders } from "../../../services/Api";
import { formatDate } from "../../../shared/utils";
import { ITEMS_PER_PAGE } from "../../../shared/constants/app";

const RattingOrder = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.data.id;
  const [orders, setOrders] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const getRatingStatus = (order) => {
    const completed = new Date(order.completedAt);
    const now = new Date();
    const deadline = new Date(completed);
    deadline.setDate(deadline.getDate() + 15);

    const isRated = order.ratingNumber !== null && order.ratingNumber !== undefined;

    if (isRated) return "rated";
    if (now > deadline) return "expired";
    return "pending";
  };

  useEffect(() => {
    if (!id) return;
    getOrders({
      params: {
        customerId: id,
        status: "Completed",
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
              rateStatus: getRatingStatus(order),
            };
          })
        );
        setOrders(orderWithDevice);
      })
      .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
  }, [id]);

  const filteredRatings = (status) => {
    const filtered = status === "all" ? orders : orders.filter((o) => o.rateStatus === status);
    return filtered.filter((o) => o.orderCode?.toLowerCase().includes(searchCode.toLowerCase()));
  };

  const paginatedOrders = filteredRatings(activeTab).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredRatings(activeTab).length / ITEMS_PER_PAGE);

  if (!id || !userInfo || loading) return <div>Đang tải đơn hàng.......</div>;

  return (
    <div>
     

      {/* Tab Menu */}
      <nav className="user-tabs mb-4">
        <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
          {["all", "pending", "rated", "expired"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "all" && "Tất cả"}
                {tab === "pending" && (
                  <>
                    Chưa đánh giá{" "}
                    <span className="text-warning">
                      ({filteredRatings("pending").length})
                    </span>
                  </>
                )}
                {tab === "rated" && "Đã đánh giá"}
                {tab === "expired" && "Hết hạn đánh giá"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

       {/* Tìm kiếm */}
      <div className="input-group">
        <span className="input-group-text">
          <i className="fas fa-search" />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm theo mã đơn hàng..."
          value={searchCode}
          onChange={(e) => {
            setSearchCode(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="tab-content pt-0">
        <div className="card card-table mb-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-center mb-0">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã đơn</th>
                    <th>Thiết bị</th>
                    <th>Thợ sửa chữa</th>
                    <th>Ngày hoàn thành</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        Không có đơn hàng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>{item.orderCode}</td>
                        <td>{item.deviceName}</td>
                        <td>{item.repairmanName}</td>
                        <td>{formatDate(item.completedAt)}</td>
                        <td>
                          {item.rateStatus === "rated" && (
                            <span className="badge bg-success-light">Đã đánh giá</span>
                          )}
                          {(!item.ratingNumber && item.ratingDate) && (
                            <span className="badge bg-danger-light">Đánh giá đã bị xóa</span>

                          )}
                          {(item.rateStatus === "pending" && !item.ratingDate) && (
                            <span className="badge bg-warning-light">Chưa đánh giá</span>
                          )}
                          {item.rateStatus === "expired" && (
                            <span className="badge bg-danger-light">Hết hạn</span>
                          )}
                        </td>
                        <td>
                          {(item.rateStatus === "pending" && !item.ratingDate) && (
                            <Link to={`/user/ratting-detail/${item.id}`} className="btn btn-sm bg-warning-light">
                              <i className="far fa-star" /> Đánh giá
                            </Link>
                          )}
                          {item.rateStatus === "rated" && !item.hasUpdatedRating && (
                            <Link to={`/user/ratting-detail/${item.id}`} className="btn btn-sm bg-default-light">
                              <i className="fas fa-edit" /> Sửa đánh giá
                            </Link>
                          )}
                          {item.rateStatus === "rated" && item.hasUpdatedRating && (
                            <Link to={`/user/ratting-detail/${item.id}`} className="btn btn-sm bg-success-light">
                              <i className="fas fa-eye" /> Xem đánh giá
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>Trang {currentPage} / {totalPages}</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RattingOrder;
