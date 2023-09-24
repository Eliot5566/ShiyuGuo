// 第三步 四格禮盒 選擇卡片
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store.js';
import axios from 'axios';
import greenCardFront from '../images/card/green_card_front.png';
import offWhiteColorFront from '../images/card/offwhite_card_front.png';
import pinkCardFront from '../images/card/pink_card_front.png';
import greenCardBack from '../images/card/green_card_back.jpg';
import offWhiteColorBack from '../images/card/offwhite_card_back.jpg';
import pinkCardBack from '../images/card/pink_card_back.jpg';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MyProgress from '../components/MyProgress';
import { Helmet } from 'react-helmet-async';

const GiftCard = () => {
  const { state, dispatch } = useContext(Store); // 使用全局狀態和dispatch
  const [currentStep, setCurrentStep] = useState(2);
  const { selectedCard, cardContent, isConfirmed, userInfo, selectedProducts } =
    state;
  const [newSelectedCard, setNewSelectedCard] = useState(selectedCard);
  const [newCardContent, setNewCardContent] = useState(cardContent);
  //取得以選擇的產品資訊

  const navigate = useNavigate();
  // 初始化第二張圖片的路徑為空字串
  const [secondImage, setSecondImage] = useState('');
  const maxContentLength = 70; // 最大字數限制

  const handleCardSelect = (card) => {
    setNewSelectedCard(card);
    // 根據使用者選擇的卡片樣式更新第二張圖片的路徑
    switch (card) {
      case '綠色':
        setSecondImage(greenCardBack);
        break;
      case '米白':
        setSecondImage(offWhiteColorBack);
        break;
      case '粉色':
        setSecondImage(pinkCardBack);
        break;
      default:
        setSecondImage(''); // 預設情況下清空第二張圖片路徑
        break;
    }
    dispatch({ type: 'UPDATE_SELECTED_CARD', payload: card });
  };

  const handleContentChange = (event) => {
    const content = event.target.value;
    // 檢查是否超過最大字數限制，如果超過，則截斷內容
    if (content.length <= maxContentLength) {
      setNewCardContent(content);
    } else {
      setNewCardContent(content.slice(0, maxContentLength));
    }
    dispatch({ type: 'UPDATE_CARD_CONTENT', payload: content });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     //取得登入的使用者的 資料庫_id
  //     const userId = userInfo._id;
  //     // console.log('userId', userId);
  //     const cardType = selectedCard;
  //     // console.log('cardType', cardType);
  //     const cardContent = newCardContent;
  //     // console.log('cardContent', cardContent);

  //     // const selectedProduct = state.selectedProducts;
  //     const selectedProduct = JSON.stringify(state.selectedProducts); // 将数组转换为JSON字符串
  //     console.log('selectedProduct', selectedProduct);
  //     const response = await axios.post('/save-card-info', {
  //       userId,
  //       cardType,
  //       cardContent,
  //       selectedProduct,
  //     });

  //     if (response.status === 200) {
  //       navigate('/cardboxdetail');
  //       setNewCardContent('');
  //     } else {
  //       alert('卡片資訊儲存失敗');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('卡片資訊儲存失敗');
  //   }
  // };

  useEffect(() => {
    handleCardSelect('綠色');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      className="pt-3 shadow-lg"
      style={{
        backgroundColor: '#ffffffbc',
        margin: '15vh auto 10vh auto',
      }}
    >
      <Helmet>
        <title>客製化卡片 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <Row>
        <Col md={12}>
          <MyProgress currentStep={currentStep} />
        </Col>
      </Row>
      <div>
        <h3 className="text-center mt-5">一、選擇卡片樣式</h3>
        <Row className="m-3 card-front">
          <Col md={4} className="text-center">
            <img
              src={greenCardFront}
              onClick={() => handleCardSelect('綠色')}
              width={200}
              height={150}
              alt="綠色"
            />
            <p className="mt-2">綠色</p>
          </Col>
          <Col md={4} className="text-center">
            <img
              src={offWhiteColorFront}
              onClick={() => handleCardSelect('米白')}
              width={200}
              height={150}
              alt="米白色"
            />
            <p className="mt-2">米白</p>
          </Col>
          <Col md={4} className=" text-center">
            <img
              src={pinkCardFront}
              onClick={() => handleCardSelect('粉色')}
              width={200}
              height={150}
              alt="粉色"
            />
            <p className="mt-2">粉色</p>
          </Col>
        </Row>
        <Row>
          <hr />
          <h3 className="text-center mb-3">二、填寫卡片內容</h3>
          <Col md={6} className="d-flex justify-content-center ">
            <div className="card-back-img mb-3">
              {/* 所選卡片對應的圖片 */}
              <img
                src={secondImage}
                alt={newSelectedCard}
                width={334}
                height={250}
              />
              <p
                className="card-back-text"
                dangerouslySetInnerHTML={{ __html: newCardContent }}
              ></p>
            </div>
          </Col>
          <Col md={6}>
            <div>
              <p>
                *卡片預覽 <br /> <span>*超出文字將會被截斷</span>
              </p>
              <textarea
                className="form-control"
                rows="6" // 設定顯示幾行文字
                maxLength="70" // 添加最大字數限制
                placeholder="請輸入卡片內容"
                value={newCardContent}
                onChange={handleContentChange}
              ></textarea>
            </div>
          </Col>
          <div className="text-center mt-3 mb-3">
            <Link to="/cardboxdetail">
              <Button
                className="btn-color"
                // onClick={handleSubmit}
              >
                確定
              </Button>
            </Link>
          </div>
        </Row>
      </div>
    </Container>
  );
};

export default GiftCard;
