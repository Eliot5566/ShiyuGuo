import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  Switch,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SignScreen';
import ShippingAddress from './screens/ShippingAddress';
import SignupScreen from './screens/SignUp';
import PaymentMethod from './screens/PaymentMethod';
import PlaceOrder from './screens/PlaceOrder';
import OrderScreen from './screens/OrderScreen';
import CustomizedGiftBox from './screens/CustomizedGiftBox';
import SelectContentFour from './screens/SelectContentFour';
import SelectContentSix from './screens/SelectContentSix';
import SelectContentNine from './screens/SelectContentNine';
import CategoryPage from './screens//categoryPage';
import Product from './screens/Product';
import GiftCard from './screens/GiftCard';
import GiftCard6 from './screens/GiftCard6';
import GiftCard9 from './screens/GiftCard9';
import GiftBoxDetails from './components/GiftBoxDetails.js';
import GiftBoxDetails6 from './components/GiftBoxDetails6.js';
import GiftBoxDetails9 from './components/GiftBoxDetails9.js';
import FAQ from './screens/FAQ';
import OrderHistory from './screens/OrderHistory';
import ProfileScreen from './screens/ProfileScreen';
import HomeTest from './HomeTest';
import Layout from './layout/Layout';
import SignTest from './screens/SignTest';
import Test2 from './screens/Test2';
import ContactUs from './screens/ContactUs';
import UserPage from './screens/UserPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, giftBoxQuantity } = state;
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // 計算購物車數量
    const itemCount = cart.cartItems.reduce(
      (count, item) => count + (item.quantity || 0),
      0
    );

    // 設定購物車數量
    setCartItemCount(itemCount);
  }, [cart, giftBoxQuantity]);
  const signoutHandler = () => {
    //ctxDispatch是Store.js裡的dispatch function
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');

    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <main>
          <div className="">
            <Routes>
              <Route path="/" element={<HomeTest />} />
              <Route path="/" element={<Layout />}>
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/product/:_id" element={<Product />} />
                <Route path="/cart" element={<CartScreen />} />
                {/* <Route path="/signin" element={<SigninScreen />} /> */}
                {/* <Route path="/signup" element={<SignupScreen />} /> */}
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/order/:id" element={<OrderScreen />} />

                <Route path="/shipping" element={<ShippingAddress />} />
                <Route path="/payment" element={<PaymentMethod />} />
                <Route path="/giftbox" element={<CustomizedGiftBox />} />
                <Route path="/giftcard" element={<GiftCard />} />
                <Route path="/giftcard6" element={<GiftCard6 />} />
                <Route path="/giftcard9" element={<GiftCard9 />} />
                <Route path="/faq" element={<FAQ />} />
                {/* <Route path="/sub" element={<Sub />} /> */}

                <Route path="/cardboxdetail" element={<GiftBoxDetails />} />
                <Route path="/cardboxdetail6" element={<GiftBoxDetails6 />} />
                <Route path="/cardboxdetail9" element={<GiftBoxDetails9 />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/userpage" element={<UserPage />} />
                <Route path="/signin" element={<SignTest />} />
                <Route path="/contact" element={<ContactUs />} />

                <Route path="/test" element={<HomeScreen />} />
                <Route
                  path="/select-content/four"
                  element={<SelectContentFour />}
                />
                <Route
                  path="/select-content/six"
                  element={<SelectContentSix />}
                />
                <Route
                  path="/select-content/nine"
                  element={<SelectContentNine />}
                />
                <Route path="/test2" element={<Test2 />} />
              </Route>
            </Routes>
          </div>
        </main>
        <>
          {/* <Sub /> */}
          {/* <Footer /> */}
          {/* <div className="text-center">All rights reserved</div> */}
        </>
      </div>
    </BrowserRouter>
  );
}
export default App;
