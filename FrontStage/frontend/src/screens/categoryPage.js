import React, { useState, createContext, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// 左邊的分類標題 (為了重複使用useState的data，所以採用createContext)
const CategoryContext = createContext();

function Category() {
  const { data } = useContext(CategoryContext);
  return (
    <>
      <Helmet>
        <title>產品分類 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <div
        className="CATtitle p-2 position-relative"
        style={{ zIndex: '2', color: 'rgb(78, 78, 78)' }}
      >
        {data}
      </div>
      <div
        className="CATtitle position-absolute d-none d-lg-block"
        style={{
          height: '12rem',
          width: '2rem',
          backgroundColor: '#fcdde2',
          top: '8%',
          right: '25%',
          zIndex: '1',
        }}
      >
        &nbsp;
      </div>
    </>
  );
}

// 上面的分類導覽列 + 影響左邊的分類標題
// useState 創建兩個狀態變數：color 和 state，並初始化為特定值
// textColor 函數根據傳入的 x 和當前的 state 決定導覽列文字的顏色
// setData 會把原本data的位置，換成setData的資料【會影響左邊的分類標題】
// setState(category === "所有商品" ? "所有商品" : category); 如果用戶點擊的是 "所有商品"，則將 state 設置為 "所有商品"， 否則，將 state 設置為用戶點擊的商品類別
// setState(category);  上面這段(改成這樣即可)【會影響上面的分類導覽列】
// setColor 將顏色設置為默認顏色，無論用戶點擊的是哪個商品類別 (這段不存在沒有影響，移除了)
function CategoryBar() {
  const { data, setData } = useContext(CategoryContext);
  const [color, setColor] = useState('#9A2540'); //初始被選到的顏色
  const [selector, setSelector] = useState('所有商品'); //初始被選到的文字
  const textColor = (x) =>
    x === selector ? { color: color } : { color: '#83818c' };
  const handleItemClick = (category) => {
    setData(category);
    setSelector(category);
  };
  return (
    <>
      <nav className="nav" style={{ marginTop: '12rem' }}>
        <p
          onClick={() => handleItemClick('饅頭')}
          style={textColor('饅頭')}
          className="nav-item fw-bolder fs-4"
        >
          饅頭
        </p>
        <p
          onClick={() => handleItemClick('大福')}
          style={textColor('大福')}
          className="nav-item fw-bolder fs-4"
        >
          大福
        </p>
        <p
          onClick={() => handleItemClick('水饅頭')}
          style={textColor('水饅頭')}
          className="nav-item fw-bolder fs-4"
        >
          水饅頭
        </p>
        <p
          onClick={() => handleItemClick('羊羹')}
          style={textColor('羊羹')}
          className="nav-item fw-bolder fs-4"
        >
          羊羹
        </p>
        <p
          onClick={() => handleItemClick('銅鑼燒')}
          style={textColor('銅鑼燒')}
          className="nav-item fw-bolder fs-4"
        >
          銅鑼燒
        </p>
        <p
          onClick={() => handleItemClick('所有商品')}
          style={textColor('所有商品')}
          className="nav-item fw-bolder fs-4"
        >
          所有商品
        </p>
        <span className="nav-indicator"></span>
      </nav>
    </>
    //     <nav className="nav">
    //         <a onClick={() => {setData("饅頭"); setColor("饅頭");}} style={{ color: textColor("饅頭") }} className="nav-item fw-bolder fs-4">饅頭</a>
    //         <a onClick={() => {setData("大福"); setColor("大福");}} style={{ color: textColor("大福") }} className="nav-item fw-bolder fs-4">大福</a>
    //         <a onClick={() => {setData("水饅頭"); setColor("水饅頭");}} style={{ color: textColor("水饅頭") }} className="nav-item fw-bolder fs-4">水饅頭</a>
    //         <a onClick={() => {setData("羊羹"); setColor("羊羹");}} style={{ color: textColor("羊羹") }} className="nav-item fw-bolder fs-4">羊羹</a>
    //         <a onClick={() => {setData("銅鑼燒"); setColor("銅鑼燒");}} style={{ color: textColor("銅鑼燒") }} className="nav-item fw-bolder fs-4">銅鑼燒</a>
    //         <a onClick={() => {setData("所有商品"); setColor("所有商品");}} style={{ color: textColor("所有商品") }} className="nav-item fw-bolder fs-4">所有商品</a>
    //         <span className="nav-indicator"></span>
    //     </nav>
  );
}

// response.data 已經是解析後的 JSON 數據
// useEffect 第一個參數是一個函數，它包含要執行的副作用代碼
// 第二個參數是一個陣列，它指定了哪些變數的改變會觸發該副作用。
// 第一個程式碼塊使用了一個空的依賴陣列（[]），代表該副作用只會在組件首次渲染時執行一次。
// 用於在組件首次渲染時發送HTTP請求並將響應數據存儲在某個狀態變數（setData）中。
// 在 ProductCard 組件中，要將 category 傳遞給組件，以便在發送 API 請求時使用。
function ProductCard({ category }) {
  // const { data, setData } = useContext(CategoryContext);
  // const [data, setData] = useState(["所有商品"])
  // useEffect(() => {
  //     axios.get(`http://localhost:2407/products/${category}`)
  //         .then(response => {
  //             setData(response.data);
  //         })
  //         .catch(error => {
  //             console.error('Error fetching data:', error);
  //         });
  // }, [data]);

  // const [hover, setHover] = useState(false);

  // const mouseEnter = () => {
  //   setHover(true);
  // };

  // const mouseLeave = () => {
  //   setHover(false);
  // };

  const [products, setProducts] = useState([]); // 新增一個狀態來儲存產品數據

  useEffect(() => {
    async function fetchProducts() {
      try {
        //let response是一個變數，用來存放從伺服器獲取的數據
        let response;
        if (category && category !== '所有商品') {
          // 發送請求以獲取產品數據
          response = await axios.get(
            ` http://localhost:5000/products/${category}`
          );
        } else {
          response = await axios.get(`http://localhost:5000/products`);
        }

        // 過濾掉禮盒 9/11新增
        const filteredProducts = response.data.filter((product) => {
          const excludedIds = [20, 21, 22]; // 需要排除的 _id
          return !excludedIds.includes(product._id);
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, [category]);
  // map函數的主要目的是將數據陣列中的每個元素映射到React元素
  // 在 map 内部，多個相鄰JSX 元素需要被包裹在一个父容器内。
  return (
    <>
      {products.map((product) => (
        <React.Fragment key={product._id}>
          <div className="col-6 col-lg-3 position-relative">
            <div
              className="position-absolute"
              style={{
                height: '25%',
                width: '0.3%',
                top: '35%',
                left: '7%',
                zIndex: 1,
                backgroundColor: 'rgb(78, 78, 78)',
              }}
            >
              &nbsp; {/* d-none d-sm-block */}
            </div>
            <div
              className="card border border-0 position-relative bg-transparent"
              // onMouseEnter={mouseEnter}
              // onMouseLeave={mouseLeave}
              style={{ marginBottom: '7rem' }}
            >
              <img
                alt="產品圖片"
                className="card-img-top img-fluid mx-auto text-center"
                style={{
                  borderRadius: '50% 50% 2% 2%',
                  width: '17em', // 圖片寬度
                  height: '13em', // 圖片高度
                }}
                // src="images/1.jpg"
                src={product.image}
              />
              {/* <div className={`overlay ${hover? 'cover' : ''}`} style={{ borderRadius: "50% 50% 2% 2%" }}>
              <div
                className={`overlay ${hover}`}
                style={{ borderRadius: '50% 50% 2% 2%' }}
              >
                <a className="text">了解更多</a>
              </div> */}
              <div className="card-body">
                <p className="card-title" style={{ color: 'rgb(78, 78, 78)' }}>
                  {product.slug}
                </p>
                <Link to={`/product/${product._id}`}>
                  <button className="buy btn-color w-75 fs-5">
                    <span>立即選購 </span>
                  </button>
                </Link>

                {/* <a
                  href={`/product/${product._id}`}
                  className="buy btn btn-secondary w-75 fs-5"
                >
                  <span>立即選購 </span>
                </a> */}
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

function CategoryPage() {
  const [data, setData] = useState('所有商品');

  return (
    <>
      <CategoryContext.Provider value={{ data, setData }}>
        <div id="nav" className="container mb-1">
          <CategoryBar />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-1 col-sm-12 fs-1 fw-bolder position-relative mb-5">
              <Category />
            </div>
            <div className="col-md-11 mb-5">
              <div className="row">
                <ProductCard category={data} />
              </div>
            </div>
          </div>
        </div>
      </CategoryContext.Provider>
    </>
  );
}

export default CategoryPage;
