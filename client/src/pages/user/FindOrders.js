/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import OrderList from "../../shared/components/FindOrders/OrderList";
import OrderDetailModal from "../../shared/components/FindOrders/OrderDetailModal";
import OrderAcceptedModal from "../../shared/components/FindOrders/OrderAcceptedModal";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getAddressUser,
  getDevice,
  getInfo,
  getOrders,
  patchStatusWorking,
  putAcceptOrder,
} from "../../services/Api";
import RatingStars from "../../shared/components/RatingStars";
import { getImage } from "../../shared/utils/getImage";

// Dữ liệu mẫu (có thể thay bằng API)

const FindOrders = () => {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addressMain, setAddressMain] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.data.id;

  const fetchUserInfo = async () => {
    try {
      const user = await getInfo(id);
      const userData = user.data.data;
      // console.log(userData);
      setUser(userData);
      setIsActive(userData?.workingStatus !== "Offline");

      const mainAddress = userData?.addresses?.find(
        (addr) => addr.addressMain === true
      );

      setAddressMain(mainAddress);
      // console.log("Địa chỉ chính của thợ: ", addressMain);
      // console.log("Thông tin của thợ: ", userData);
    } catch (error) {
      console.log("Lỗi khi tải thông tin người dùng", error);
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await getOrders({
        params: {
          status: "Pending",
        },
      });
      const allOrders = res.data.data.items;
      const orderInfo = await Promise.all(
        allOrders.map(async (order) => {
          const address = await getAddressUser(
            order?.customerId,
            order?.addressId
          );

          const device = await getDevice(order?.serviceDeviceId);
          const deviceName = device?.data.data.name;

          const addressCity = address?.data.data.city;
          const addressDistrict = address?.data.data.district;
          const addressWard = address?.data.data.ward;
          const addressStreet = address?.data.data.street;
          const phone = address?.data.data.phone;

          const customerName = address?.data.data.fullName;
          return {
            ...order,
            addressCity,
            addressDistrict,
            deviceName,
            addressWard,
            addressStreet,
            customerName,
            phone,
          };
        })
      );
      // console.log("Đơn hàng123", orderInfo);
      const rejectedOrders =
        JSON.parse(localStorage.getItem(`rejectedOrders_${id}`)) || [];

      function getMatchingOrders(user, mainAddress, orders) {
        if (!user?.repairmanInfos?.length || !mainAddress) return [];

        return orders.filter((order) => {
          if (rejectedOrders.includes(order.id)) return false;
          if (order?.customerId === user?.id) return false;
          const sameCity = order?.addressCity === mainAddress?.city;
          const sameDistrict = order?.addressDistrict === mainAddress?.district;

          const hasMatchingDevice =
            filter.deviceIds.length === 0
              ? user?.repairmanInfos.some(
                  (info) => info?.serviceDeviceId === order?.serviceDeviceId
                )
              : filter.deviceIds.includes(order?.serviceDeviceId);

          const validPrice = matchPrice(order?.total);

          return sameCity && sameDistrict && hasMatchingDevice && validPrice;
        });
      }

      const matchedOrders = getMatchingOrders(user, addressMain, orderInfo);
      setOrders(matchedOrders);
      setVisibleCount(5);

      // console.log("Đơn hàng phù hợp", matchedOrders);

      // console.log("Tất cả các đơn hàng:", orderInfo);
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng", error);
    }
  };

  const [filter, setFilter] = useState({
    priceRange: [],
    deviceIds: [],
  });

  const matchPrice = (price) => {
    if (!filter.priceRange.length) return true; // không chọn gì = tất cả

    return filter.priceRange.some((range) => {
      switch (range) {
        case "under100":
          return price < 100000;
        case "100to300":
          return price >= 100000 && price <= 300000;
        case "300to500":
          return price > 300000 && price <= 500000;
        case "above500":
          return price > 500000;
        default:
          return false;
      }
    });
  };

  useEffect(() => {
    if (id) fetchUserInfo();
  }, [id]);

  useEffect(() => {
    if (user && addressMain) fetchOrder();
  }, [user, addressMain, filter]);

  const handleToggleWorking = async () => {
    if (isActive) {
      const confirmed = window.confirm(
        "Bạn có chắc muốn tắt trạng thái hoạt động? Bạn sẽ không nhận được đơn hàng mới."
      );
      if (!confirmed) return;
    }

    try {
      await patchStatusWorking(id);
      fetchUserInfo();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoạt động", error);
    }
  };

  const handleReject = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối đơn hàng này không?")) {
      const rejectKey = `rejectedOrders_${userInfo?.id}`;
      const existing = JSON.parse(localStorage.getItem(rejectKey)) || [];
      const updated = [...new Set([...existing, orderId])];
      localStorage.setItem(rejectKey, JSON.stringify(updated));

      // Xóa đơn khỏi danh sách hiển thị
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
    }
  };

  const handleAcceptOrder = async (order) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn nhận đơn này?");
    if (!confirm) return;

    try {
      await putAcceptOrder(order.id, userInfo?.data.id); // API PUT/PATCH
      setAcceptedOrder(order); // 🎉 Hiển thị modal đã nhận đơn
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSelectedOrder(null);
    } catch (error) {
      console.error("❌ Lỗi khi nhận đơn:", error);
      alert("Không thể nhận đơn. Vui lòng thử lại.");
    }
  };

  if (loading || !userInfo) return <div>Đang tải thông tin...</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <section className="find-orders-wrapper py-4">
      <div className="container">
        <div className="row g-4">
          {/* Cột thông tin thợ */}
          <div className="col-lg-4">
            <div className="card shadow-sm mb-4 text-center">
              <div className="card-body">
                <img
                  src={user?.avatar ? getImage(user.avatar) : ""}
                  className="worker-avatar mb-3 rounded-circle border w-50 h-auto"
                  alt="Avatar"
                />
                <h4 className="mb-1">{user?.fullName}</h4>
                <RatingStars
                  average={user?.average}
                  reviewCount={user?.reviewCount}
                />

                <div className="d-flex justify-content-center mb-3">
                  <div className="px-3 text-center">
                    <div className="h5 mb-0">
                      {user?.completedOrderCount || "0"}
                    </div>
                    <small className="text-muted">Đơn hoàn thành</small>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center mb-3">
                  <span className="me-2">Trạng thái:</span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="activeSwitch"
                      checked={isActive}
                      onChange={handleToggleWorking}
                    />
                  </div>
                  <span
                    className={`ms-2 fw-semibold ${
                      isActive ? "text-success" : "text-danger"
                    }`}
                  >
                    {isActive ? "Online" : "Offline"}
                  </span>
                </div>

                {!isActive && (
                  <div className="alert alert-warning mt-3">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Bạn đang tắt trạng thái hoạt động, sẽ không nhận đơn mới!
                  </div>
                )}

                <hr />
                <h4 className="fw-bold mb-3 text-start">Bộ lọc</h4>
                <div className="card">
                  <div className="card-body pt-2 mt-2">
                    <div className="text-start">
                      <h6 className="fw-bold mb-3">Lọc theo thiết bị</h6>
                      <ul className="list-unstyled text-start">
                        {(user?.repairmanInfos || []).map((item, index) => (
                          <li key={index} className="mb-2 form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`device-${item.serviceDeviceId}`}
                              value={item.serviceDeviceId}
                              checked={filter.deviceIds.includes(
                                item.serviceDeviceId
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFilter((prev) => ({
                                  ...prev,
                                  deviceIds: checked
                                    ? [...prev.deviceIds, item.serviceDeviceId]
                                    : prev.deviceIds.filter(
                                        (id) => id !== item.serviceDeviceId
                                      ),
                                }));
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`device-${item.serviceDeviceId}`}
                            >
                              {item.deviceName}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body pt-2 mt-2">
                    <div className="text-start">
                      <label className="fw-bold mb-2">Theo mức giá</label>
                      {[
                        { value: "under100", label: "Dưới 100.000đ" },
                        { value: "100to300", label: "100.000đ - 300.000đ" },
                        { value: "300to500", label: "300.000đ - 500.000đ" },
                        { value: "above500", label: "Trên 500.000đ" },
                      ].map((item, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={item.value}
                            id={`price-${item.value}`}
                            checked={filter.priceRange.includes(item.value)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFilter((prev) => ({
                                ...prev,
                                priceRange: checked
                                  ? [...prev.priceRange, item.value]
                                  : prev.priceRange.filter(
                                      (val) => val !== item.value
                                    ),
                              }));
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`price-${item.value}`}
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột danh sách đơn hàng */}
          <div className="col-lg-8">
            {!isActive && (
              <div className="alert alert-warning text-center">
                <i className="fas fa-power-off text-danger me-2"></i>
                Bạn đang ở trạng thái ngừng hoạt động. Bật trạng thái để nhận
                đơn hàng mới.
              </div>
            )}
            <OrderList
              isActive={isActive}
              setSelectedOrder={setSelectedOrder}
              orders={orders.slice(0, visibleCount)} // ✨ cắt theo số lượng hiển thị
              setOrders={setOrders}
            />
            {visibleCount < orders.length && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                >
                  Xem thêm đơn hàng
                </button>
              </div>
            )}
            {visibleCount >= orders.length && orders.length > 0 && (
              <div className="text-center text-muted mt-3">
                Bạn đã xem hết tất cả đơn hàng phù hợp
              </div>
            )}
          </div>
        </div>

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            isActive={isActive}
            onAccept={handleAcceptOrder}
            onReject={handleReject}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {acceptedOrder && (
          <OrderAcceptedModal
            order={acceptedOrder}
            onClose={() => setAcceptedOrder(null)}
          />
        )}
      </div>
    </section>
  );
};

export default FindOrders;
