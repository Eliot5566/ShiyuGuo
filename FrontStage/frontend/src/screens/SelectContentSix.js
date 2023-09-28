// 第二步 六格禮盒 選擇商品
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GiftProducts from '../components/GiftProducts';
import transparent from '../images/transparent.png';
import { Store } from '../Store';
import MyProgress from '../components/MyProgress';
import 'animate.css';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);
export default function SelectContentSix() {
  const { state, dispatch } = useContext(Store);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  // 待確認刪除-boxType
  const { boxType } = useParams();
  const [isNextButtonVisible, setNextButtonVisible] = useState(false);
  const navigate = useNavigate();

  // 定義一個狀態來存儲產品數據
  const [products, setProducts6] = useState([]);

  // 使用axios從API獲取產品數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/products'); // 替換成自己的API端點
        setProducts6(result.data);
        setProducts6(result.data);
      } catch (err) {
        console.error('獲取產品數據時出錯：', err);
      }
    };
    fetchData();
  }, []);

  // 點擊產品時的處理函數
  const handleProductSelect = (product) => {
    //如果選擇商品已滿 顯示提式
    if (state.selectedProducts6.length === 5) {
      MySwal.fire({
        title: '已選滿六個商品！',
        icon: 'warning',
        iconColor: '#e4849a',
        showConfirmButton: false, // 關閉按鈕
        timer: 1000, // 自動關閉時間（1秒）
      });
    }

    if (state.selectedProducts6.length >= 6) {
      // 已選擇的產品數量達到6個，顯示錯誤提示
      MySwal.fire({
        title: '數量已達上限！',
        icon: 'warning',
        iconColor: '#e4849a',
        confirmButtonColor: '#9a2540',
        confirmButtonText: '確定',
      });
      return;
    }

    // 使用dispatch將產品添加到全局狀態中
    dispatch({
      type: 'ADD_SELECTED_PRODUCT6',
      payload: { ...product, qty: 1 },
    });

    if (state.selectedProducts6.length === 5) {
      setNextButtonVisible(true);
    }
  };

  const handleProductRemove = (productToRemove) => {
    if (productToRemove) {
      // 使用dispatch將產品從全局狀態中移除
      dispatch({ type: 'REMOVE_SELECTED_PRODUCT6', payload: productToRemove });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleNextButtonClick = async () => {
    //如果商品尚未選滿6個，跳出警告
    if (state.selectedProducts6.length < 6) {
      MySwal.fire({
        title: '請選滿六個商品！',
        icon: 'warning',
        iconColor: '#e4849a',
        confirmButtonColor: '#9a2540',
        confirmButtonText: '確定',
      });
      return;
    }

    const userResponse = await MySwal.fire({
      title: '是否需要加入禮盒卡片？',
      icon: 'warning',
      iconColor: '#e4849a',
      confirmButtonColor: '#9a2540',
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: '需要', // 確認按鈕文本
      cancelButtonText: '不需要', // 取消按鈕文本
      dangerMode: true,
    });
    if (userResponse) {
      navigate(`/giftcard6`);
    } else {
      navigate(`/cardboxdetail6`);
    }
  };

  useEffect(() => {
    const selectedProductsTotalPrice = state.selectedProducts.reduce(
      (totalPrice, product) => {
        return totalPrice + product.price * product.qty;
      },
      0
    );

    // 更新禮盒價格到全局狀態
    dispatch({
      type: 'UPDATE_GIFT_BOX_PRICE',
      payload: selectedProductsTotalPrice,
    });
  }, [state.selectedProducts, dispatch]);

  return (
    <Container
      className="pt-3 shadow-lg"
      style={{
        backgroundColor: '#ffffffbc',
        margin: '15vh auto 10vh auto',
      }}
    >
      <Helmet>
        <title>客製禮盒產品內容 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <Row>
        <Col md={12}>
          <MyProgress currentStep={currentStep} />
        </Col>
      </Row>
      <Row className="selected-products mt-3">
        <Col className="d-flex justify-content-between align-items-center">
          <div className="next-button">
            <Link to={`/giftbox`}>
              <Button className="btn-color">上一步</Button>
            </Link>
          </div>
          <div className="next-button">
            {isNextButtonVisible && (
              <Button className="btn-color" onClick={handleNextButtonClick}>
                下一步
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-center">*點選商品添加至格子中</p>
          <div className="selected-six-box mx-auto">
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <div key={rowIndex} className="image-row">
                {[0, 1, 2].map((colIndex) => {
                  const selectedProduct =
                    state.selectedProducts6[rowIndex * 3 + colIndex];
                  return (
                    <img
                      key={colIndex}
                      src={selectedProduct?.product_package || transparent}
                      className="selected-product-image"
                      alt={`selected product ${rowIndex * 3 + colIndex}`}
                      onClick={() => handleProductRemove(selectedProduct)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <div className="category-buttons mt-5 text-center">
        {/* 隨機加入產品 */}

        <button
          className="btn-color me-2"
          onClick={() =>
            handleProductSelect(
              products[Math.floor(Math.random() * (products.length - 3))]
            )
          }
        >
          隨機商品
        </button>
        <button
          className={
            selectedCategory === 'all' ? 'btn-color me-2' : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('all')}
        >
          所有商品
        </button>
        <button
          className={
            selectedCategory === '銅鑼燒'
              ? 'btn-color me-2'
              : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('銅鑼燒')}
        >
          銅鑼燒
        </button>
        <button
          className={
            selectedCategory === '饅頭'
              ? 'btn-color me-2'
              : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('饅頭')}
        >
          饅頭
        </button>
        <button
          className={
            selectedCategory === '大福'
              ? 'btn-color me-2'
              : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('大福')}
        >
          大福
        </button>
        <button
          className={
            selectedCategory === '羊羹'
              ? 'btn-color me-2'
              : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('羊羹')}
        >
          羊羹
        </button>
        <button
          className={
            selectedCategory === '水饅頭'
              ? 'btn-color me-2'
              : 'btn-cat-color me-2'
          }
          onClick={() => handleCategoryChange('水饅頭')}
        >
          水饅頭
        </button>
      </div>
      <Row>
        {products
          .filter((product) =>
            selectedCategory === 'all'
              ? true
              : product.category === selectedCategory
          )
          .map((product) => (
            <Col
              key={product.slug}
              sm={6}
              md={4}
              lg={3}
              className="mb-3 giftPitcure"
              onClick={() => handleProductSelect(product)}
            >
              <GiftProducts product={product} />
            </Col>
          ))}
      </Row>
    </Container>
  );
}
