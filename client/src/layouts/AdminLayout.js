import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../shared/components/Layout/HeaderAdmin";
import SidebarAdmin from "../shared/components/Layout/SidebarAdmin";
import PageHeaderAdmin from "../shared/components/Layout/PageHeaderAdmin";
import { useLocation } from 'react-router-dom';
const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    
    <div className="main-wrapper">
      <div className="admin">
        <HeaderAdmin />
        <SidebarAdmin />

        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            {currentPath !== '/admin' && <PageHeaderAdmin />}
            {/* /Page Header */}
            <main>
              <Outlet /> {/* Nơi hiển thị các trang bên trong layout */}
            </main>
          </div>
        </div>
        {/* /Page Wrapper */}
      </div>
    </div>
  );
};

export default AdminLayout;
