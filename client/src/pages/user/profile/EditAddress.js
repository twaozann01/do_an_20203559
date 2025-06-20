/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAddress, putAddress } from "../../../services/Api";
import axios from "axios";
import Select from "react-select";
import CommonModal from "../../../shared/components/CommonModal";
import { isValidPhone, isEmpty } from "../../../shared/utils/validate";
import { AuthContext } from "../../../contexts/AuthContext";


const EditAddress = () => {
    const {userInfo, loading} = useContext(AuthContext)
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    addressMain: false,
  });
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [provinceRes, addressRes] = await Promise.all([
          axios.get("https://provinces.open-api.vn/api/p/"),
          getAddress(userInfo?.data.id),
        ]);

        const address = (addressRes?.data.data || []).find((a) => a.id === id);
        if (!address) return navigate("/user/address");

        setProvinces(provinceRes.data);

        const selectedProvince = provinceRes.data.find(p => p.name === address.city);
        let fetchedDistricts = [];
        let fetchedWards = [];

        if (selectedProvince) {
          const districtRes = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
          fetchedDistricts = districtRes.data.districts;
          setDistricts(fetchedDistricts);

          const selectedDistrict = fetchedDistricts.find(d => d.name === address.district);
          if (selectedDistrict) {
            const wardRes = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
            fetchedWards = wardRes.data.wards;
            setWards(fetchedWards);
          }
        }

        setFormData({
          fullName: address.fullName || "",
          phone: address.phone || "",
          city: address.city || "",
          district: address.district || "",
          ward: address.ward || "",
          street: address.street || "",
          addressMain: address.addressMain || false,
        });
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ để chỉnh sửa:", err);
      }
    };

    fetchInitialData();
  }, [userInfo, loading,id]);

  useEffect(() => {
    const fetchDistricts = async () => {
      const selectedProvince = provinces.find(p => p.name === formData.city);
      if (selectedProvince) {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
          setDistricts(res.data.districts);
        } catch (err) {
          console.error("Lỗi khi lấy quận:", err);
        }
      }
    };

    if (formData.city) fetchDistricts();
  }, [formData.city]);

  useEffect(() => {
    const fetchWards = async () => {
      const selectedDistrict = districts.find(d => d.name === formData.district);
      if (selectedDistrict) {
        try {
          const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
          setWards(res.data.wards);
        } catch (err) {
          console.error("Lỗi khi lấy phường:", err);
        }
      }
    };

    if (formData.district) fetchWards();
  }, [formData.district]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };
      if (field === "city" && value !== prev.city) {
        updated.district = "";
        updated.ward = "";
        setDistricts([]);
        setWards([]);
      } else if (field === "district" && value !== prev.district) {
        updated.ward = "";
        setWards([]);
      }
      return updated;
    });
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
      const payload = { ...formData };
      await putAddress(userInfo?.data.id, id, payload);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ Cập nhật địa chỉ thất bại", err);
      alert("❌ Cập nhật địa chỉ thất bại");
    }
  };

  return (
    <>
      <form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
        <h4 className="mb-4"><i className="fas fa-pen me-2"></i> Chỉnh sửa Địa Chỉ</h4>

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
              options={provinces.map((p) => ({ value: p.name, label: p.name }))}
              value={formData.city ? { value: formData.city, label: formData.city } : null}
              onChange={(selected) => handleChange("city", selected.value)}
              placeholder="Chọn tỉnh"
              menuPlacement="bottom"
            />
            {errors.city && <div className="text-danger small mt-1">{errors.city}</div>}
          </div>

          <div className="col-md-4">
            <label>Quận / Huyện</label>
            <Select
              options={districts.map((d) => ({ value: d.name, label: d.name }))}
              value={formData.district ? { value: formData.district, label: formData.district } : null}
              onChange={(selected) => handleChange("district", selected.value)}
              isDisabled={!formData.city}
              placeholder="Chọn quận"
              menuPlacement="bottom"
            />
            {errors.district && <div className="text-danger small mt-1">{errors.district}</div>}
          </div>

          <div className="col-md-4">
            <label>Phường / Xã</label>
            <Select
              options={wards.map((w) => ({ value: w.name, label: w.name }))}
              value={formData.ward ? { value: formData.ward, label: formData.ward } : null}
              onChange={(selected) => handleChange("ward", selected.value)}
              isDisabled={!formData.district}
              placeholder="Chọn phường"
              menuPlacement="bottom"
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
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/user/address")}>Huỷ</button>
          <button type="submit" className="btn btn-primary">Lưu</button>
        </div>
      </form>

      <CommonModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onSubmit={() => navigate("/user/address")}
        type="notify"
        title="🎉 Đã cập nhật địa chỉ thành công"
        payload={{
          message: "Bạn muốn quay về danh sách địa chỉ?",
          showActions: true,
        }}
      />
    </>
  );
};

export default EditAddress;
