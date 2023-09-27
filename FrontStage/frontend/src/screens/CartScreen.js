import React, { useContext, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './rabbit.css';
import { Container, Row, Col, ListGroup, Button, Card } from 'react-bootstrap';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export default function CartScreen() {
  const [selectedGiftBoxType, setSelectedGiftBoxType] = useState('4');
  const [expandedProduct, setExpandedProduct] = useState(null);

  // 在 CartScreen 組件中定義三種不同禮盒尺寸的卡片內容和樣式

  const navigate = useNavigate();

  //dispatch是用來發送action的，這裡發送的是FETCH_REQUEST
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems },
    selectedProducts,
    selectedProducts6,
    selectedProducts9,
    selectedCard,
    selectedCard6,
    selectedCard9,
    cardContent,
    cardContent6,
    cardContent9,
    _id,
  } = state;

  //cardContentMap 是一個對象，用來存儲卡片內容和樣式
  const cardContentMap = {
    4: {
      cardType: selectedCard,
      cardContent: cardContent,
    },
    6: {
      cardType: selectedCard6,
      cardContent: cardContent6,
    },
    9: {
      cardType: selectedCard9,
      cardContent: cardContent9,
    },
  };

  //根據禮盒尺寸選擇卡片內容
  const selectedCardContent = cardContentMap[selectedGiftBoxType];

  //將產品 map 轉換為產品列表
  const productMap = selectedProducts.reduce((map, product) => {
    //const{ _id, name } = product是解構賦值 用來獲取product的_id和name
    const { _id, name } = product;
    //如果map[_id]不存在，則創建一個新的對象，並且把product的count設為0
    if (!map[_id]) {
      //map[_id]是一個對象，用來存儲產品的數量 { 產品_id: 產品數量 }
      map[_id] = { ...product, count: 0 };
    }
    //如果map[_id]存在，則把product的count加1
    map[_id].count += 1;
    return map;
    //map是一個對象，用來存儲產品的數量 { 產品_id: 產品數量 } 這裡返回的是map , {}是初始值
  }, {});

  const productMap6 = selectedProducts6.reduce((map, product) => {
    const { _id, name } = product;
    if (!map[_id]) {
      map[_id] = { ...product, count: 0 };
    }
    map[_id].count += 1;
    return map;
  }, {});

  const productMap9 = selectedProducts9.reduce((map, product) => {
    const { _id, name } = product;
    if (!map[_id]) {
      map[_id] = { ...product, count: 0 };
    }
    map[_id].count += 1;
    return map;
  }, {});

  const toggleProductContent = (itemId, giftBoxType) => {
    if (expandedProduct === itemId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(itemId);
      setSelectedGiftBoxType(giftBoxType);
    }
  };

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      // swal({
      //   title: "商品數量不足",
      //   text: "請重新選擇商品數量",
      //   icon: "warning",
      //   button: "確定",
      // });
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    MySwal.fire({
      title: <strong>確定要清空此商品?</strong>,
      icon: 'warning',
      iconColor: '#e4849a',
      showCancelButton: true,
      confirmButtonColor: '#9a2540',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      }
    });
  };

  const MaxHandler = (item) => {
    if (item.quantity >= 20) {
      MySwal.fire({
        title: <strong>訂購商品上限為20個</strong>,
        html: <p>感謝您的支持～</p>,
        icon: 'warning',
        iconColor: '#e4849a',
        confirmButtonColor: '#9a2540',
        confirmButtonText: '我知道了',
      });
      return true; // 表示已達到最大限制
    }
    return false; // 表示未達到最大限制
  };

  const plus = (item) => {
    if (!MaxHandler(item)) {
      setInput(parseInt(input) + 1);
      updateCartHandler(item, item.quantity + 1);
    }
    if (item.quantity === 0) {
      MySwal.fire({
        title: <strong>庫存已售罄</strong>,
        html: <p>感謝您的支持～</p>,
        icon: 'warning',
        iconColor: '#e4849a',
        confirmButtonColor: '#9a2540',
        confirmButtonText: '我知道了',
      });
    }
  };

  // const minus = (item) => {
  //   if (input > min) {
  //     setInput(parseInt(input) - 1);
  //   }
  // };

  const minus = (item) => {
    if (item.quantity > min) {
      setInput(parseInt(input) - 1);
      updateCartHandler(item, item.quantity - 1);
    }
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      //取得登入的使用者的 資料庫_id
      const userId = userInfo._id;
      // console.log('userId', userId);
      const cardType = selectedCard;
      // console.log('cardType', cardType);
      // console.log('cardContent', cardContent);
      // const selectedProduct = state.selectedProducts;
      const selectedProduct = JSON.stringify(state.selectedProducts);
      const response = await axios.post('/save-card-info', {
        userId,
        cardType,
        cardContent,
        selectedProduct,
      });

      if (response.status === 200) {
        // navigate('/cart');
      } else {
        swal({
          title: '請先登入會員',
          text: '請先登入會員',
          icon: 'warning',
          button: '確定',
        });
        // alert('請先登入會員');
      }
    } catch (error) {
      console.error('Error:', error);
      swal({
        title: '請先登入會員',
        text: '請先登入會員',
        icon: 'warning',
        button: '確定',
      });
      // alert('請先登入會員');
    }
  };

  const [input, setInput] = useState('1');
  const min = 1;
  const max = 20;

  return (
    <div className="cartstyle" style={{ marginTop: '10rem' }}>
      <Container>
        <Helmet>
          <title>購物車內容 | 拾月菓</title>
        </Helmet>
        <h1 className="mt-5 mb-4 fw-bold" style={{ color: 'rgb(78,78,78)' }}>
          購物車內容
        </h1>

        <Row>
          <Col md={8} className="border-0">
            {cartItems.length === 0 ? (
              <div className="allForRabbit">
                <div className="clouds"></div>
                <div className="rabbit"></div>
                <br />
                <div
                  className="carp  fw-bold"
                  style={{ color: 'rgb(78,78,78)' }}
                >
                  <p>購物車目前空空的，快點去挑選喜歡的產品吧～</p>
                </div>
              </div>
            ) : (
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      {/* <Col md={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail "
                          style={{
                            height: '10rem',
                            width: '10rem',
                            objectFit: 'cover',
                          }}
                          onClick={() => {
                            if (item.isGiftBox) {
                              toggleProductContent(item._id, item.giftBoxType);
                            }
                          }}
                        />
                      </Col> */}
                      <Col md={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail position-relative"
                          style={{
                            height: '10rem',
                            width: '10rem',
                            objectFit: 'cover',
                          }}
                          onMouseEnter={() =>
                            item.isGiftBox && !expandedProduct
                              ? (document.getElementById(
                                  `tooltip-${item._id}`
                                ).style.visibility = 'visible')
                              : null
                          }
                          onMouseLeave={() =>
                            item.isGiftBox && !expandedProduct
                              ? (document.getElementById(
                                  `tooltip-${item._id}`
                                ).style.visibility = 'hidden')
                              : null
                          }
                          onClick={() => {
                            if (item.isGiftBox) {
                              toggleProductContent(item._id, item.giftBoxType);
                            }
                          }}
                        />
                        {item.isGiftBox && (
                          <div
                            id={`tooltip-${item._id}`}
                            className="position-absolute"
                            style={{
                              padding: '0.5rem',
                              zIndex: '0',
                              top: '0',
                              left: '2.3%',
                              width: '18%',
                              borderRadius: '0.5rem',

                              visibility: 'hidden',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              fontSize: '1rem',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            點擊查看商品內容
                          </div>
                        )}
                      </Col>

                      <Col md={4}>
                        <Link
                          to={`/product/${item._id}`}
                          className="text-decoration-none fw-bold"
                          style={{ fontSize: '1.5rem', color: 'rgb(78,78,78)' }}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() => minus(item)}
                          className="fw-bolder rounded-circle fs-5 p-0 border-0 btn-color"
                          style={{
                            width: '2rem',
                            height: '2rem',
                            lineHeight: '0.5rem',
                            backgroundColor: '#9a2540',
                          }}
                          disabled={item.quantity === 1}
                        >
                          -
                        </Button>
                        <span className="fs-5 p-2">{item.quantity}</span>
                        <Button
                          onClick={() => plus(item)}
                          className="fw-bolder rounded-circle fs-5 p-0 border-0 btn-color"
                          style={{
                            width: '2rem',
                            height: '2rem',
                            lineHeight: '0.5rem',
                            backgroundColor: '#9a2540',
                          }}
                          disabled={item.quantity === item.countInStock}
                        >
                          +
                        </Button>
                      </Col>
                      <Col md={2}>
                        <div className="fs-5">NT$&nbsp;{item.price}</div>
                      </Col>

                      <Col md={1}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="none"
                        >
                          <i
                            className="fas fa-trash-alt btn-color"
                            style={{ fontSize: '1.5rem', color: '#9a2540' }}
                          ></i>
                        </Button>
                      </Col>
                    </Row>
                    {item.isGiftBox && expandedProduct === item._id && (
                      <div>
                        <div>
                          {(() => {
                            const productCounts =
                              selectedGiftBoxType === '4'
                                ? productMap
                                : selectedGiftBoxType === '6'
                                ? productMap6
                                : productMap9;

                            return Object.entries(productCounts).map(
                              ([productId, product]) => {
                                const count = product.count;

                                return (
                                  count > 0 && (
                                    <div
                                      key={productId}
                                      className="product-details"
                                    >
                                      <img
                                        src={product.image}
                                        alt={`selected product ${productId}`}
                                        className="selected-product-image"
                                      />
                                      <span className="ms-3 fs-5">{`${product.slug} x ${count}`}</span>
                                    </div>
                                  )
                                );
                              }
                            );
                          })()}
                        </div>
                        <h4>卡片內容：</h4>
                        <p>樣式：{selectedCardContent.cardType}</p>
                        <p>內容：{selectedCardContent.cardContent}</p>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3
                      className="text-center fw-bold"
                      style={{ color: 'rgb(78,78,78)' }}
                    >
                      商品數量 ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      件) : NT$&nbsp;
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        className="text-white fs-4 btn-color mt-2"
                        onClick={() => {
                          checkoutHandler();
                          handleSubmit(); //
                        }}
                        type="button"
                        variant="primary"
                        style={{ backgroundColor: '#9a2540' }}
                        disabled={cartItems.length === 0}
                      >
                        前往結帳
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
