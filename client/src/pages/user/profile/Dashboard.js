/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import {
  comment_alt,
  shopping_cart,
  start_solid,
  user,
} from "../../../assets/img/icon";
import { Link } from "react-router-dom";
import FormRegistered from "./FormRegistered";
import { AuthContext } from "../../../contexts/AuthContext";
import OrderedTab from "./OrderedTab";
import RepairedTab from "./RepairedTab";
const Dashboard = () => {
  const{userInfo, loading}  = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("ordered");
  const userRole = userInfo?.role;

  if(!userInfo || loading )  return <div>Đang tải thông tin</div>
  return (
    <div>
      <div>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
            <div className="card">
              <div className="card-body text-center">
                <Link to="/user/profile">
                  <div className="mb-3">
                    <img src={user} alt="heart-image" width={55} />
                  </div>
                  <h5>Thông tin cá nhân</h5>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
            <div className="card">
              <div className="card-body text-center">
                <Link to="/user/chat">
                  <div className="mb-3">
                    <img src={comment_alt} alt="heart-image" width={55} />
                  </div>
                  <h5>Chat</h5>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
            <div className="card">
              <div className="card-body text-center">
                <Link to="/user/ordered">
                  <div className="mb-3">
                    <img src={shopping_cart} alt="heart-image" width={55} />
                  </div>
                  <h5>Quản lí đơn hàng</h5>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 patient-dashboard-top">
            <div className="card">
              <div className="card-body text-center">
                <Link to="/user/ratting">
                  <div className="mb-3">
                    <img src={start_solid} alt="heart-image" width={55} />
                  </div>
                  <h5>Đánh giá</h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body pt-0">
            {/* Tab Menu */}
            <nav className="user-tabs mb-4">
              <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "ordered" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("ordered")}
                  >
                    Đơn hàng sửa chữa
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "submit_technician" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("submit_technician")}
                  >
                    Đơn đăng kí Kỹ thuật viên
                  </button>
                </li>

                {/* ✅ Tab dành riêng cho thợ */}
                {userRole === "Repairman" && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "recent_orders" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("recent_orders")}
                    >
                      Đơn hàng gần đây
                    </button>
                  </li>
                )}
              </ul>
            </nav>

            {/* Tab Content */}
            <div className="tab-content pt-0">
              {activeTab === "ordered" && (
                <div className="tab-pane fade show active">
                  {/* Nội dung Đơn hàng ở đây */}
                      <OrderedTab/>
                </div>
              )}

              {activeTab === "submit_technician" && (
                <div className="tab-pane fade show active">
                  {/* Nội dung Đơn đăng kí ở đây */}
                  <div className="card card-table mb-0">
                    <div className="card-body">
                      <FormRegistered/>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "recent_orders" && userRole === "Repairman" && (
                <div className="tab-pane fade show active">
                  <RepairedTab/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
