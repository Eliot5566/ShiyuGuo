import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import Page from './page';
import Page2 from './page2';
import Page3 from './page3';
import Page4 from './page4';
import Try from './Try';
import './nav.css';
import Test2 from './screens/Test2';

import './start.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';

// import Transition from './components/Transition';
import main1 from './images/專題2/品牌2.png';

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
    // pages 等於總和頁數
    //offest

    <div className="App my-background">
      <Parallax pages={6} style={{ top: '0', left: '0' }} className="animation">
        <ParallaxLayer offset={0} speed={0}>
          <div className="animation_layer parallax" id="block"></div>
        </ParallaxLayer>
        {/* --------------------------------------------------------------- */}
        <ParallaxLayer offset={0} speed={0}>
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
        {/* --------------------------------------------------------------- */}
        <ParallaxLayer offset={0} speed={0.7}>
          <div className="animation_layer parallax" id="cloud"></div>
        </ParallaxLayer>

        {/* 雲 */}
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

        <ParallaxLayer offset={0} speed={-0.2}>
          <div className="animation_layer parallax" id="Cherryblossoms"></div>
        </ParallaxLayer>
        {/* 櫻花 */}

        {/* --------------------------------------------------------------- */}

        <ParallaxLayer offset={0} speed={-0.3}>
          <div
            className="animation_layer parallax shake-vertical"
            id="Mountain"
          ></div>
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

        <ParallaxLayer offset={1}>
          <Page />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.2}>
          <div>
            <h1 className=" text-center fw-bold animate__animated animate__bounce  ">
              關於我們的故事
            </h1>

            <h2 className="text-center fw-bold ">「拾月菓」</h2>
            <br></br>
            <h4 className=" animate__fadeInDown  mx-5 fw-bold lh-3 ">
              日式菓子專賣店創辦於2023年資策會前端班，
              「十月」是我們學習了半年要結訓發表的月份，
              我們的團隊熱愛日本文化，於是決定創建日式點心為主題的網站，
              傳達品牌承襲日本文化、嚴選天然頂級原料的理念秉持著文化精髓中「不懈不怠、嚴謹專注」的職人精神。
            </h4>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={2.2} speed={0.2}>
          <div className="background2  h-50 "></div>
        </ParallaxLayer>
        <ParallaxLayer offset={2}>
          <Page2 />
        </ParallaxLayer>

        <ParallaxLayer offset={3.1}>
          <Page3 />
        </ParallaxLayer>

        <ParallaxLayer offset={4.3}>
          <Page4 />
        </ParallaxLayer>

        <ParallaxLayer>
          <Test2 />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default HomeTest;
