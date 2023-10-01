import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import Paypal from '../images/paypal.svg';
import LinePay from '../images/LinePay.png';

const clientId =
  'AYngKbWm4TYcnQURW3lDH60P0myyeMHowAHYDEz_oJ87IdUW71el5uPOt9FwbFTp5mPotEWGTOx0QxGm';
function formatDateTime(dateTimeString) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Taipei', // 指定您的時區，這裡是台北時區
    // timeZoneName: 'short', 自動獲取使用者使區域設定的時區名稱
  };

  return new Date(dateTimeString).toLocaleString(undefined, options);
}
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  //params是從url傳過來的值 這裡的params是一個物件
  const params = useParams();
  const { id: orderId } = params;
  console.log(orderId);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  //設定初始值
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    //useReducer是一個function 用來更新state 這裡的reducer是一個function 上面有定義
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });
  //usePayPalScriptReducer是一個function 用來更新state 來自@paypal/react-paypal-js
  //isPending是一個布林值 用來判斷是否正在載入
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  //createOrder是一個function 用來創建訂單 來自@paypal/react-paypal-js data是一個物件 用來傳遞訂單資訊 actions是一個物件 用來創建訂單
  function createOrder(data, actions) {
    return (
      actions.order
        //create是一個function 用來創建訂單 來自@paypal/react-paypal-js
        .create({
          //purchase_units是一個陣列 用來傳遞訂單資訊
          purchase_units: [
            {
              //amount是一個物件 用來傳遞訂單金額
              amount: {
                //value是一個數字 用來傳遞訂單金額
                value: order.total_price,
              },
            },
          ],
        })
        //then是一個function 用來傳遞訂單id  來自@paypal/react-paypal-js
        .then((orderID) => {
          return orderID;
        })
    );
  }
  //onApprove是一個function 用來傳遞訂單資訊 來自@paypal/react-paypal-js
  function onApprove(data, actions) {
    //actions.order.capture().then代表當訂單被捕獲時執行以下程式碼
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${orderId}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
        setTimeout(() => {
          if (successPay) {
            dispatch({ type: 'PAY_RESET' });
            window.location.reload(); //
          }
        }, 1000); //
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: err });
        console.log(successPay);
        toast.error(err.message);
      }
    });
  }
  function onError(err) {
    toast.error(err.message);
  }

  useEffect(() => {
    //fetchOrder是一個function 用來獲取訂單資訊 來自@paypal/react-paypal-js
    const fetchOrder = async () => {
      try {
        //dispatch是一個function 用來更新state 這裡的dispatch是一個function 上面有定義
        dispatch({ type: 'FETCH_REQUEST' });
        //改
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        //data.order_items是一個字串 用來傳遞訂單商品資訊
        data.order_items = JSON.parse(data.order_items);
        data.shipping_address = JSON.parse(data.shipping_address);
        console.log(data.shipping_address);

        //data.order_items是一個陣列 用來傳遞訂單商品資訊
        data.orderItems = data.order_items.map((item) => {
          return {
            _id: item._id,
            name: item.name,
            slug: item.slug,
            category: item.category,
            image: item.image,
            price: item.price,
            countInStock: item.countInStock,
            numReviews: item.numReviews,
            rating: item.rating,
            description: item.description,
            quantity: item.quantity,
          };
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setIsLoading(false);
        console.log(data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        setIsLoading(false);
      }
    };

    //userInfo是一個物件 用來傳遞使用者資訊
    if (!userInfo) {
      navigate('/login');
    }

    if (!order.id || successPay || (order.id && order.id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        try {
          const { data: clientId } = await axios.get('/api/keys/paypal', {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          console.log(
            123 +
              'AYngKbWm4TYcnQURW3lDH60P0myyeMHowAHYDEz_oJ87IdUW71el5uPOt9FwbFTp5mPotEWGTOx0QxGm'
          );

          paypalDispatch({
            type: 'resetOptions',
            value: {
              'client-id':
                'AYngKbWm4TYcnQURW3lDH60P0myyeMHowAHYDEz_oJ87IdUW71el5uPOt9FwbFTp5mPotEWGTOx0QxGm',
              currency: 'TWD',
            },
          });
          paypalDispatch({ type: 'setLoadingStatus', value: 'loaded' });
        } catch (error) {
          console.error('Error loading PayPal script:', error);
          paypalDispatch({ type: 'setLoadingStatus', value: 'failed' });
        }
      };
      loadPaypalScript();
    }
  }, [
    orderId,
    userInfo,
    navigate,
    isLoading,
    order._id,
    paypalDispatch,
    successPay,
    order.id,
  ]);

  // 如果載入中，顯示Loading
  return loading ? (
    <Loading></Loading>
  ) : // 如果載入失敗，顯示錯誤訊息
  error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    // 如果載入成功，顯示訂單資訊
    <Container className="small-container mb-5">
      <Helmet>
        <title>訂單 | 拾月菓 {orderId}</title>
      </Helmet>
      {/* //PayPalScriptProvider是一個function 用來載入PayPal script 來自@paypal/react-paypal-js */}
      <PayPalScriptProvider options={{ 'client-id': clientId }}>
        <h1 className="my-3">訂單編號 {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="border-bottom">運送資訊</Card.Title>

                <Card.Text>
                  {order.shipping_address && (
                    <div>
                      <strong>姓名:</strong> {order.shipping_address.fullName}{' '}
                      <br />
                      <strong>地址: </strong> {order.shipping_address.address},
                      {order.shipping_address.city},{' '}
                      {order.shipping_address.postalCode},
                      {order.shipping_address.country}
                    </div>
                  )}
                </Card.Text>

                {order.isDelivered ? (
                  <MessageBox variant="success">
                    送達時間 {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">尚未送達</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="border-bottom mb-3">付款資訊</Card.Title>
                <Card.Text>
                  <strong>付款方式： </strong>
                  {/* <br /> */}

                  <img
                    src={order.payment_method === 'PayPal' ? Paypal : LinePay}
                    alt="paypal"
                    className="paypal linepay ms-1"
                  />
                </Card.Text>
                {order.is_paid ? (
                  <MessageBox variant="success">
                    已付款 {formatDateTime(order.paid_at)}
                  </MessageBox>
                ) : (
                  <span>尚未付款</span>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="border-bottom">購買明細</Card.Title>
                <ListGroup variant="flush">
                  {order?.orderItems?.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />{' '}
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
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title className="border-bottom">訂單明細</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>商品</Col>
                      <Col>${parseFloat(order.items_price).toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>運費</Col>
                      <Col>${parseFloat(order.shipping_price).toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>總價</strong>
                      </Col>
                      <Col>
                        <strong>
                          ${parseFloat(order.total_price).toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.is_paid && (
                    <ListGroup.Item>
                      {isPending ? (
                        <Loading />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <Loading></Loading>}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </PayPalScriptProvider>
    </Container>
  );
}
