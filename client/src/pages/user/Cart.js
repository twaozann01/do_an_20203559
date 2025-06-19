import React, { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { postOrder } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../shared/utils";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống.");
      return;
    }

    try {
      for (const item of cartItems) {
        const formData = new FormData();
        formData.append("addressId", item.addressId);
        formData.append("customerId", item.customerId);
        formData.append("repairDate", item.repairDate);
        formData.append("customerNote", item.customerNote || "");
        formData.append("serviceDeviceId", item.serviceDeviceId);

        item.orderDetails.forEach((detail, index) => {
          formData.append(
            `orderDetails[${index}].deviceDetailId`,
            detail.deviceDetailId
          );
          formData.append(
            `orderDetails[${index}].description`,
            detail.description
          );
          if (detail.imageFile) {
            formData.append(
              `orderDetails[${index}].imageFile`,
              detail.imageFile
            );
          }
          if (detail.videoFile) {
            formData.append(
              `orderDetails[${index}].videoFile`,
              detail.videoFile
            );
          }
        });

        await postOrder(formData);
      }

      alert("\uD83C\uDF89 Đặt tất cả đơn thành công!");
      clearCart();
      navigate("/user/ordered");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("❌ Có lỗi xảy ra khi gửi đơn.");
    }
  };

  const getOrderTotal = (orderDetails) => {
    return orderDetails.reduce((sum, od) => {
      const price = parseFloat(od.minPrice || 0);
      return sum + price;
    }, 0);
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + getOrderTotal(item.orderDetails),
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="fa-solid fa-cart-shopping me-2"></i>Giỏ hàng{" "}
        <small>({cartItems.length} đơn)</small>
      </h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-shopping-cart"></i> Chưa có đơn nào trong giỏ
          hàng.
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => {
            console.log(item);
            const orderTotal = getOrderTotal(item.orderDetails);
            return (
              <div key={index} className="card shadow-sm mb-4">
                <div className="card-header  text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-receipt me-2"></i>Đơn hàng #
                      {index + 1}
                    </h5>
                    <div>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => {
                        if (
                          window.confirm("Bạn có chắc muốn xoá đơn này không?")
                        ) {
                          removeFromCart(index);
                        }
                      }}
                    >
                      <i className="fa fa-trash me-1"></i> Xóa đơn này
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/book-orders/${index}`)}
                    >
                      Chỉnh sửa
                    </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p>
                    <strong><i className="far fa-user me-2"></i> Khách:</strong> {item.fullName}
                  </p>
                  <p>
                    <strong><i className="fas fa-phone me-2"></i> SĐT:</strong> {item.phone}
                  </p>
                  <p>
                    <strong><i className="fas fa-map-marker-alt me-2"></i> Địa chỉ:</strong> {item.address}
                  </p>
                  <p>
                    <strong><i className="fas fa-tools me-2"></i> Thiết bị:</strong> {item.deviceName}
                  </p>
                  <p>
                    <strong><i className="fas fa-clock me-2"></i> Thời gian sửa:</strong> {item.repairDate}
                  </p>
                  {item.customerNote && (
                    <p>
                      <strong><i className="far fa-sticky-note me-2"></i> Ghi chú:</strong> {item.customerNote}
                    </p>
                  )}

                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Lỗi</th>
                          <th>Mô tả</th>
                          <th>Giá (tối thiểu)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.orderDetails.map((od, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{od.deviceDetailName || "Không rõ"}</td>
                            <td>{od.description}</td>
                            <td className="text-danger">
                              {formatPrice(od.minPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="fw-bold text-end fs-5 mt-3">
                    <i className="fas fa-hand-holding-usd me-2"></i> Tổng đơn này:{" "}
                    <span className="text-success">
                      {formatPrice(orderTotal)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}

          <div className="text-end">
            <h4 className="text-danger mb-3">
              <i className="fas fa-hand-holding-usd me-2"></i> Tổng tất cả đơn: {formatPrice(grandTotal)}
            </h4>
            <button
              className="btn btn-success px-5 py-2 mb-4"
              onClick={handleCheckout}
            >
              <i className="fas fa-paper-plane me-2"></i>Gửi tất cả đơn
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
