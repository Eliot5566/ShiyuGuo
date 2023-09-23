import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import Page from './page';
import Page2 from './page2';
import Page3 from './page3';
import Page4 from './page4';
import './nav.css';
import './start.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
// import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import Test2 from './screens/Test2';
import Try from './screens/Try';
import Nav from './screens/Nav';
import ScrollToTopButton from './components/ScrollToTopButton';

// import Transition from './components/Transition';

function HomeTest() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, giftBoxQuantity } = state;
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // 計算購物車數量
    const itemCount = cart.cartItems.reduce(
      (count, item) => count + (item.quantity || 0),
      0
    );

    // 設定購物車數
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

  //920修改

  //   const useRWD= ()=>{
  //     const [device,setDevice]=useState("mobile");

  //     const handleRWD=()=>{
  //         if(window.innerWidth>600)
  //             setDevice("PC");

  //         else setDevice("mobile");
  //     }

  //         useEffect(()=>{
  //             window.addEventListener('resize',handleRWD);
  //             return(()=>{
  //                 window.removeEventListener('resize',handleRWD);
  //             })
  //         },[]);

  //     return device;
  // }

  // const device = useRWD(); // Get the device type using the useRWD hook

  //920
  return (
    // pages 等於總和頁數
    //offest

    // <div className="App my-background" style={{ width: '100%', height: '200%', background: '#253237' }}>
    <div style={{ width: '100%', height: '100vh' }}>
      <Parallax pages={7} style={{ top: '0', left: '0' }} className="animation">
        <ParallaxLayer offset={0} speed={0}>
          <div className="animation_layer parallax" id="block"></div>
        </ParallaxLayer>
        {/* --------------------------------------------------------------- */}
        <ParallaxLayer offset={0} speed={-0.25}>
          <div className="animation_layer parallax" id="bg"></div>
          <div className="vertical-text text-wrap fs-2 fw-bold h-100 ">
            <div>每</div>
            <div>一</div>
            <div>口</div>
            <div>，</div>
            <div>都</div>
            <div>是</div>
            <div>和</div>
            <div>菓</div>
            <div>子</div>
            <div>的</div>
            <div>味</div>
            <div>道</div>
          </div>

          <div className="vertical-text2 text-wrap fs-4 fw-bold ">
            <div>伝</div>
            <div>統</div>
            <div>說</div>
            <div>の</div>
            <div>、</div>
            <div>新</div>
            <div>し</div>
            <div>い</div>
            <div>出</div>
            <div>会</div>
            <div>い</div>
          </div>
        </ParallaxLayer>

        {/* <ParallaxLayer offset={0} speed={0.55}>
          <div className="animation_layer parallax" id="cloud"></div>
        </ParallaxLayer> */}

        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0.7}>
          <div className="animation_layer parallax" id="sun"></div>
        </ParallaxLayer>
        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0.6}>
          <div className="animation_layer parallax" id="logo"></div>
        </ParallaxLayer>

        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0.68}>
          <div className="animation_layer parallax" id="rabbit"></div>
          {/* 兔子 */}
        </ParallaxLayer>
        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0.25}></ParallaxLayer>
        {/* <ParallaxLayer offset={0} speed={-0.1}>
          <div className="animation_layer parallax" id="closeshot"></div>
        </ParallaxLayer>   */}

        {/* --------------------------------------------------------------- */}

        {/* <ParallaxLayer offset={0} speed={-0.8}>
          <div className="animation_layer parallax" id="Torii"></div>
        </ParallaxLayer> */}
        {/* 鳥居 */}
        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0}>
          <div className="animation_layer parallax" id="Cherryblossoms"></div>
        </ParallaxLayer>
        {/* 櫻花 */}

        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={0}>
          <div className="animation_layer parallax" id="Mountain"></div>
        </ParallaxLayer>
        {/* 富士山 */}
        {/* --------------------------------------------------------------- */}
        {/* 森林與門 */}
        <ParallaxLayer offset={0} speed={0}>
          <div className="animation_layer parallax" id="bottom"></div>

          <div className="ldoor ldoorleave">
            <img
              className="position-absolute bottom-0 end-0 h-100"
              src={require('./images/leftDoor.png')}
              alt=""
            />
          </div>
          <div className="rdoor ldoorleave">
            <img
              className="h-100 "
              src={require('./images/rightDoor.png')}
              alt=""
            />
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0}>
          <Page />
        </ParallaxLayer>

        <ParallaxLayer offset={2}>
          <Page2 />
        </ParallaxLayer>

        <ParallaxLayer offset={3}>
          <Page3 />
        </ParallaxLayer>

        <ParallaxLayer offset={4} id="page1">
          <Try />
          <ScrollToTopButton />
        </ParallaxLayer>

        <ParallaxLayer offset={5} className="flyrabbit">
          <div className="animation_layer parallax bg-yellow" id="flyrabbit">
            <ScrollToTopButton />
          </div>
          <Try />
          {/* 兔子 */}
        </ParallaxLayer>
        {/* 建立新頁面 可以占滿整個畫面 而不是只有一部分 */}

        <ParallaxLayer offset={6} className="flyrabbit">
          <div
            className="animation_layer parallax bg-yellow"
            id="flyrabbit"
          ></div>
          <Try />
        </ParallaxLayer>
        {/* speed={-1} */}

        <ParallaxLayer>
          {/* <Navbar
            className="fixed-top  animate__animated animate__fadeIn animate__delay-3s "
            bg="none"
            variant=""
          >
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>首頁</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  購物車
                  {cartItemCount > 0 && (
                    <Badge pill bg="danger">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
                <Link className="nav-link " to="giftbox">
                  客製禮盒
                </Link>

                <Link className="nav-link ms-auto" to="faq">
                  常見問題
                </Link>
                <Link className="nav-link ms-auto" to="category">
                  最新商品
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
                    登入
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar> */}

          <Test2 />
          {/* <Nav /> */}
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default HomeTest;
