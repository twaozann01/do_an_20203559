import React, { useContext, useState } from 'react';
import RattingOrder from './RattingOrder';
import RattingCustomer from './RattingCustomer';
import { AuthContext } from '../../../contexts/AuthContext';

const Ratting = () => {
  const {userInfo, loading} = useContext(AuthContext)
  const userRole = userInfo?.data.role;

  const [activeTab, setActiveTab] = useState('your_order');
  if(!userInfo || loading) return <div>Đang tải thông tin</div>
  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-body pt-0">
          {/* Tabs */}
          <ul className="nav nav-tabs nav-tabs-bottom nav-justified mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'your_order' ? 'active' : ''}`}
                onClick={() => setActiveTab('your_order')}
              >
                Đơn hàng của bạn
              </button>
            </li>
            {userRole === 'Repairman' && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'rating' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rating')}
                >
                  Đánh giá
                </button>
              </li>
            )}
          </ul>

          {/* Tab Content */}
          <div className="tab-content pt-2">
            {activeTab === 'your_order' && <RattingOrder />}
            {activeTab === 'rating' && userRole === 'Repairman' && <RattingCustomer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratting;
