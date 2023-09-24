// import { Link } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { useEffect, useState } from 'react';

// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from 'react-bootstrap/Navbar';
// import Badge from 'react-bootstrap/Badge';
// import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import Container from 'react-bootstrap/Container';
// import { LinkContainer } from 'react-router-bootstrap';
// import { useContext } from 'react';
// import { Store } from '../Store';
// import Transition from '../components/Transition';

// function Header() {
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { cart, userInfo, giftBoxQuantity } = state;
//   const [cartItemCount, setCartItemCount] = useState(0);

//   useEffect(() => {
//     // 計算購物車數量
//     const itemCount = cart.cartItems.reduce(
//       (count, item) => count + (item.quantity || 0),
//       0
//     );

//     // 設定購物車數量
//     setCartItemCount(itemCount);
//   }, [cart, giftBoxQuantity]);
//   const signoutHandler = () => {
//     //ctxDispatch是Store.js裡的dispatch function
//     ctxDispatch({ type: 'USER_SIGNOUT' });
//     localStorage.removeItem('userInfo');

//     localStorage.removeItem('shippingAddress');
//     localStorage.removeItem('paymentMethod');
//     window.location.href = '/signin';
//   };

//   return (
//     // <header className="bg-primary text-white text-center fs-1 mb-5 p-3">
//     //     {success ? <button className="btn btn-light w-25 fs-5" onClick={signOut}>登出</button> : <Link to="/login" className="btn btn-light w-25 fs-5">登入</Link>}
//     // </header>
//     <Transition>
//       <header className=" headerLink">
//         <Navbar bg="" variant="">
//           <Container>
//             {/* <LinkContainer to="/">
//               <Navbar.Brand>首頁</Navbar.Brand>
//             </LinkContainer> */}

//             <Nav className="me-auto ms-auto">
//               <Link className="nav-link" to="/">
//                 首頁
//               </Link>
//               <Link className="nav-link" to="category">
//                 所有商品
//               </Link>

//               <Link className="nav-link  ms-auto " to="giftbox">
//                 客製禮盒
//               </Link>

//               <Link className="nav-link ms-auto" to="faq">
//                 常見問題
//               </Link>

//               <Link to="/cart" className="nav-link">
//                 購物車
//                 {cartItemCount > 0 && (
//                   <Badge pill bg="danger">
//                     {cartItemCount}
//                   </Badge>
//                 )}
//               </Link>
//               {userInfo ? (
//                 <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
//                   <LinkContainer to="/profile">
//                     <NavDropdown.Item>使用者資料</NavDropdown.Item>
//                   </LinkContainer>
//                   <LinkContainer to="/orderhistory">
//                     <NavDropdown.Item>歷史訂單</NavDropdown.Item>
//                   </LinkContainer>
//                   <NavDropdown.Divider />
//                   <Link
//                     className="dropdown-item"
//                     to="#signout"
//                     onClick={signoutHandler}
//                   >
//                     登出
//                   </Link>
//                 </NavDropdown>
//               ) : (
//                 <Link className="nav-link" to="/signin">
//                   登入
//                 </Link>
//               )}
//             </Nav>
//           </Container>
//         </Navbar>
//       </header>
//     </Transition>
//   );
// }

// export default Header;

//924
//924
//924
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
// import shopcar from '../images/購物車_icon_0.png';
// import membericon from '../images/會員icon_0.png';
// import hamburgericon from '../images/漢堡icon_0.png';
// import logo from '../images/拾月菓logo.png';
// import { useContext } from 'react';
// import { Store } from '../Store';
// import { Container } from 'react-bootstrap';
// import '../screens/Try.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

// function Header() {
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { cart, userInfo, giftBoxQuantity } = state;
//   const [cartItemCount, setCartItemCount] = useState(0);

//   const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

//   const handleHamburgerClick = () => {
//     setIsHamburgerOpen(!isHamburgerOpen);
//   };

//   useEffect(() => {
//     const itemCount = cart.cartItems.reduce(
//       (count, item) => count + (item.quantity || 0),
//       0
//     );

//     setCartItemCount(itemCount);
//   }, [cart, giftBoxQuantity]);

//   const signoutHandler = () => {
//     // ctxDispatch 是 Store.js 里的 dispatch function
//     ctxDispatch({ type: 'USER_SIGNOUT' });
//     localStorage.removeItem('userInfo');
//     localStorage.removeItem('shippingAddress');
//     localStorage.removeItem('paymentMethod');
//     window.location.href = '/signin';
//   };

//   const [device, setDevice] = useState(
//     window.innerWidth > 600 ? 'PC' : 'mobile'
//   );

//   // 检测窗口大小变化以更新设备状态
//   const handleResize = () => {
//     setDevice(window.innerWidth > 600 ? 'PC' : 'mobile');
//   };

//   useEffect(() => {
//     // 监听窗口大小变化
//     window.addEventListener('resize', handleResize);

//     // 移除监听器以防止内存泄漏
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <Navbar className="HeaderNav" variant="">
//       <Container>
//         <LinkContainer to="/">
//           <img
//             className="logo-img me-auto headlogo"
//             src={logo}
//             alt="拾月菓logo.png"
//           />
//         </LinkContainer>
//         <Nav className=" ms-auto">
//           {device === 'PC' && (
//             <>
//               <Link className="nav-link" to="/">
//                 首頁
//               </Link>
//               <Link className="nav-link " to="/category">
//                 所有商品
//               </Link>
//               <Link className="nav-link" to="/giftbox">
//                 客製禮盒
//               </Link>
//               <Link className="nav-link" to="/faq">
//                 常見問題
//               </Link>
//               <Link className="nav-link " to="/contact">
//                 聯絡我們
//               </Link>
//             </>
//           )}

//           <Link to="/cart" className="nav-link">
//             <FontAwesomeIcon
//               icon={faCartShopping}
//               style={{ color: '#9a2540' }}
//             />
//             {cartItemCount > 0 && (
//               <Badge pill bg="danger">
//                 {cartItemCount}
//               </Badge>
//             )}
//           </Link>
//           {userInfo ? (
//             <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
//               <LinkContainer to="/profile">
//                 <NavDropdown.Item>使用者資料</NavDropdown.Item>
//               </LinkContainer>
//               <LinkContainer to="/orderhistory">
//                 <NavDropdown.Item>歷史訂單</NavDropdown.Item>
//               </LinkContainer>
//               <NavDropdown.Divider />
//               <Link
//                 className="dropdown-item"
//                 to="#signout"
//                 onClick={signoutHandler}
//               >
//                 登出
//               </Link>
//             </NavDropdown>
//           ) : (
//             <Link className="nav-link" to="/signin">
//               <img className="icon-img" src={membericon} alt="會員icon" />
//             </Link>
//           )}

//           {device === 'mobile' && (
//             <div className={`mobile-menu ${isHamburgerOpen ? 'active' : ''}`}>
//               {/* 漢堡圖菜單 */}
//               <Link className="mobile-menu-item" to="/">
//                 首頁
//               </Link>
//               <Link className="mobile-menu-item" to="/category">
//                 所有商品
//               </Link>
//               <Link className="mobile-menu-item" to="/giftbox">
//                 客製禮盒
//               </Link>
//               <Link className="mobile-menu-item" to="/faq">
//                 常見問題
//               </Link>
//               <Link className="mobile-menu-item" to="/contact">
//                 聯絡我們
//               </Link>
//             </div>
//           )}

//           {/* 漢堡菜單按鈕 */}
//           {device === 'mobile' && (
//             <div
//               className={`hamburger-button ${isHamburgerOpen ? 'active' : ''}`}
//               onClick={handleHamburgerClick}
//             >
//               <img
//                 className="icon-img"
//                 src={hamburgericon}
//                 alt="漢堡icon.png"
//               />
//             </div>
//           )}
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// }

// export default Header;
///924
///924
///924

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../images/拾月菓logo.png';
import { useContext } from 'react';
import { Store } from '../Store';
import { Container } from 'react-bootstrap';
import '../screens/Try.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, giftBoxQuantity } = state;
  const [cartItemCount, setCartItemCount] = useState(0);

  //添加漢堡菜單按鈕狀態
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  // 漢堡菜單按鈕點擊事件處理函數
  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  //點選其他地方關閉漢堡菜單
  const handleOutsideClick = (e) => {
    if (isHamburgerOpen && e.target.closest('.mobile-menu')) {
      setIsHamburgerOpen(false);
      //點選漢堡圖關閉漢堡菜單
    } else if (isHamburgerOpen && !e.target.closest('.hamburger-button')) {
      setIsHamburgerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [isHamburgerOpen]);

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
    // ctxDispatch 是 Store.js 里的 dispatch function
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  // 添加漢堡菜單按鈕狀態
  const [device, setDevice] = useState(
    window.innerWidth > 600 ? 'PC' : 'mobile'
  );

  //根據視窗大小變化更新設備狀態
  const handleResize = () => {
    setDevice(window.innerWidth > 600 ? 'PC' : 'mobile');
  };

  useEffect(() => {
    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);

    //移除監聽器以防止內存洩漏
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Navbar
      className="fixed-top HeaderNav"
      bg="none"
      // style={{ backgroundColor: '#ffffff29' }}
      // variant="light"
    >
      <Container>
        <LinkContainer to="/">
          <img className="logo-img me-auto" src={logo} alt="拾月菓logo.png" />
        </LinkContainer>
        <Nav className=" ms-auto">
          {device === 'PC' && (
            <>
              <Link className="nav-link  " to="/">
                首頁
              </Link>
              <Link className="nav-link " to="/category">
                所有商品
              </Link>
              <Link className="nav-link " to="/giftbox">
                客製禮盒
              </Link>
              <Link className="nav-link " to="/faq">
                常見問題
              </Link>
              <Link className="nav-link  " to="/contact">
                聯絡我們
              </Link>
            </>
          )}

          <Link to="/cart" className="nav-link ">
            {/* <img className="icon-img " src={shopcar} alt="購物車.png" /> */}
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: '#9a2540' }}
            />
            {cartItemCount > 0 && (
              <Badge pill bg="danger">
                {cartItemCount}
              </Badge>
            )}
          </Link>
          {userInfo ? (
            <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
              <LinkContainer to="/profile">
                <NavDropdown.Item>使用者資料</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/orderhistory">
                <NavDropdown.Item>歷史訂單</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <Link
                className="dropdown-item"
                to="#signout"
                onClick={signoutHandler}
              >
                登出
              </Link>
            </NavDropdown>
          ) : (
            <Link className="nav-link" to="/signin">
              {/* <img className="icon-img" src={membericon} alt="會員icon" /> */}
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ color: '#9a2540' }}
              />
            </Link>
          )}

          {device === 'mobile' && (
            <div className={`mobile-menu ${isHamburgerOpen ? 'active' : ''} `}>
              {/* 漢堡圖 */}
              <Link className="mobile-menu-item" to="/">
                首頁
              </Link>
              <Link className="mobile-menu-item" to="/category">
                所有商品
              </Link>
              <Link className="mobile-menu-item" to="/giftbox">
                客製禮盒
              </Link>
              <Link className="mobile-menu-item" to="/faq">
                常見問題
              </Link>
              <Link className="mobile-menu-item" to="/contact">
                聯絡我們
              </Link>
            </div>
          )}

          {/* 漢堡按鈕 */}
          {device === 'mobile' && (
            <div
              className={`hamburger-button ${isHamburgerOpen ? 'active' : ''}`}
              onClick={handleHamburgerClick}
            >
              {device === 'mobile' && (
                <div
                  className={`hamburger-button ${
                    isHamburgerOpen ? 'active' : ''
                  }`}
                  onClick={handleHamburgerClick}
                >
                  <FontAwesomeIcon
                    className={`hamburger-icon ${
                      isHamburgerOpen ? 'active' : ''
                    }`}
                    //icon切換時 添加一個動畫效果
                    icon={isHamburgerOpen ? faTimes : faBars}
                    style={{ color: '#9a2540' }}
                  />
                </div>
              )}
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
