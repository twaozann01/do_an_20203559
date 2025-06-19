/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import SidebarCustomer from '../shared/components/Layout/SidebarCustomer'
import { Outlet } from 'react-router-dom'
const ProfileCustomerLayout = () => {
  return (
    <div>

{/* Page Content */}
<div className="content">
  <div className="pt-3 pe-5 ps-5">
    <div className="row">
      {/* Profile Sidebar */}
      <div className="col-md-3 col-lg-3 col-xl-3">
      <SidebarCustomer/>   
      </div>
      {/* / Profile Sidebar */}
      <div className="col-md-9 col-lg-9 col-xl-9">
        <main>
          <Outlet/>
        </main>
      </div>
    </div>
  </div>
</div>
{/* /Page Content */}

    </div>
  )
}

export default ProfileCustomerLayout
