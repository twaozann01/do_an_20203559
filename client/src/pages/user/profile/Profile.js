/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { getInfo, getAddress } from "../../../services/Api";
import { formatDate, formatPhoneNumber } from "../../../shared/utils";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

const Profile = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [mainAddress, setMainAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !userInfo || !userInfo?.data.id) return;
      try {
        const [userRes, addressRes] = await Promise.all([
          getInfo(userInfo?.data.id),
          getAddress(userInfo?.data.id),
        ]);

        setUser(userRes.data.data);

        const defaultAddress = addressRes.data.data.find((a) => a.addressMain);
        setMainAddress(defaultAddress);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu hồ sơ hoặc địa chỉ:", error);
      }
    };

    fetchData();
  }, [userInfo, loading]);

  if (!user || !mainAddress)
    return <div className="text-center">Đang tải dữ liệu hồ sơ...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-body pt-4">
          <div className="tab-content pt-0">
            <div className="tab-pane fade show active">
              <div className="row">
                <div className="col-12">
                  <div className="widget about-widget">
                    <h4 className="widget-title">Tiểu sử</h4>
                    <p>{user.bio}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="widget">
                    <h4 className="widget-title">Thông tin cá nhân</h4>
                    <div className="experience-box">
                      <ul className="experience-list">
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Họ & tên</span>
                              <a href="#" className="name">
                                {user.fullName || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Số điện thoại</span>
                              <a href="#" className="name">
                                {formatPhoneNumber(user.phone) || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Email</span>
                              <a href="#" className="name">
                                {user.email || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Giới tính</span>
                              <a href="#" className="name">
                                {user.gender || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Ngày sinh</span>
                              <a href="#" className="name">
                                {formatDate(user.dateOfBirth) || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Loại tài khoản</span>
                              <a href="#" className="name">
                                {user.role || ""}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Địa chỉ chi tiết</span>
                              <a href="#" className="name">
                                {mainAddress.street}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Phường, Xã</span>
                              <a href="#" className="name">
                                {mainAddress.ward}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Quận, Huyện</span>
                              <a href="#" className="name">
                                {mainAddress.district}
                              </a>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="experience-user">
                            <div className="before-circle" />
                          </div>
                          <div className="experience-content">
                            <div className="timeline-content">
                              <span className="time">Thành phố</span>
                              <a href="#" className="name">
                                {mainAddress.city}
                              </a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {user.role === "Repairman" && (
                  <div className="col-6">
                    <div className="widget experience-widget">
                      <h4 className="widget-title">Công việc và kinh nghiệm</h4>
                      <div className="experience-box">
                        <ul className="experience-list">
                          {user.repairmanInfos?.map((info, index) => (
                            <li key={index}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">
                                    {info.deviceName}
                                  </a>
                                  <span className="time">
                                    {info.yearsOfExperience} năm kinh nghiệm
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="submit-section">
                <Link
                  to="/user/setting-profile"
                  className="btn btn-outline-primary"
                >
                  <i className="fas fa-user-edit me-2" />
                  Sửa hồ sơ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
