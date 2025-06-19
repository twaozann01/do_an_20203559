/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getDeviceDetails,
  getServiceDevices,
  getServices,
  getAddress,
  postOrder,
} from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import { formatPhoneNumber, formatPrice } from "../../shared/utils";
import { CartContext } from "../../contexts/CartContext";

const BookOrders = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const userId = userInfo?.id;

  const navigate = useNavigate();
  // Địa chỉ
  const [addresses, setAddresses] = useState([]);
  const [bookingAddress, setBookingAddress] = useState(null);
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressChanged, setAddressChanged] = useState(false);

  // Dịch vụ - Thiết bị - Chi tiết lỗi
  const [services, setServices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [details, setDetails] = useState([]);

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderDetails, setOrderDetails] = useState([
    {
      deviceDetailId: "",
      imageFile: null,
      videoFile: null,
      description: "",
    },
  ]);
   const [errors, setErrors] = useState({});


  const { id } = useParams();
  const editIndex = id !== undefined ? parseInt(id) : null;

  const isEditMode = editIndex !== null && !isNaN(editIndex);
  const { cartItems, updateCartItem } = useContext(CartContext);

  const device = devices.find((d) => d.id === selectedDeviceId);
  const [repairDate, setRepairDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!userId) return;
    getAddress(userId)
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.addressMain - a.addressMain);
        setAddresses(sorted);
        setBookingAddress(sorted[0]);
      })
      .catch((err) => console.error("Lỗi lấy địa chỉ:", err));
  }, [userId]);

  const handleSelectChange = (e) => {
    setSelectedAddressId(e.target.value);
  };

  const handleConfirmAddress = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (selected) {
      setBookingAddress(selected);
      setShowAddressSelect(false);
      setAddressChanged(true);
    }
  };

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.items))
      .catch((err) => console.error("Lỗi lấy ngành:", err));
  }, []);

  useEffect(() => {
    if (!selectedServiceId) return;
    getServiceDevices(selectedServiceId)
      .then((res) => {
        setDevices(res.data.items);
        setSelectedDeviceId("");
        setDetails([]);
      })
      .catch((err) => console.error("Lỗi lấy thiết bị:", err));
  }, [selectedServiceId]);


  useEffect(() => {
    if (!selectedServiceId || !selectedDeviceId) return;
    getDeviceDetails(selectedServiceId, selectedDeviceId)
      .then((res) => {
        setDetails(res.data.items);
      })
      .catch((err) => console.error("Lỗi lấy chi tiết thiết bị:", err));
  }, [selectedServiceId, selectedDeviceId]);


  const handleDetailChange = (index, field, value) => {
    const updated = [...orderDetails];
    updated[index][field] = value;
    setOrderDetails(updated);
  };
  const handleAddDetailBlock = () => {
    const usedIds = orderDetails.map((d) => d.deviceDetailId).filter(Boolean);
    if (usedIds.length >= details.length) {
      alert("Đã chọn tất cả lỗi, không thể thêm nữa.");
      return;
    }

    setOrderDetails([...orderDetails, { deviceDetailId: "", imageFile: null, videoFile: null, description: "" }]);
  };

  const handleRemoveDetailBlock = (index) => {
    const newDetails = [...orderDetails];
    newDetails.splice(index, 1);
    setOrderDetails(newDetails);
  };
const validateForm = () => {
    const newErrors = {};
    if (!bookingAddress?.id) newErrors.address = "Bạn chưa chọn địa chỉ.";
    if (!selectedServiceId) newErrors.service = "Bạn chưa chọn ngành dịch vụ.";
    if (!selectedDeviceId) newErrors.device = "Bạn chưa chọn thiết bị.";
    if (!repairDate) newErrors.repairDate = "Bạn chưa chọn thời gian sửa chữa.";

    orderDetails.forEach((od, index) => {
      if (!od.deviceDetailId) {
        newErrors[`detail-${index}`] = `Chi tiết lỗi ${index + 1} chưa chọn.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
if (!validateForm()) return;

    if (isSubmitting) return; // Ngăn gọi trùng

    // if (!bookingAddress?.id || !selectedDeviceId || !repairDate) {
    //   alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
    //   return;
    // }

    setIsSubmitting(true); // Đánh dấu đang gửi

    const formData = new FormData();
    formData.append("addressId", bookingAddress.id);
    formData.append("customerId", userId);
    formData.append("customerNote", note);
    formData.append("repairDate", repairDate);
    formData.append("serviceDeviceId", selectedDeviceId);

    orderDetails.forEach((item, index) => {
      formData.append(
        `orderDetails[${index}].deviceDetailId`,
        item.deviceDetailId
      );
      formData.append(`orderDetails[${index}].description`, item.description);
      if (item.imageFile) {
        formData.append(`orderDetails[${index}].imageFile`, item.imageFile);
      }
      if (item.videoFile) {
        formData.append(`orderDetails[${index}].videoFile`, item.videoFile);
      }
    });

    try {
      const res = await postOrder(formData);
      alert("Đặt lịch thành công!");
      // Reset form nếu cần
      setSelectedServiceId("");
      setSelectedDeviceId("");
      setBookingAddress(null);
      setSelectedAddressId("");
      setAddressChanged(false);
      setRepairDate(""); // hoặc null
      setNote("");

      setOrderDetails([
        {
          // reset mảng lỗi về 1 phần tử trống
          deviceDetailId: "",
          description: "",
          imageFile: null,
          videoFile: null,
        },
      ]);
      setTimeout(() => {
        navigate("/user/ordered");
      }, 500);
    } catch (err) {
      console.error("Lỗi gửi đơn:", err);
      alert("Có lỗi xảy ra khi gửi đơn.");
    } finally {
      setIsSubmitting(false); // Mở lại nút
    }
  };
  const handleAddToCart = () => {
    if (!validateForm()) return;

     const cartItem = {
      addressId: bookingAddress.id,
      address: `${bookingAddress.street}, ${bookingAddress.ward}, ${bookingAddress.district}, ${bookingAddress.city}`,
      fullName: bookingAddress.fullName,
      phone: bookingAddress.phone,
      customerId: userId,
      serviceDeviceId: selectedDeviceId,
      serviceId: selectedServiceId,
      deviceName: device?.name || "Không rõ",
      repairDate,
      customerNote: note,
      orderDetails: orderDetails.map((od) => {
        const matchedDetail = details.find((d) => d.id === od.deviceDetailId);
        return {
          deviceDetailId: od.deviceDetailId,
          description: od.description,
          imageFile: od.imageFile,
          videoFile: od.videoFile,
          minPrice: matchedDetail?.minPrice || 0,
          deviceDetailName: matchedDetail?.name || "Không rõ",
        };
      }),
    };

    addToCart(cartItem);
    alert("✅ Đã thêm vào giỏ hàng!");
  };



  useEffect(() => {
    if (!isEditMode || !cartItems[editIndex]) return;
    const data = cartItems[editIndex];

    const loadEditData = async () => {
      try {
        setSelectedServiceId(data.serviceId);
        const deviceRes = await getServiceDevices(data.serviceId);
        const fetchedDevices = deviceRes.data.items;
        setDevices(fetchedDevices);

        setSelectedDeviceId(data.serviceDeviceId);

        const detailRes = await getDeviceDetails(data.serviceId, data.serviceDeviceId);
        setDetails(detailRes.data.items);

        setRepairDate(data.repairDate);
        setNote(data.customerNote);
        setBookingAddress({
          id: data.addressId,
          street: "",
          ward: "",
          district: "",
          city: "",
          fullName: data.fullName,
          phone: data.phone,
        });

        setOrderDetails(
          data.orderDetails.map((d) => ({
            deviceDetailId: d.deviceDetailId,
            description: d.description,
            imageFile: d.imageFile || null,
            videoFile: d.videoFile || null,
          }))
        );
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu chỉnh sửa:", err);
      }
    };

  loadEditData();
}, [isEditMode, cartItems, editIndex]);



  const handleSaveEdit = () => {
    if (!validateForm()) return;


    const updatedItem = {
      addressId: bookingAddress.id,
      address: `${bookingAddress.street}, ${bookingAddress.ward}, ${bookingAddress.district}, ${bookingAddress.city}`,
      fullName: bookingAddress.fullName,
      phone: bookingAddress.phone,
      customerId: userId,
      serviceDeviceId: selectedDeviceId,
      serviceId: selectedServiceId,
      deviceName: device?.name || "Không rõ",
      repairDate,
      customerNote: note,
      orderDetails: orderDetails.map((od) => {
        const matchedDetail = details.find((d) => d.id === od.deviceDetailId);
        return {
          deviceDetailId: od.deviceDetailId,
          description: od.description,
          imageFile: od.imageFile,
          videoFile: od.videoFile,
          minPrice: matchedDetail?.minPrice || 0,
          deviceDetailName: matchedDetail?.name || "Không rõ",
        };
      }),
    };

    updateCartItem(editIndex, updatedItem);
    alert("✅ Đã lưu chỉnh sửa đơn hàng!");
    navigate("/cart");
  };

  if (!userInfo || loading || !userId)
    return <div>Đang tải người dùng.......</div>;

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-body">
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="card-title">
                <i className="fas fa-map-pin me-2"></i> Địa chỉ sử dụng
              </h3>
              {bookingAddress && (
                <>
                  <p>
                    <strong>Khách hàng:</strong> {bookingAddress.fullName}
                  </p>
                  <p>
                    <strong>SĐT:</strong>{" "}
                    {formatPhoneNumber(bookingAddress.phone)}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {bookingAddress.street},{" "}
                    {bookingAddress.ward}, {bookingAddress.district},{" "}
                    {bookingAddress.city}
                  </p>
                </>
              )}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2 me-2"
                onClick={() => setShowAddressSelect(!showAddressSelect)}
              >
                {showAddressSelect ? "Ẩn danh sách" : "Thay đổi địa chỉ"}
              </button>
              <Link
                to="/user/address"
                className="btn btn-outline-success btn-sm mt-2"
              >
                <i className="fa-solid fa-plus"></i> Thêm địa chỉ mới
              </Link>
              {addressChanged && (
                <div className="text-success small mt-2">
                  <i className="fa-solid fa-check"></i> Đã thay đổi địa chỉ
                  thành công
                </div>
              )}
            </div>
          </div>
          {showAddressSelect && (
            <div className="mb-3">
              <label className="form-label">Chọn địa chỉ khác</label>
              <div className="d-flex">
                <select
                  className="form-select me-2"
                  onChange={handleSelectChange}
                  value={selectedAddressId}
                >
                  <option value="">-- Chọn địa chỉ --</option>
                  {addresses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName} - {item.phone} - {item.street},{" "}
                      {item.ward}, {item.district}, {item.city}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmAddress}
                  disabled={!selectedAddressId}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          <div className="card mb-3">
            <div className="card-body">
              <h3 className="card-title">
                <i className="fas fa-tools me-2"></i> Dịch vụ
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Ngành dịch vụ</label>
                  <select
                    className="form-control form-select"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                  >
                    <option value="">-- Chọn ngành --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.service && <div className="text-danger small">{errors.service}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Thiết bị</label>
                  <select
                    className=" form-control form-select"
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    disabled={!selectedServiceId}
                  >
                    <option value="">-- Chọn thiết bị --</option>
                    {devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.device && <div className="text-danger small">{errors.device}</div>}
                </div>
              </div>
              {orderDetails.map((item, index) => (
                <div key={index} className="row mt-4 mb-2 border rounded p-2">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">
                      Lỗi chi tiết {index + 1}{" "}
                    </label>
                    <select
                      className="form-control form-select"
                      value={item.deviceDetailId}
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "deviceDetailId",
                          e.target.value
                        )
                      }
                      disabled={!selectedDeviceId}
                    >
                      <option value="">-- Chọn vấn đề --</option>
                      {details
                        .filter(
                          (d) =>
                            // Không cho chọn lỗi đã có ở block khác
                            !orderDetails.some(
                              (od, i) =>
                                i !== index && od.deviceDetailId === d.id
                            )
                        )
                        .map((detail) => (
                          <option key={detail.id} value={detail.id}>
                            {detail.name} - {detail.minPrice}đ
                          </option>
                        ))}
                    </select>
                    {errors[`detail-${index}`] && (
  <div className="text-danger small">{errors[`detail-${index}`]}</div>
)}

                  </div>

                  <div className="col-md-4 mt-2">
                    <label className="form-label">Ảnh thiết bị</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "imageFile",
                          e.target.files[0]
                        )
                      }
                    />
                  </div>

                  <div className="col-md-4 mt-2">
                    <label className="form-label">Video thiết bị</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="video/*"
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "videoFile",
                          e.target.files[0]
                        )
                      }
                    />
                  </div>

                  <div className="col-md-12 mt-3 mb-3">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={item.description}
                      onChange={(e) =>
                        handleDetailChange(index, "description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  {orderDetails.length > 1 && (
                    <div className="col-md-12 text-end mt-1">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveDetailBlock(index)}
                      >
                        <i className="fa fa-trash"></i> Xóa
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="col-md-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleAddDetailBlock}
                  disabled={!selectedDeviceId}
                >
                  <i className="fa fa-plus me-1"></i> Thêm chi tiết
                </button>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Thời gian hẹn sửa chữa</label>
            <input
              type="datetime-local"
              className="form-control"
              value={repairDate}
              onChange={(e) => setRepairDate(e.target.value)}
            />
            {errors.repairDate && <div className="text-danger small">{errors.repairDate}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Ghi chú thêm</label>
            <textarea
              className="form-control"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          {/* BẢNG GIÁ TIỀN */}
          {orderDetails.some((od) => od.deviceDetailId) && (
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="card-title">
                  <i className="fa fa-money-bill-wave me-2"></i> Chi tiết giá
                  tiền
                </h3>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Lỗi</th>
                      <th>Giá tối thiểu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((od, index) => {
                      const detail = details.find(
                        (d) => d.id === od.deviceDetailId
                      );
                      if (!detail) return null;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{detail.name}</td>
                          <td>{formatPrice(detail.minPrice)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">
                        Tổng cộng
                      </td>
                      <td className="fw-bold text-danger">
                        {formatPrice(
                          orderDetails.reduce((sum, od) => {
                            const detail = details.find(
                              (d) => d.id === od.deviceDetailId
                            );
                            return sum + (detail ? detail.minPrice : 0);
                          }, 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="row mb-2">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSubmitOrder}
              >
                Đặt lịch
              </button>
            </div>
            <div className="col-6">
              {isEditMode ? (
                <button
                  type="button"
                  className="btn btn-warning w-100"
                  onClick={handleSaveEdit}
                >
                  <i className="fa-solid fa-save me-1"></i> Lưu chỉnh sửa
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-dark w-100"
                  onClick={handleAddToCart}
                >
                  <i className="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
                  hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOrders;
