import React from 'react'
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard'
import Calender from '../pages/admin/Calender';
import Chat from '../pages/admin/Chat';
import FormRegister from '../pages/admin/FormRegister';
import Gift from '../pages/admin/Gift';
import ListApointment from '../pages/admin/ListApointment';
import ListCustomer from '../pages/admin/ListCustomer';
import ListRepair from '../pages/admin/ListRepair';
import ListService from '../pages/admin/ListService';
import AddService from '../pages/admin/AddService';
import Payment from '../pages/admin/Payment';
import Profile from '../pages/admin/Profile';
import ReviewTable from '../pages/admin/ReviewTable';
import Report from '../pages/admin/Report';
import Setting from '../pages/admin/Setting';
import OrderDetail from '../pages/admin/OrderDetail'

const AdminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
  { index: true, element: <Dashboard/>},
  {path: "calender" , element: <Calender/> },
  {path: "chat" , element: <Chat/> },
  {path: "form-register" , element: <FormRegister/> },
  {path: "gift" , element: <Gift/> },
  {path: "list-apointment" , element:<ListApointment/> },
  {path: "list-customer" , element: <ListCustomer/> },
  {path: "list-repair" , element: <ListRepair/> },
  {path: "list-service" , element: <ListService/>},
  {path: "add-service" , element: <AddService/>},
  {path: "payment" , element: <Payment/> },
  {path: "profile" , element: <Profile/> },
  {path: "ratting" , element: <ReviewTable/> },
  {path: "report" , element: <Report/> },
  {path: "setting" , element: <Setting/> },
  {path: "order-detail/:id" , element: <OrderDetail/> },
  ]
};

export default AdminRoutes
