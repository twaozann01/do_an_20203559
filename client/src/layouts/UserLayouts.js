import { Outlet, useLocation } from 'react-router-dom';
import HeaderUser from '../shared/components/Layout/HeaderUser';
import FooterUser from '../shared/components/Layout/FooterUser';
import PageHeader from '../shared/components/Layout/PageHeader';


const UserLayouts = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="main-wrapper">
      <HeaderUser />
      {!isHomePage && <PageHeader />}
      <main>
        <Outlet />
      </main>
      <FooterUser />
    </div>
  );
};

export default UserLayouts;
