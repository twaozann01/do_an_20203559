/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import Select from "react-select";
import {
  getAddress,
  getInfo,
  getServiceDevices,
  getServices,
  postRepairmanForm,
} from "../../../services/Api";
import { formatDate } from "../../../shared/utils";
import UseAddressVN from "../../../shared/components/UseAddressVN";
import FormRegistered from "./FormRegistered";
import { Link } from "react-router-dom";

const TechnicianRegisterForm = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const [id, setId] = useState(null);
  const [user, setUser] = useState([]);
  const [mainAddress, setMainAddress] = useState(null);
  const [services, setServices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [description, setDescription] = useState("");
  const [degreeFile, setDegreeFile] = useState(null);
  const [cccdFront, setCccdFront] = useState(null);
  const [cccdBack, setCccdBack] = useState(null);
  const [errors, setErrors] = useState({});
  const [formKey, setFormKey] = useState(Date.now());
  const isUserProfileComplete = () => {
    return (
      user?.fullName &&
      user?.phone &&
      user?.email &&
      user?.dateOfBirth &&
      mainAddress?.street &&
      mainAddress?.ward &&
      mainAddress?.district &&
      mainAddress?.city
    );
  };

  const {
    provinces,
    districts,
    selectedProvinceCode,
    selectedDistrictCode,
    setSelectedProvinceCode,
    setSelectedDistrictCode,
  } = UseAddressVN();
  const selectedProvince = provinces.find(
    (p) => p.code === selectedProvinceCode
  );
  const selectedDistrict = districts.find(
    (d) => d.code === selectedDistrictCode
  );

  useEffect(() => {
    if (!loading && userInfo?.id) {
      setId(userInfo.id);
    }
  }, [loading, userInfo]);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await getInfo(id);
        setUser(res.data);
      } catch (error) {
        console.log("Lỗi láy thông tin người dùng", error);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchUserAddress = async () => {
      try {
        const res = await getAddress(id);

        const main = res.data.find((item) => item.addressMain === true);
        if (main) {
          setMainAddress(main);
        }
      } catch (error) {
        console.log("Lỗi khi lấy địa chỉ người dùng", error);
      }
    };
    fetchUserAddress();
  }, [id]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data.items);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ngành:", error);
      }
    };

    fetchServices();
  }, []);

  const availableDevices = useMemo(() => {
    if (!user?.repairmanInfos) return devices;
    const registeredIds = new Set(
      user.repairmanInfos.map((r) => r.serviceDeviceId)
    );
    return devices.filter((d) => !registeredIds.has(d.id));
  }, [devices, user]);

  useEffect(() => {
    if (!selectedServiceId) return;
    const fetchDevices = async () => {
      try {
        const res = await getServiceDevices(selectedServiceId);
        setDevices(res.data.items);
      } catch (error) {
        console.error("Lỗi khi lấy thiết bị:", error);
      }
    };

    fetchDevices();
  }, [selectedServiceId]);

  const [activeTab, setActiveTab] = useState("form");

  const validateForm = () => {
    const newErrors = {};

    if (!selectedServiceId) newErrors.selectedServiceId = "Vui lòng chọn ngành";
    if (!selectedDeviceId)
      newErrors.selectedDeviceId = "Vui lòng chọn thiết bị";
    if (!yearsOfExperience || yearsOfExperience < 0)
      newErrors.yearsOfExperience = "Số năm kinh nghiệm không hợp lệ";
    if (!description.trim())
      newErrors.description = "Vui lòng nhập mô tả kỹ năng";
    if (!selectedProvinceCode) newErrors.city = "Vui lòng chọn thành phố";
    if (!selectedDistrictCode) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!cccdFront) {
      newErrors.cccdFront = "Vui lòng chọn ảnh CCCD mặt trước";
    } else if (!["image/jpeg", "image/png"].includes(cccdFront.type)) {
      newErrors.cccdFront = "Ảnh mặt trước phải là định dạng JPG hoặc PNG";
    } else if (cccdFront.size > 2 * 1024 * 1024) {
      newErrors.cccdFront = "Ảnh mặt trước không được vượt quá 2MB";
    }

    if (!cccdBack) {
      newErrors.cccdBack = "Vui lòng chọn ảnh CCCD mặt sau";
    } else if (!["image/jpeg", "image/png"].includes(cccdBack.type)) {
      newErrors.cccdBack = "Ảnh mặt sau phải là định dạng JPG hoặc PNG";
    } else if (cccdBack.size > 2 * 1024 * 1024) {
      newErrors.cccdBack = "Ảnh mặt sau không được vượt quá 2MB";
    }

    if (degreeFile) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(degreeFile.type)) {
        newErrors.degreeFile = "Bằng cấp phải là PDF, JPG hoặc PNG";
      } else if (degreeFile.size > 2 * 1024 * 1024) {
        newErrors.degreeFile = "Bằng cấp không được vượt quá 2MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("UserId", id);
    formData.append("ServiceDeviceId", selectedDeviceId);
    formData.append("YearsOfExperience", yearsOfExperience);
    formData.append("Description", description);
    formData.append("DegreeFile", degreeFile); // optional
    formData.append("CccdFront", cccdFront);
    formData.append("CccdBack", cccdBack);
    formData.append("City", selectedProvince?.name || "");
    formData.append("District", selectedDistrict?.name || "");

    try {
      const res = await postRepairmanForm(formData);
      if (res?.status === 201 || res?.status === 200) {
        alert("✅ Gửi đơn thành công!");
        setSelectedServiceId("");
        setSelectedDeviceId("");
        setYearsOfExperience(0);
        setDescription("");
        setDegreeFile(null);
        setCccdFront(null);
        setCccdBack(null);
        setSelectedProvinceCode("");
        setSelectedDistrictCode("");
        setErrors({});
        setFormKey(Date.now());
        setActiveTab("submitted");
      } else {
        alert("❌ Gửi đơn thất bại!");
      }
    } catch (err) {
      console.error("Lỗi gửi đơn:", err);
      alert("❌ Lỗi hệ thống khi gửi đơn.");
    }
  };

  if (!id || loading) return <p>Đang tải thông tin người dùng...</p>;
  if (!isUserProfileComplete()) {
    return (
      <div className="alert alert-warning m-4">
        ⚠️ Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi gửi đơn đăng ký
        kỹ thuật viên.
        <br />
        <Link
          to="/user/setting-profile"
          className="text-primary mt-2 d-inline-block"
        >
          → Chỉnh sửa hồ sơ
        </Link>
        <br />
        <Link to="/user/address" className="text-primary mt-2 d-inline-block">
          → Cập nhật địa chỉ chính
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body pt-0">
        {/* Tab Menu */}
        <nav className="user-tabs mb-4">
          <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "form" ? "active" : ""}`}
                onClick={() => setActiveTab("form")}
              >
                Đăng ký
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "submitted" ? "active" : ""
                }`}
                onClick={() => setActiveTab("submitted")}
              >
                Đơn đã gửi
              </button>
            </li>
          </ul>
        </nav>

        {/* Tab Content */}
        <div className="tab-content pt-0">
          {activeTab === "form" && (
            <div className="tab-pane fade show active">
              <form key={formKey} className="p-3">
                {/* Thông tin cá nhân */}
                <h4 className="mb-3">1. Thông tin cá nhân</h4>
                <div className="row">
                  <div className="col-md-12 mb-3"></div>
                  <div className="col-md-6 mb-3">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={user?.fullName || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      readOnly
                      value={user?.phone || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email </label>
                    <input
                      type="email"
                      className="form-control"
                      readOnly
                      value={user?.email || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Ngày sinh</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={formatDate(user?.dateOfBirth)}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label>Địa chỉ thường trú </label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={`${mainAddress?.street},${mainAddress?.ward}, ${mainAddress?.district}, ${mainAddress?.city}`}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Ảnh CCCD mặt trước</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setCccdFront(e.target.files[0])}
                    />
                    {errors.cccdFront && (
                      <div className="text-danger mt-1">{errors.cccdFront}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Ảnh CCCD mặt sau</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setCccdBack(e.target.files[0])}
                    />
                    {errors.cccdBack && (
                      <div className="text-danger mt-1">{errors.cccdBack}</div>
                    )}
                  </div>
                </div>

                {/* Nghề nghiệp */}
                <h4 className="mt-4 mb-3">2. Dịch vụ sửa chữa</h4>
                <div className="border p-3 mb-3 rounded bg-light">
                  <div className="row mb-3">
                    <div className="col-md-5">
                      <label>Ngành</label>
                      <select
                        className="form-control"
                        required
                        value={selectedServiceId}
                        onChange={(e) => {
                          setSelectedServiceId(e.target.value);
                          setSelectedDeviceId(""); // reset thiết bị khi đổi ngành
                        }}
                      >
                        <option value="">-- Chọn ngành --</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                      {errors.selectedServiceId && (
                        <div className="text-danger mt-1">
                          {errors.selectedServiceId}
                        </div>
                      )}
                    </div>

                    <div className="col-md-5">
                      <label>Chọn thiết bị</label>
                      <select
                        className="form-control"
                        required
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        disabled={!selectedServiceId}
                      >
                        <option value="">-- Chọn thiết bị --</option>
                        {availableDevices.map((device) => (
                          <option key={device.id} value={device.id}>
                            {device.name}
                          </option>
                        ))}
                      </select>

                      {errors.selectedDeviceId && (
                        <div className="text-danger mt-1">
                          {errors.selectedDeviceId}
                        </div>
                      )}
                    </div>
                    <div className="col-md-2 ">
                      <label>Kinh nghiệm</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={yearsOfExperience}
                        onChange={(e) =>
                          setYearsOfExperience(parseInt(e.target.value))
                        }
                      />
                      {errors.yearsOfExperience && (
                        <div className="text-danger mt-1">
                          {errors.yearsOfExperience}
                        </div>
                      )}
                    </div>
                    <div className="col-md-12 mt-3">
                      <label>Chọn khu vực làm việc</label>
                      <div className="row">
                        <div className="col-md-6">
                          <Select
                            options={provinces}
                            value={selectedProvince}
                            onChange={(selected) =>
                              setSelectedProvinceCode(
                                selected ? selected.code : ""
                              )
                            }
                            placeholder="-- Chọn thành phố --"
                            isClearable
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.code}
                          />
                          {errors.city && (
                            <div className="text-danger mt-1">
                              {errors.city}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <Select
                            options={districts}
                            value={selectedDistrict}
                            onChange={(selected) =>
                              setSelectedDistrictCode(
                                selected ? selected.code : ""
                              )
                            }
                            placeholder="-- Chọn quận/huyện --"
                            isDisabled={!selectedProvinceCode}
                            isClearable
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.code}
                          />
                          {errors.district && (
                            <div className="text-danger mt-1">
                              {errors.district}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Mô tả kỹ năng *</label>
                    <textarea
                      className="form-control"
                      required
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {errors.description && (
                      <div className="text-danger mt-1">
                        {errors.description}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Bằng cấp/chứng chỉ (nếu có)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => setDegreeFile(e.target.files[0])}
                    />
                    {errors.degreeFile && (
                      <div className="text-danger mt-1">
                        {errors.degreeFile}
                      </div>
                    )}
                  </div>
                </div>
              </form>
              <div className="text-center mt-">
                <button onClick={handleSubmit} className="btn btn-primary px-4">
                  GỬI ĐƠN ĐĂNG KÝ
                </button>
              </div>
            </div>
          )}

          {/* Đơn đã gửi */}
          {activeTab === "submitted" && (
            <div className="tab-pane fade show active p-3">
              <FormRegistered />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianRegisterForm;
