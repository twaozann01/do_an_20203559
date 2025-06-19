import React, { useEffect, useState } from "react";
import {
  getAddress,
  getAddressUser,
  getDevice,
  getInfo,
  getOrders,
  patchOrderCannel,
} from "../../services/Api";
import { formatDateTime } from "../../shared/utils";
import { getImage } from "../../shared/utils/getImage";
import { useNavigate } from "react-router-dom";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";

const statusTabs = [
  "Tất cả",
  "Chờ xử lý",
  "Đang sửa chữa",
  "Đã hoàn thành",
  "Đã hủy",
];

const convertStatus = (status) => {
  switch (status) {
    case "Pending":
      return "Chờ xử lý";
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

const AppointmentTable = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchCode, setSearchCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then(async (res) => {
        const orders = res.data.items;
        // console.log(orders)

        const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
            const device = await getDevice(order.serviceDeviceId);
            const repairman = order.repairmanId
              ? await getInfo(order.repairmanId)
              : null;
            // const customer = order.customerId
            //   ? await getInfo(order.customerId)
            //   : null;
            const address = order.addressId ? await getAddressUser(order?.customerId, order?.addressId) : null
            // console.log("Địa chỉ",address.data)

            return {
              ...order,
              rawStatus: order.status,
              statusLabel: convertStatus(order.status),
              deviceName: device?.data?.name || "Không rõ",
              repairmanName: repairman?.data?.fullName || "Chưa có thợ",
              repairmanAvatar: getImage(repairman?.data?.avatar),
              customerName: address?.data?.fullName || "Không rõ",
              // customerAvatar: getImage(customer?.data?.avatar),
            };
          })
        );

        setOrders(enrichedOrders);
      })
      .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchTab =
      activeTab === "Tất cả" || convertStatus(order.rawStatus) === activeTab;
    const matchSearch = order.orderCode
      ?.toLowerCase()
      .includes(searchCode.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClickOrderCode = (id) => {
    navigate(`/admin/order-detail/${id}`);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-warning">Chờ xử lý</span>;
      case "InProgress":
        return <span className="badge bg-info">Đang sửa chữa</span>;
      case "Completed":
        return <span className="badge bg-success">Đã hoàn thành</span>;
      case "Canceled":
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };
  const handleCancelOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?"))
      return;

    try {
      await patchOrderCannel(id); // gọi API huỷ
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, rawStatus: "Canceled" } : o))
      );
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      alert("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {statusTabs.map((tab, index) => (
          <li className="nav-item" key={index}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tìm kiếm */}
      <div className="row mb-3">
  <div className="col-md-12 mb-2 mb-md-0">
    <input
      type="text"
      className="form-control"
      placeholder="Tìm kiếm theo mã đơn hàng..."
      value={searchCode}
      onChange={(e) => {
        setSearchCode(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>
</div>


      {/* Bảng đơn hàng */}
      <div className="table-responsive">
        <table className="table table-hover table-center">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Thợ sửa chữa</th>
              <th>Thiết bị</th>
              <th>Thời gian hẹn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((app, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() => handleClickOrderCode(app.id)}
                    >
                      {app.orderCode}
                    </button>
                  </td>
                  <td>{app.customerName}</td>
                  <td>{app.repairmanName}</td>
                  <td>{app.deviceName}</td>
                  <td>{formatDateTime(app.repairDate)}</td>
                  <td>{renderStatusBadge(app.rawStatus)}</td>
                  <td>
                    {app.rawStatus === "Pending" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancelOrder(app.id)}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
  );
};

export default AppointmentTable;
