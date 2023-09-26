import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState,useEffect,useMemo } from 'react';
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Transition from '../components/Transition';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Swal from 'sweetalert2';
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

const Products = () => {
  // 顯示商品資料 用空陣列接json
  const [products, setProducts] = useState([]);
  // 編輯商品資料
  const [editedProducts, setEditedProducts] = useState(null);
  // 排序的狀態
  const [sorting, setSorting] = useState([]);
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
              // console.log(response.data);
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
              // console.log(response.data);
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
          // console.log(response.data);
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
  
  // useMemo的第二個參數，如果放空陣列，則表示回傳值不改變
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => products,[products]);

  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
  {
    header:'ID',
    accessorKey:'_id',
  },
  {
    header:'名稱',
    accessorKey:'name',
  },
  {
    header:'slug',
    accessorKey:'slug',
  },
  {
    header:'種類',
    accessorKey:'category',
  },
  {
    header:'照片',
    accessorKey:'image',
    cell: (cell) => <img src={`http://localhost:8000${cell.row.original.image}`} alt="Product" style={{ width: '50px' }} />,
  },
  {
    header:'價格',
    accessorKey:'price',
  },
  {
    header:'庫存',
    accessorKey:'countInStock',
  },
  {
    header:'瀏覽數',
    accessorKey:'numReviews',
  },
  {
    header:'評分',
    accessorKey:'rating',
  },
  {
    header: '上下架',
    accessorKey: 'onSale',
    // 自訂渲染按鈕
    cell: (cell) => (
      <button 
        type="button" 
        // className="btn btn-primary" 
        className={cell.row.original.onSale ? "btn btn-primary" : "btn btn-info"}
        data-bs-toggle="modal" 
        data-bs-target="#onSale"
        onClick={() => handleOnSaleClick(cell.row.original)}
      >
        {cell.row.original.onSale ? "下架" : "上架"}
      </button>
    ),
    canSort: false,
  },
  {
    header: '編輯',
    accessorKey: 'edit',
    // 自訂渲染按鈕
    cell: (cell) => (
      <button 
        type="button" 
        className="btn btn-success" 
        data-bs-toggle="modal" 
        data-bs-target="#edit"
        onClick={() => handleEditClick(cell.row.original)}
      >
        編輯
      </button>
    ),
    canSort: false,
  },
  {
    header: '刪除',
    accessorKey: 'delete',
    // 自訂渲染按鈕
    cell: (cell) => (
      <button 
        className="btn btn-danger" 
        data-bs-toggle="modal" 
        data-bs-target="#delete"
        onClick={() => handleDeleteClick(cell.row.original)}
      >
        刪除
      </button>
    ),
    canSort: false,
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
          <title>產品</title>
      </Helmet>
      <div className='container text-center px-4 border rounded-3 bg-white mt-3'>
        {/* <div className='d-flex justify-content-end list-unstyled'> */}
        <div className="d-flex justify-content-end">
          <Link to="/products/new" className="new btn btn-warning my-2">新增商品</Link>
          <div className='pagination btn-group w-25 my-2 ms-2'>
            <button onClick={()=> table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className='btn btn-secondary'>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button onClick={()=> table.previousPage()} disabled={!table.getCanPreviousPage()} className='btn btn-secondary'>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button onClick={()=> table.nextPage()} disabled={!table.getCanNextPage()} className='btn btn-secondary'>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button onClick={()=> table.setPageIndex(table.getPageCount()-1)} disabled={!table.getCanNextPage()} className='btn btn-secondary'>
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
                  <td key={cell.id} className={cell.row.original.countInStock >= 10
                    ? "align-middle"
                    : "align-middle table-danger"}>
                    {flexRender(cell.column.columnDef.cell,
                      cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
                                  <p className='d-flex'>ID： {editedProducts._id}</p>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="name">名稱：</label>
                                      <input type="text" id="name" name="name" className='form-control w-75' required value={editedProducts.name} onChange={handleInputChange} />
                                  </li>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="slug">slug：</label>
                                      <input type="text" id="slug" name="slug" className='form-control w-75' required value={editedProducts.slug} onChange={handleInputChange} />
                                  </li>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="category">種類：</label>
                                      <input type="text" id="category" name="category" className='form-control w-75' required value={editedProducts.category} onChange={handleInputChange} />
                                  </li>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="price">價格：</label>
                                      <input type="text" id="price" name="price" className='form-control w-75' required value={editedProducts.price} onChange={handleInputChange} />
                                  </li>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="countInStock">庫存：</label>
                                      <input type="text" id="countInStock" name="countInStock" className='form-control w-75' required value={editedProducts.countInStock} onChange={handleInputChange} />
                                  </li>
                                  <li className="d-flex justify-content-between">
                                      <label htmlFor="description">描述：</label>
                                      <textarea type="text" id="description" name="description" className='form-control w-75' required value={editedProducts.description} onChange={handleInputChange} />
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
      </div>
    </Transition>
  )
}

export default Products;
