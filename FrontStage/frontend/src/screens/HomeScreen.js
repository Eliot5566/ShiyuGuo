import { useEffect, useReducer } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from '../logger.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product.js';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox.js';
import MessageBox from '../components/MessageBox.js';

//根據action.type來決定要做什麼事情
const reducer = (state, action) => {
  switch (action.type) {
    //如果是FETCH_REQUEST，就回傳一個新的state，並且把loading設為true
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //如果是FETCH_SUCCESS，就回傳一個新的state，並且把loading設為false，並且把products設為action.payload
    case 'FETCH_SUCCESS':
      //action.payload是從後端傳來的資料
      return { ...state, products: action.payload, loading: false };
    //如果是FETCH_FAIL，就回傳一個新的state，並且把loading設為false，並且把error設為action.payload
    case 'FETCH_FAIL':
      //action.payload是從後端傳來的錯誤訊息
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  //使用useEffect來取得資料
  useEffect(() => {
    //定義一個async function，並且使用axios來取得資料
    const fetchData = async () => {
      //使用try catch來處理錯誤
      //dispatch是用來發送action的，這裡發送的是FETCH_REQUEST
      //dispatch({ type: 'FETCH_REQUEST' })，這裡的type是自己定義的，可以是任何字串
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        //使用axios來取得資料
        const result = await axios.get('/api/products');
        //如果成功，就發送FETCH_SUCCESS，並且把從後端取得的資料放到action.payload
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        //如果失敗，就發送FETCH_FAIL，並且把錯誤訊息放到action.payload
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //   setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>拾月菓</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}> </Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
