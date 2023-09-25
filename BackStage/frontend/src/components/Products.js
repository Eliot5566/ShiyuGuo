import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Transition from '../Transition';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';


function Products() {
    // 顯示商品資料 用空陣列接json
    const [products, setProducts] = useState([]);
    // 編輯商品資料
    const [editedProducts, setEditedProducts] = useState(null);
    // 翻頁功能
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    // ???
    const axiosPrivate = useAxiosPrivate();


    // 在第一次渲染時抓產品資料
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axiosPrivate.post("/products",
                    JSON.stringify({ }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                        signal: controller.signal
                    }
                );
                // console.log(response.data);
                isMounted && setProducts(response.data);
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

    // 按下編輯按鈕後，把products的資料送到modal
    // 這裡的products是tbody裡面那個currentProducts陣列的products
    const handleEditClick = (products) => {
        setEditedProducts({ ...products });
    };
    // 處理編輯框modal的value
    const handleInputChange = (e) => {
        // name是要編輯的欄位名稱，value是該欄位的值
        const { name, value } = e.target;
        setEditedProducts((prevProducts) => ({
            // 使用展開運算符創建 prevProducts 的一個淺層複本，以確保不會直接修改原始狀態。
            ...prevProducts,
            [name]: value,
        }));
    };
    // 按下編輯的modal的確認按鈕
    const handleConfirmEdit = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.put("/products",
                JSON.stringify({ editedProducts }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
                console.log(response.data);
                // 更改成功 直接更改products的資料
                setProducts((prevProducts) =>
                    prevProducts.map((products) =>
                        products._id === editedProducts._id ? editedProducts : products
                    )
                );
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: '編輯成功！',
                    showConfirmButton: false,
                    timer: 1000,
                    allowOutsideClick:false
                })
        } catch (err) {
            console.log(err);
        }
    }
    //

    // 按下上下架按鈕後，把products的資料送到modal
    // 這裡的products是tbody裡面那個currentProducts陣列的products
    const handleOnSaleClick = (products) => {
        setEditedProducts({ ...products });
    };

    // 按下(上下架)的modal的確認按鈕
    const handleConfirmOnSale = async(e) =>{
        e.preventDefault();
        try {
            editedProducts.onSale = !editedProducts.onSale;
            const response = await axios.put("/products/onSale",
                JSON.stringify({ editedProducts }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
                console.log(response.data);
                // 更改成功 直接更改products的資料
                setProducts((prevProducts) =>
                    prevProducts.map((products) =>
                        products._id === editedProducts._id ? editedProducts : products
                    )
                );
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: '編輯成功！',
                    showConfirmButton: false,
                    timer: 1000,
                    allowOutsideClick:false
                })
        } catch (err) {
            console.log(err);
        }
    }

    // 按下刪除按鈕後，把products的資料送到modal
    // 這裡的products是tbody裡面那個currentProducts陣列的products
    const handleDeleteClick = (products) => {
        setEditedProducts({ ...products });
    };

        // 按下刪除的modal的確認按鈕
        const handleConfirmDelete = async(e) =>{
            e.preventDefault();
            try {
                const response = await axios.delete("/products",
                // delete的資料傳送形式要跟其他的不一樣
                {
                    data:JSON.stringify({ editedProducts }),
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                console.log(response.data);
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: '刪除成功！',
                    showConfirmButton: false,
                    timer: 1500,
                    allowOutsideClick:false
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (err) {
                console.log(err);
            }
        }


    // 紀錄頁數
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Transition>
            <Helmet>
                <title>產品</title>
            </Helmet>
            <div className="container text-center px-4 border rounded-3 bg-white mt-3">
                <div className="d-flex justify-content-end">
                    {/* <button className="btn btn-primary my-2">新增商品</button> */}
                    <Link to="new" className="btn btn-primary my-2">新增商品</Link>
                    <div className="pagination btn-group w-25 my-2 ms-2">
                        {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)} className="btn btn-warning">
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row">
                    <table className="col table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>名稱</th>
                                <th>slug</th>
                                <th>種類</th>
                                <th>照片</th>
                                <th>價格</th>
                                <th>庫存</th>
                                <th>瀏覽數</th>
                                <th>rating</th>
                                <th>上下架</th>
                                <th>編輯</th>
                                <th>刪除</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((products, index) => (
                            // {products.map((products, index) => (
                                <tr key={index}  
                                    className={products.countInStock > 20
                                        ? "align-middle"
                                        : "align-middle table-danger"
                                    }
                                >
                                    <td>{products._id}</td>
                                    <td>{products.name}</td>
                                    <td>{products.slug}</td>
                                    <td>{products.category}</td>
                                    <td>
                                        <img src={`http://localhost:8000${products.image}`} alt={products.name} style={{ maxWidth: '50px' }} />
                                    </td>
                                    <td>{products.price}</td>
                                    <td>{products.countInStock}</td>
                                    <td>{products.numReviews}</td>
                                    <td>{products.rating}</td>
                                    <td>
                                        <button 
                                        type="button" 
                                        // className="btn btn-primary" 
                                        className={products.onSale ? "btn btn-primary" : "btn btn-info"}
                                        data-bs-toggle="modal" 
                                        data-bs-target="#onSale"
                                        onClick={() => handleOnSaleClick(products)}
                                        >
                                            {products.onSale ? "下架" : "上架"}
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                        type="button" 
                                        className="btn btn-success" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#edit"
                                        onClick={() => handleEditClick(products)}
                                        >
                                            編輯
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#delete"
                                        onClick={() => handleDeleteClick(products)}
                                        >
                                            刪除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/*  下面開始是編輯的modal */}
            <>
            <div className="modal fade" id="edit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editLabel">編輯產品資料</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* Display the selected products's data in the modal */}
                        {editedProducts && (
                            <form 
                                className="form-control d-flex flex-column justify-content-center w-modal mx-auto list-unstyled gap-2"
                                id="editProducts"
                            >
                                <p>ID： {editedProducts._id}</p>
                                <li className="d-flex justify-content-between">
                                    <label htmlFor="name">名稱：</label>
                                    <input type="text" id="name" name="name" required value={editedProducts.name} onChange={handleInputChange} />
                                </li>
                                <li className="d-flex justify-content-between">
                                    <label htmlFor="slug">slug：</label>
                                    <input type="text" id="slug" name="slug" required value={editedProducts.slug} onChange={handleInputChange} />
                                </li>
                                <li className="d-flex justify-content-between">
                                    <label htmlFor="category">種類：</label>
                                    <input type="text" id="category" name="category" required value={editedProducts.category} onChange={handleInputChange} />
                                </li>
                                <li className="d-flex justify-content-between">
                                    <label htmlFor="price">價格：</label>
                                    <input type="text" id="price" name="price" required value={editedProducts.price} onChange={handleInputChange} />
                                </li>
                                <li className="d-flex justify-content-between">
                                    <label htmlFor="countInStock">庫存：</label>
                                    <input type="text" id="countInStock" name="countInStock" required value={editedProducts.countInStock} onChange={handleInputChange} />
                                </li>
                            </form>
                        )}
                    </div>
                    <div className="modal-footer">
                        <input type="submit" value="確認" className="btn btn-success" form="editProducts" data-bs-dismiss="modal" onClick={handleConfirmEdit}/>
                        <button type="button"  className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </div>
                    </div>
                </div>
            </div>
            </>
            {/*  下面開始是上下架的modal */}
            <>
            <div className="modal fade" id="onSale" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="onSaleLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="onSaleLabel">上下架商品</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {editedProducts && (
                            <>
                                <p>ID： {editedProducts._id}</p>
                                <p>名稱： {editedProducts.name}</p>
                                <p>當前銷售狀況： {editedProducts.onSale ? "正在銷售" : "下架中"}</p>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <input type="submit" value="確認" className="btn btn-success" data-bs-dismiss="modal" onClick={handleConfirmOnSale}/>
                        <button type="button"  className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </div>
                    </div>
                </div>
            </div>
            </>
            {/*  下面開始是刪除的modal */}
            <>
            <div className="modal fade" id="delete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="deleteLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteLabel">上下架商品</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {editedProducts && (
                        <div className="modal-body d-flex flex-column justify-content-center w-modal mx-auto list-unstyled gap-2 border-0">
                            <p>ID： {editedProducts._id}</p>
                            <p>名稱： {editedProducts.name}</p>
                            <p>slug： {editedProducts.slug}</p>
                            <p>種類： {editedProducts.category}</p>
                            <p>價格： {editedProducts.price}</p>
                            <p>庫存： {editedProducts.countInStock}</p>
                            <p>當前銷售狀況： {editedProducts.onSale ? "正在銷售" : "下架中"}</p>
                            <p className="text-danger text-center bg-light">確認刪除？</p>
                        </div>
                    )}
                    <div className="modal-footer">
                        <input type="submit" value="確認" className="btn btn-success" data-bs-dismiss="modal" onClick={handleConfirmDelete}/>
                        <button type="button"  className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </div>
                    </div>
                </div>
            </div>
            </>
            
        </Transition>
    )
}

export default Products