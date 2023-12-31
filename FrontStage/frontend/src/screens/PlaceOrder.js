import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { Store } from '../Store';
import { useContext } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { toast } from 'react-toastify';
import Axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import Paypal from '../images/paypal.svg';
import LinePay from '../images/LinePay.png';
import axios from 'axios';

// import { useState } from 'react';

//這裡的reducer是用來更新state的 這個頁面的state
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      // return { ...state, loading: true }; 這裡的...state是把原本的state複製一份 loading: true是更新state loading的值
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      //如果沒有符合的type 就回傳原本的state
      return state;
  }
};
export default function PlaceOrder() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const { order } = state;

  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.2345=>123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  //送出訂單後,自動寄信給使用者 傳送訂單資料

  const orderItems = cart.cartItems.map((item) => {
    return {
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    };
  });
  const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = 0.05 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const orderDetail = {
    orderItems,
    shipping_address: cart.shippingAddress,
    payment_method: cart.paymentMethod,
    items_price: itemsPrice,
    shipping_price: shippingPrice,
    tax_price: taxPrice,
    total_price: totalPrice,
  };
  console.log(orderDetail);

  //   cart.taxPrice = round2(0.15 * cart.itemsPrice);
  //晚點改回來
  //晚點改回來
  //晚點改回來
  //晚點改回來
  //晚點改回來
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;
  // cart.totalPrice = cart.itemsPrice;
  //滿百免運
  cart.shippingPrice = cart.itemsPrice >= 100 ? round2(0) : round2(10);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        selectedCard: state.selectedCard,
        selectedCard6: state.selectedCard6,
        selectedCard9: state.selectedCard9,
        cardContent: state.cardContent,
        cardContent6: state.cardContent6,
        cardContent9: state.cardContent9,
      };

      // 下面這行是用來發送訂單資料的 API 請求
      //orderResponse是後端回傳的資料 data是後端回傳的資料裡面的一個屬性
      const { data: orderResponse } = await Axios.post(
        '/api/orders',
        //orderData是要傳送的資料
        orderData,
        {
          //headers是要傳送的資料的格式 這裡是json格式 這裡的token是從userInfo裡面取得 來自於登入時的資料
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //ctxDispatch是Store.js裡的dispatch function 用來更新state
      ctxDispatch({ type: 'CART_CLEAR' });
      //dispatch是這個頁面的dispatch function 用來更新state 來自於useReducer
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      sendOrderDetail(orderResponse.order._id); // 將訂單ID作為參數傳遞
      toast.success('訂單已送出');

      //簡訊發送成功後再跳轉頁面

      navigate(`/order/${orderResponse.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(err.response.data.message);
    }
  };

  async function sendOrderDetail(orderId) {
    try {
      const { data } = await axios.post(
        `/api/orders/${orderId}/send`,
        orderDetail,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <Container className="small-container mb-5">
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>訂單明細 | 拾月菓</title>
      </Helmet>
      <h1 className="my-3"> 訂單明細</h1>
      <Row>
        <Col md={8}>
          <Card className="my-3">
            <Card.Body>
              <Card.Title>運送資訊</Card.Title>
              <Card.Text>
                <strong>姓名:</strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong>地址:</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">更改運送地址</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>付款方式</Card.Title>
              <img
                src={cart.paymentMethod === 'PayPal' ? Paypal : LinePay}
                alt="paypal"
                className="paypal linepay mb-4"
              />
              <br />

              <Link to="/payment">更改付款方式</Link>
            </Card.Body>
          </Card>

          {/* 產品明細 */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>商品</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">更改商品</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>訂單明細</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>商品</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>運費</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> 總計</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      className="btn-color"
                      // onClick={placeOrderHandler}
                      onClick={placeOrderHandler}
                      style={{ backgroundColor: '#9a2540' }}
                      disabled={cart.cartItems.length === 0}
                    >
                      送出訂單
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
