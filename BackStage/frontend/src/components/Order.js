import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Transition from '../Transition';
import { Helmet } from 'react-helmet-async';


const Order = () => {
    const [orders, setOrders] = useState([]);
    const [noOrders, setNoOrders] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const id = useParams()._id;
    // 翻頁功能
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    // 上一頁按鈕
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1); // 使用 navigate(-1) 返回上一頁
    };

    // 在第一次渲染時抓訂單資料
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axiosPrivate.post("/order/:id",
                    JSON.stringify({ id }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                        signal: controller.signal
                    }
                );
                // console.log(response.data);
                // setOrders(response.data);
                if (response.data === 0) {
                    // 如果後端返回0，表示該用戶未下訂單
                    isMounted && setNoOrders(true);
                } else {
                    isMounted && setOrders(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const formattedDate = new Date(dateTimeString).toLocaleString('zh-TW', options);
        return formattedDate;
    };

    const renderProductNames = (orderItems) => {
        // 解析order.order_items的字串為JavaScript對象
        const orderItemsArray = JSON.parse(orderItems);
        // 創建一個空字串來存儲產品名稱
        let productNamesString = "";
        // 遍歷解析後的對象並獲取每個產品的名稱，並將它們合併為一個字串
        orderItemsArray.forEach(item => {
            if (item.name) {
                if (productNamesString !== "") {
                    // 如果字串不為空，則在名稱之間添加逗號和空格
                    productNamesString += ", ";
                }
                productNamesString += item.name;
            }
        });
        return productNamesString
    };

    // 紀錄頁數
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Transition>
            <Helmet>
                <title>會員訂單</title>
            </Helmet>
            <div className="container text-center p-3 border rounded-3 bg-white mt-3">
            {noOrders ? ( // 如果沒有訂單，顯示此人未下訂單的訊息
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <p>這個會員尚未下單！</p>
                    <button className="btn btn-primary fs-6 my-2 me-2" onClick={goBack}>
                        回到上一頁
                    </button>
                </div>
            ) : (
                <>
                <div className='d-flex justify-content-end'>
                    <button className="btn btn-primary fs-6 my-2 me-2" onClick={goBack}>
                        回到上一頁
                    </button>
                    <div className="pagination btn-group w-50 my-2">
                        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)} className="btn btn-warning">
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <table className="table table-striped table-hover bg-white rounded">
                    <thead>
                        <tr>
                            <th>訂單</th>
                            <th>購買者ID</th>
                            <th>內容 目前以name取值</th>
                            <th>時間</th>
                            <th>是否付款</th>
                            <th>付款方式</th>
                            <th>Item價格</th>
                            <th>總金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order, index) => (
                            <tr className="align-middle" key={index}>
                                <td>{order.id}</td>
                                <td>{order.user_id}</td>
                                <td>{renderProductNames(order.order_items)}</td>
                                <td>{formatDateTime(order.created_at)}</td>
                                <td>{order.is_paid === 0 ? "尚未付款" : "是"}</td>
                                <td>{order.payment_method}</td>
                                <td>{order.items_price}</td>
                                <td>{order.total_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
                )}
            </div>
        </Transition>
    )
}

export default Order
