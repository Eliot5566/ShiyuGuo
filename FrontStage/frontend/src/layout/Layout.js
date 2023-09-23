import { Outlet } from 'react-router-dom';
// import SideBar from "./SideBar";
import Header from './Header';
import Footer from '../screens/Footer';
import Background from '../components/Background';
import Nav from '../screens/Nav';
import Test2 from '../screens/Test2';
import ScrollToTopButton from '../components/ScrollToTopButton';

const Layout = () => {
  return (
    <main className="d-flex">
      {/* <div className="w-auto">
                <SideBar/>
            </div> */}

      <div className="col colfooter">
        <Header />
        {/* <Nav /> */}
        {/* <Test2 /> */}
        <Background style={{ zIndex: 1 }} />
        <Outlet className="" style={{ zIndex: 5 }} />
        <ScrollToTopButton />
        <div className="footermt">
          {' '}
          <Footer className="mt-5" />
        </div>
      </div>
    </main>
  );
};

export default Layout;
