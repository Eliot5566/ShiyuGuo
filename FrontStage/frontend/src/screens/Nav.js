import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import shopcar from '../images/購物車_icon_0.png';
import membericon from '../images/會員icon_0.png';
import hamburgericon from '../images/漢堡icon_0.png';
import logo from '../images/拾月菓logo.png';
import { useContext } from 'react';
import { Store } from '../Store';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';

// import Home from './Home';
const Nav = () => {
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
  const useRWD = () => {
    const [device, setDevice] = useState(
      window.innerWidth > 600 ? 'PC' : 'mobile'
    );

    const handleRWD = () => {
      if (window.innerWidth > 600) setDevice('PC');
      else setDevice('mobile');
    };

    useEffect(() => {
      window.addEventListener('resize', handleRWD);
      return () => {
        window.removeEventListener('resize', handleRWD);
      };
    }, []);

    return device;
  };

  const myFunction = () => {
    var x = document.getElementById('myTopnav');
    if (x.className === 'topnav') {
      x.className += ' responsive';
    } else {
      x.className = 'topnav';
    }
  };
  return (
    <Navbar className="topnav" id="myTopnav">
      <Link className="nav-link ms-auto" to="/">
        首頁
      </Link>
      <Link className="nav-link ms-auto" to="category">
        所有商品
      </Link>
      <Link className="nav-link " to="giftbox">
        客製禮盒
      </Link>
      <Link className="nav-link ms-auto" to="faq">
        常見問題
      </Link>
      <Link className="nav-link ms-auto" to="faq">
        聯絡我們
      </Link>
      <Link to="/cart" className="nav-link">
        <img className="icon-img" src={shopcar} alt="購物車.png" />
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
          <img className="icon-img" src={membericon} alt="會員icon" />
        </Link>
      )}

      <Link href="#" className="icon" onClick={myFunction}>
        漢堡
      </Link>
    </Navbar>
  );
};

export default Nav;
