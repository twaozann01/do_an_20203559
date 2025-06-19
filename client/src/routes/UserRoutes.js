import UserLayouts from "../layouts/UserLayouts";
import Home from "../pages/user/Home";
import Service from "../pages/user/Service";
import BookOrders from "../pages/user/BookOrders";
import CreatedBlog from "../pages/user/profile/CreatedBlog";
import FindOrders from "../pages/user/FindOrders";
import NotFound from "../pages/NotFound";
import NewBlog from "../pages/user/profile/NewBlog";
import Support from "../pages/user/Support";
import ServiceGrid from "../pages/user/ServiceGrid";
import Cart from "../pages/user/Cart";
import Noti from "../pages/user/Noti";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyCode from "../pages/auth/VerifyCode";

// Profile
import ProfileCustomerLayout from "../layouts/ProfileCustomerLayout";
import Dashboard from "../pages/user/profile/Dashboard";
import Address from "../pages/user/profile/Address";
import ChangePassword from "../pages/user/profile/ChangePassword";
import FormRegister from "../pages/user/profile/FormRegister";
import Ordered from "../pages/user/profile/Ordered";
import Profile from "../pages/user/profile/Profile";
import Ratting from "../pages/user/profile/Ratting";
import Chat from "../pages/user/profile/Chat";
import SettingProfile from "../pages/user/profile/SettingProfile";
import Payment from "../pages/user/profile/Payment";
import OrderDetail from "../pages/user/profile/OrderDetail";
import RattingDetail from "../pages/user/profile/RattingDetail";
import BlogPosted from "../pages/user/profile/BlogPosted";
import BlogPending from "../pages/user/profile/BlogPending";
import BlogDetail from "../pages/user/profile/BlogDetail";
import AddAddress from "../pages/user/profile/AddAddress";
import EditAddress from "../pages/user/profile/EditAddress";
import PaymentDetail from "../pages/user/profile/PaymentDetail";

const UserRoutes = {
  path: "/",
  element: <UserLayouts />,
  children: [
    { index: true, element: <Home /> },
    { path: "services", element: <Service /> },
    { path: "services-grid", element: <ServiceGrid /> },
    { path: "book-orders", element: <BookOrders /> },
    { path: "book-orders/:id", element: <BookOrders /> },
    { path: "find-orders", element: <FindOrders /> },
    { path: "support", element: <Support /> },
    { path: "cart", element: <Cart /> },
    { path: "noti", element: <Noti /> },
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "verify-code", element: <VerifyCode /> },
    { path: "register", element: <Register /> },
    { path: "new-blog", element: <NewBlog /> },
    { path: "blog-detail", element: <BlogDetail /> },
    { path: "*", element: <NotFound /> },
    { path: "support", element: <Support /> },

    {
      path: "user",
      element: <ProfileCustomerLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "address", element: <Address /> },
        { path: "add-address", element: <AddAddress /> },
        { path: `edit-address/:id`, element: <EditAddress /> },
        { path: "change-password", element: <ChangePassword /> },
        { path: "form-register", element: <FormRegister /> },
        { path: "ordered", element: <Ordered /> },
        { path: "order-detail/:id", element: <OrderDetail /> },
        { path: "profile", element: <Profile /> },
        { path: "ratting", element: <Ratting /> },
        { path: "ratting-detail/:id", element: <RattingDetail /> },
        { path: "chat", element: <Chat /> },
        { path: "setting-profile", element: <SettingProfile /> },
        { path: "payment", element: <Payment /> },
        { path: "payment-detail/:id", element: <PaymentDetail /> },
        { path: "create-blog", element: <CreatedBlog /> },
        { path: "blog-posted", element: <BlogPosted /> },
        { path: "blog-pending", element: <BlogPending /> },
      ],
    },
  ],
};

export default UserRoutes;
