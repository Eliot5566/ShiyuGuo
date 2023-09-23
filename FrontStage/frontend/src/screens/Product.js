import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const quantity = parseInt(input); //

    if (isNaN(quantity) || quantity < 1) {
      swal({
        title: '請輸入有效的數量',
        text: '請重新輸入數量',
        icon: 'error',
        button: '確定',
      });
      // window.alert('請輸入有效的數量');
      return;
    }

    const existItem = cartItems.find((x) => x._id === item._id);
    const productInStock = data.countInStock;

    if (existItem) {
      //existItem.quantity是購物車裡已經有的數量 quantity是現在要加入的數量
      const totalQuantity = existItem.quantity + quantity;
      //totalQuantity是購物車裡已經有的數量+現在要加入的數量
      if (totalQuantity > productInStock) {
        // 如果購物車裡已經有的數量+現在要加入的數量>庫存
        MySwal.fire({
          title: <strong>購物車數量已大於庫存量</strong>,
          html: <p>請選購其他商品~</p>,
          icon: 'error',
          iconColor: '#e4849a',
          confirmButtonColor: '#9a2540',
          confirmButtonText: '我知道了',
        });
        // window.alert('抱歉,庫存不足');
      } else {
        // 如果購物車裡已經有的數量+現在要加入的數量<=庫存
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity: totalQuantity },
        });
        // 提示成功加入購物車
        MySwal.fire({
          title: <strong>成功加入購物車</strong>,
          html: <p>謝謝選購，可以到購物車查看內容~</p>,
          icon: 'success',
          iconColor: '#e4849a',
          confirmButtonColor: '#9a2540',
          confirmButtonText: '我知道了',
        });
      }
    } else {
      // 如果購物車裡沒有這個商品 且 現在要加入的數量>庫存
      if (quantity > productInStock) {
        // 提示庫存不足
        MySwal.fire({
          title: <strong>很抱歉，目前沒有庫存</strong>,
          html: <p>請選購其他商品~</p>,
          icon: 'error',
          iconColor: '#e4849a',
          confirmButtonColor: '#9a2540',
          confirmButtonText: '我知道了',
        });

        // window.alert('抱歉,庫存不足');
      } else {
        // 如果購物車裡沒有這個商品 且 現在要加入的數量<=庫存
        ctxDispatch({
          // 將商品加入購物車
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
        MySwal.fire({
          title: <strong>成功加入購物車</strong>,
          html: <p>謝謝選購，可以到購物車查看內容~</p>,
          icon: 'success',
          iconColor: '#e4849a',
          confirmButtonColor: '#9a2540',
          confirmButtonText: '我知道了',
        });
      }
    }
  };
  // const addToCartHandler = async (item) => {
  //   const quantity = parseInt(input); // 從input中獲取商品數量
  //   if (isNaN(quantity) || quantity < 1) {
  //     window.alert('請輸入有效的商品數量');
  //     return;
  //   }

  //   const existItem = cartItems.find((x) => x._id === item._id);

  //   if (existItem) {
  //     if (existItem.quantity + quantity > max) {
  //       window.alert('抱歉，庫存不足');
  //     } else {
  //       ctxDispatch({
  //         type: 'CART_ADD_ITEM',
  //         payload: { ...item, quantity: existItem.quantity + quantity },
  //       });
  //     }
  //   } else {
  //     if (quantity > max) {
  //       window.alert('抱歉，庫存不足');
  //     } else {
  //       ctxDispatch({
  //         type: 'CART_ADD_ITEM',
  //         payload: { ...item, quantity },
  //       });
  //     }
  //   }
  // };

  const { _id } = useParams();
  const [data, setData] = useState(null); // 修改為 null

  useEffect(() => {
    async function fetchProduct() {
      // 修改函数名
      try {
        let response = await axios.get(
          //這裡的5000是後端的port number
          `http://localhost:5000/api/products/${_id}`
        );
        setData(response.data); // 將數據保存到data中
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [_id]);

  const [input, setInput] = useState('1');
  const min = 1;
  const max = 20;

  const minus = () => {
    if (input > min) {
      setInput(parseInt(input) - 1);
    }
  };

  const plus = () => {
    if (input < max) {
      setInput(parseInt(input) + 1);
    }
  };

  const MaxHandler = () => {
    const quantity = parseInt(input);
    if (quantity === 20) {
      MySwal.fire({
        title: <strong>訂購商品上限為20個</strong>,
        html: <p>感謝您的支持~</p>,
        icon: 'warning',
        iconColor: '#e4849a',
        confirmButtonColor: '#9a2540',
        confirmButtonText: '我知道了',
      });
    }
  };

  return (
    <>
      {data && ( // 添加條件渲染以確保data已加载
        <div
          key={data._id}
          className="container"
          style={{ marginBottom: '15rem' }}
        >
          <div className="row text-center mt-5 fw-bold text-secondary">
            <span
              className="mb-3"
              style={{
                fontSize: '2.7rem',
                color: 'rgb(78, 78, 78)',
                letterSpacing: '1rem',
              }}
            >
              {data.category}
            </span>
            <div className="border-top">&nbsp;</div>
          </div>
          <div className="row mt-1">
            <div className="col-md-12 col-lg-6 align-items-center justify-content-center p-0">
              <img
                alt="產品圖片"
                src={data.image}
                className="img-fluid"
                style={{ width: '100%', height: '50vh' }}
              />
            </div>
            <div
              className="col-md-12 col-lg-6 p-5"
              style={{
                borderRadius: '0% 30% 30% 0%',
                backgroundColor: '#fcdde2',
                height: '50vh',
              }}
            >
              <Helmet>
                <title>{data.name}</title>
              </Helmet>
              <p
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'rgb(55, 55, 55)',
                }}
              >
                {data.name}
              </p>
              <div className="d-flex align-items-baseline">
                <div
                  className="fs-2 fw-bold"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'rgb(78, 78, 78)',
                  }}
                >
                  ${data.price}
                </div>
                <div className="fs-5 fw-bold ms-5" style={{ color: '#c97689' }}>
                  庫存：{data.countInStock}
                </div>
              </div>
              <p
                className="fs-5"
                style={{ fontWeight: 600, color: 'rgb(55, 55, 55)' }}
              >
                {data.description}
              </p>
              <button
                onClick={minus}
                className="btn btn-light fw-bolder rounded-circle fs-5"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  lineHeight: '1rem',
                }}
              >
                -
              </button>
              <input
                className="fw-bolder fs-5 m-1 text-center input-number"
                value={input}
                readOnly
                min={min}
                max={max}
                style={{ width: '4rem' }}
              />
              <button
                onClick={() => {
                  plus();
                  MaxHandler();
                }}
                className="btn btn-light fw-bolder rounded-circle fs-5"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  lineHeight: '1rem',
                }}
              >
                +
              </button>
              <button
                onClick={() => addToCartHandler(data)} // 傳遞data
                className="btn-color ms-4"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
