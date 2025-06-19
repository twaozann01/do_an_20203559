/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import OrderedTab from "./OrderedTab";
import RepairedTab from "./RepairedTab";
import { AuthContext } from "../../../contexts/AuthContext";

const Ordered = () => {
  const {userInfo, loading} = useContext(AuthContext)
  const userRole = userInfo?.role;

  const [activeTab, setActiveTab] = useState("ordered");
 if(!userInfo || loading) return <div>Đang tải thông tin.....</div>
  return (
    <div>
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
                  Đơn hàng đã đặt
                </button>
              </li>
              {userRole === "Repairman" && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "repaired" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("repaired")}
                  >
                    Đơn hàng sửa chữa
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Tab Content */}
          <div className="tab-content pt-0">
            {activeTab === "ordered" && (
              <div className="tab-pane fade show active">
                <OrderedTab/>
              </div>
            )}

            {activeTab === "repaired" && userRole === "Repairman" && (
              <div className="tab-pane fade show active">
                <RepairedTab/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordered;
