/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from "react";
import { postAddress } from "../../../services/Api";
import Select from "react-select";
import CommonModal from "../../../shared/components/CommonModal";
import { isValidPhone, isEmpty } from "../../../shared/utils/validate";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import UseAddressVN from "../../../shared/components/UseAddressVN";

const AddAddress = ({ onCancel }) => {
  const { userInfo, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    addressMain: false,
  });

  const {
    provinces,
    districts,
    wards,
    selectedProvinceCode,
    selectedDistrictCode,
    selectedWardCode,
    setSelectedProvinceCode,
    setSelectedDistrictCode,
    setSelectedWardCode,
  } = UseAddressVN();

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const toggleCheckbox = () => {
    setFormData((prev) => ({ ...prev, addressMain: !prev.addressMain }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (isEmpty(formData.fullName)) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!isValidPhone(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (isEmpty(formData.city)) newErrors.city = "Vui lòng chọn tỉnh/thành";
    if (isEmpty(formData.district)) newErrors.district = "Vui lòng chọn quận/huyện";
    if (isEmpty(formData.ward)) newErrors.ward = "Vui lòng chọn phường/xã";
    if (isEmpty(formData.street)) newErrors.street = "Vui lòng nhập địa chỉ chi tiết";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await postAddress(userInfo?.data.id, formData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("❌ Thêm địa chỉ thất bại");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      addressMain: false,
    });
    setErrors({});
  };

  return (
    <>
      <form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
        <h4 className="mb-4">📝 Thêm Địa Chỉ Mới</h4>

        <div className="mb-3">
          <label>Họ và tên</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>

        <div className="mb-3">
          <label>Số điện thoại</label>
          <input
            type="tel"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label>Tỉnh / Thành phố</label>
            <Select
              options={provinces}
              value={provinces.find((p) => p.code === selectedProvinceCode) || null}
              onChange={(selected) => {
                setSelectedProvinceCode(selected?.code || "");
                handleChange("city", selected?.name || "");
              }}
              placeholder="Chọn tỉnh"
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.code}
            />
            {errors.city && <div className="text-danger small mt-1">{errors.city}</div>}
          </div>

          <div className="col-md-4">
            <label>Quận / Huyện</label>
            <Select
              options={districts}
              value={districts.find((d) => d.code === selectedDistrictCode) || null}
              onChange={(selected) => {
                setSelectedDistrictCode(selected?.code || "");
                handleChange("district", selected?.name || "");
              }}
              isDisabled={!selectedProvinceCode}
              placeholder="Chọn quận"
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.code}
            />
            {errors.district && <div className="text-danger small mt-1">{errors.district}</div>}
          </div>

          <div className="col-md-4">
            <label>Phường / Xã</label>
            <Select
              options={wards}
              value={wards.find((w) => w.code === selectedWardCode) || null}
              onChange={(selected) => {
                setSelectedWardCode(selected?.code || "");
                handleChange("ward", selected?.name || "");
              }}
              isDisabled={!selectedDistrictCode}
              placeholder="Chọn phường"
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.code}
            />
            {errors.ward && <div className="text-danger small mt-1">{errors.ward}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label>Tên đường, Tòa nhà, Số nhà</label>
          <input
            type="text"
            className={`form-control ${errors.street ? "is-invalid" : ""}`}
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
          />
          {errors.street && <div className="invalid-feedback">{errors.street}</div>}
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="addressMain"
            checked={formData.addressMain}
            onChange={toggleCheckbox}
          />
          <label className="form-check-label" htmlFor="addressMain">
            Đặt làm địa chỉ chính
          </label>
        </div>

        <div className="text-end d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Huỷ
          </button>
          <button type="submit" className="btn btn-primary">
            Lưu
          </button>
        </div>
      </form>

      <CommonModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          resetForm();
        }}
        onSubmit={() => {
          setShowSuccessModal(false);
          navigate("/user/address");
        }}
        type="notify"
        title="🎉 Đã thêm địa chỉ thành công"
        payload={{
          message: "Bạn muốn tiếp tục thêm địa chỉ khác hay quay về danh sách?",
          showActions: true,
        }}
      />
    </>
  );
};

export default AddAddress;
