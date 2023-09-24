// 前端 (OrderHistory.js)
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
// import { getError } from '../utils';
import { Container, Button } from 'react-bootstrap';

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

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [], //
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: error.response.data.message || error.message,
        });
      }
    };
    fetchData();
  }, [userInfo]);
  console.log(orders);

  return (
    <Container className="small-container orderhistoryMb">
      <Helmet>
        <title>訂單查詢 | 拾月菓</title>
      </Helmet>

      <h1>訂單查詢</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>訂單日期</th>
              <th>訂單總額</th>
              <th>付款方式</th>
              <th>是否付款</th>
              <th>配送進度</th>
              <th>訂單明細</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                <td> {formatDateTime(order.created_at)}</td>
                <td>{order.total_price}</td>
                <td>{order.payment_method}</td>
                <td>{order.is_paid ? '已付款 ' : '尚未付款'}</td>

                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : '尚未出貨'}
                </td>
                <td>
                  <Button
                    className="btn-color"
                    onClick={() => {
                      navigate(`/order/${order.id}`);
                    }}
                  >
                    詳細資訊
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}
