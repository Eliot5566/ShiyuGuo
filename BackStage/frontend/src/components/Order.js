import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { useState,useEffect,useMemo } from 'react';
import { useParams,useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Transition from '../components/Transition';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp,
    faChevronDown,
    faAnglesLeft,
    faAnglesRight,
    faAngleLeft,
    faAngleRight  
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const Order = () =>{
    const [orders, setOrders] = useState([]);
    const [noOrders, setNoOrders] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const id = useParams()._id;

    // 排序的狀態
    const [sorting, setSorting] = useState([]);
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

    moment.updateLocale('tw', {
        /**/
        weekdays : [
            "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
        ]
    });
    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'long', // 顯示月份的全名
            day: 'numeric',
            weekday: 'long', // 顯示星期的全名
            hour: 'numeric',
            minute: 'numeric',
        };
        const formattedDate = moment(dateTimeString).format('YYYY年M月DD日 dddd HH:mm', options);
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


    // useMemo的第二個參數，如果放空陣列，則表示回傳值不改變
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = useMemo(() => orders,[orders]);

    /** @type import('@tanstack/react-table').ColumnDef<any> */
    const columns = [
    {
        header:'訂單',
        accessorKey:'id',
    },
    {
        header:'購買者ID',
        accessorKey:'user_id',
    },
    {
        header:'內容 目前以name取值',
        accessorKey:'order_items',
        cell:(cell) => renderProductNames(cell.row.original.order_items)
    },
    {
        header:'時間',
        accessorKey:'created_at',
        cell:(cell) => formatDateTime(cell.row.original.created_at)
    },
    {
        header:'是否付款',
        accessorKey:'is_paid',
        cell: (cell) => cell.row.original.is_paid ? "是" : "尚未付款",
    },
    {
        header:'付款方式',
        accessorKey:'payment_method',
    },
    {
        header:'Item價格',
        accessorKey:'items_price',
    },
    {
        header:'總金額',
        accessorKey:'total_price',
    },
    ];

    const table = useReactTable(
        {
            data,
            columns,
            getCoreRowModel : getCoreRowModel(),
            getPaginationRowModel : getPaginationRowModel(),
            getSortedRowModel : getSortedRowModel(),
            state:{
            sorting : sorting,
            },
            onSortingChange : setSorting,
        }
    ); 

    return (
        <Transition>
            <Helmet>
                <title>會員訂單</title>
            </Helmet>
            <div className="container text-center p-3 border rounded-3 bg-white mt-3">
            {noOrders ? ( // 如果沒有訂單，顯示此人未下訂單的訊息
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <p>這個會員尚未下單！</p>
                    <button className="btn btn-warning fs-6 my-2 me-2" onClick={goBack}>
                        回到上一頁
                    </button>
                </div>
            ) : (
                <>
                <div className="d-flex justify-content-end">
                    <div className='d-flex align-self-center ms-2'>
                        <div className="input-group ms-1">
                            <span className="input-group-text">第</span>
                            <input
                                type="number" 
                                min={1}
                                max={table.getPageCount()}
                                className="form-control text-center"
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                                }}
                            />
                            <span className="input-group-text">/</span>
                            <span className="input-group-text">{table.getPageCount()} 頁</span>
                        </div>
                        <div className="input-group ms-1">
                            <span className="input-group-text">顯示</span>
                            <select
                                className='form-select text-center'
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value))
                                }}
                            >
                                {[10, 20, 30, 40, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                    </option>
                                ))}
                            </select>
                            <span className="input-group-text">筆</span>
                        </div>
                    </div>
                    <button className="btn btn-warning fs-6 my-2 ms-2" onClick={goBack}>
                        回到上一頁
                    </button>
                    <div className="pagination btn-group w-25 my-2 ms-2">
                        <button
                            className="btn btn-secondary"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <FontAwesomeIcon icon={faAnglesRight} />
                        </button>
                    </div>
                </div>
                <table className='col table table-hover'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header =>(
                            <th key={header.id} onClick={header.column.getToggleSortingHandler()} className='border-5'>
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                                {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'desc' ? (
                                    <FontAwesomeIcon icon={faChevronDown} className='ms-1'/>
                                ) : (
                                    <FontAwesomeIcon icon={faChevronUp} className='ms-1'/>
                                )
                                ) : (
                                <></>
                                )}
                            </th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell =>(
                            <td key={cell.id} className="align-middle">
                                {flexRender(cell.column.columnDef.cell,
                                cell.getContext())}
                            </td>
                            ))}
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