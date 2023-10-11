import Transition from '../components/Transition';
import LineChart from './LineChart';
import PieChart from './PieChart';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSackDollar,
  faCartShopping,
  faArrowTrendDown,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const exportToPDF = () => {
  const content = document.getElementById('report-content');
  //   const pdf = new jsPDF();
  const pdf = new jsPDF({
    orientation: 'landscape', // 設置為橫向
  });

  html2canvas(content).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    //10 10 190 0 代表的是圖片的位置和大小，可以自己設定

    // pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.addImage(imgData, 'PNG', 10, 10, 0, 130);
    pdf.save('report.pdf');
  });
};

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  // 在第一次渲染時抓訂單及商品資料
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // 訂單
    const fetchOrderData = async () => {
      try {
        const response = await axiosPrivate.post('/order', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          signal: controller.signal,
        });
        // console.log(response.data.length);
        isMounted && setOrders(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    // 商品
    const fetchProductData = async () => {
      try {
        const response = await axiosPrivate.post('/products', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          signal: controller.signal,
        });
        // console.log(response.data.length);
        isMounted && setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    // 抓資料
    fetchOrderData();
    fetchProductData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 計算營收(每筆訂單的total_price加總)
  const totalPrices = orders.reduce((total, order) => {
    // 這邊的 total_price 保險一點可以用parseInt或parseFloat處理一下
    return total + order.total_price;
  }, 0); // 0 是初始的 total 值

  // 計算已付款
  const isPaid = orders.filter((order) => order.is_paid === 1).length;

  // 計算庫存過低
  const lowInStock = products.filter(
    (product) => product.countInStock < 10
  ).length;

  // 計算「已付款」的所有訂單的總金額
  const totalPaidAmount = orders
    .filter((order) => order.is_paid === 1)
    .reduce((total, order) => {
      // 這邊的 total_price 保險一點可以用parseInt或parseFloat處理一下
      return (total += order.total_price);
    }, 0);

  // 數字漸變動畫(包裝成組件)
  const Counter = ({ from, to, duration }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
      const controls = animate(count, to, { duration: duration });
      return controls.stop;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <motion.h2 className="mb-0">{rounded}</motion.h2>;
  };

  return (
    <Transition>
      <Helmet>
        <title>儀錶板</title>
      </Helmet>
      <div id="report-content">
        {/* 放入訂單數量、營收、已付款、庫存過低、訂單總價、圖表 */}
        <section className="contanier-fluid p-3 bg-light">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3 p-3">
              <div className="d-flex justify-content-around p-4 align-items-center bg-white border border-dark shadow shadow-sm rounded-3">
                <FontAwesomeIcon
                  icon={faSackDollar}
                  className="fs-1 text-success"
                />
                <div className="text-center">
                  <p>營收</p>
                  <div className="d-flex">
                    <Counter from={0} to={totalPaidAmount} duration={1.5} />
                    <span className="ms-1 align-self-center">元</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 p-3">
              <div className="d-flex justify-content-around p-4 align-items-center bg-white border border-dark shadow shadow-sm rounded-3">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="fs-1 text-info"
                />
                <div className="text-center">
                  <p>已付款</p>
                  <div className="d-flex">
                    <Counter from={0} to={isPaid} duration={1.5} />
                    <span className="ms-1 align-self-center">筆</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 p-3">
              <Link
                className="d-flex justify-content-around p-4 align-items-center bg-white border border-dark shadow shadow-sm rounded-3 text-black"
                to="/products"
              >
                <FontAwesomeIcon
                  icon={faArrowTrendDown}
                  className="fs-1 text-danger"
                />
                <div className="text-center">
                  <p>庫存過低</p>
                  <div className="d-flex justify-content-center">
                    <Counter from={0} to={lowInStock} duration={1.5} />
                    <span className="ms-1 align-self-center">款</span>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-3 p-3">
              <div className="d-flex justify-content-around p-4 align-items-center bg-white border border-dark shadow shadow-sm rounded-3">
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="fs-1 text-warning"
                />
                <div className="text-center">
                  <p>訂單總價</p>
                  <div className="d-flex">
                    <Counter from={0} to={totalPrices} duration={1.5} />
                    <span className="ms-1 align-self-center">元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8 p-3">
              <LineChart />
            </div>
            <div className="col-12 col-md-4 p-3">
              <PieChart />
            </div>
          </div>
        </section>
      </div>
      <button className="btn btn-success mt-3" onClick={exportToPDF}>
        導出為PDF
      </button>
    </Transition>
  );
};

//如何把此頁的報表 匯出到pdf檔案 或是excel檔案
//使用 html2canvas 將頁面轉成圖片，再使用 jsPDF 將圖片轉成 pdf 檔案
//使用 react-html-table-to-excel 將表格轉成 excel 檔案

export default Home;
