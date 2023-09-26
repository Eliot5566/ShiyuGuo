import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import shopcar from '../images/購物車_icon_0.png';
import membericon from '../images/會員icon_0.png';
import hamburgericon from '../images/漢堡icon_0.png';
import logo from '../images/拾月菓logo.png';
import { useContext } from 'react';
import { Store } from '../Store';
import { Container } from 'react-bootstrap';
import './Try.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Test2() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, giftBoxQuantity } = state;
  const [cartItemCount, setCartItemCount] = useState(0);

  // 添加汉堡菜单按钮状态
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // 汉堡菜单按钮点击事件处理函数
  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  //點選其他地方關閉漢堡菜單
  const handleOutsideClick = (e) => {
    if (isHamburgerOpen && e.target.closest('.mobile-menu')) {
      setIsHamburgerOpen(false);
    } else if (isHamburgerOpen && !e.target.closest('.hamburger-button')) {
      setIsHamburgerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHamburgerOpen]);

  useEffect(() => {
    // 计算购物车数量
    const itemCount = cart.cartItems.reduce(
      (count, item) => count + (item.quantity || 0),
      0
    );

    // 设置购物车数量
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

  // 添加汉堡菜单按钮状态
  const [device, setDevice] = useState(
    window.innerWidth > 600 ? 'PC' : 'mobile'
  );

  // 检测窗口大小变化以更新设备状态
  const handleResize = () => {
    setDevice(window.innerWidth > 600 ? 'PC' : 'mobile');
  };

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 移除监听器以防止内存泄漏
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Navbar
      className="fixed-top animate__animated animate__fadeIn animate__delay-3s"
      bg="none"
      // style={{ backgroundColor: '#ffffff29' }}
      // variant="light"
    >
      <Container>
        <LinkContainer to="/">
          <img className="logo-img me-auto" src={logo} alt="拾月菓logo.png" />
        </LinkContainer>
        <Nav className="">
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

          <Link to="/cart" className="nav-link">
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
            <Link className="nav-link me-5" to="/signin">
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

export default Test2;
