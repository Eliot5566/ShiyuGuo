import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Transition from '../Transition';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Swal from 'sweetalert2';



const Member = () => {
    // 顯示會員資料 用空陣列接json
    const [members, setMembers] = useState([]);
    // 編輯會員資料
    const [editedMember, setEditedMember] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    // 在第一次渲染時抓會員資料
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axiosPrivate.post("/member",
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                        signal: controller.signal
                    }
                );
                // console.log(response.data);
                isMounted && setMembers(response.data);
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

    // 按下編輯按鈕後，把member的資料送到modal
    // 這裡的member是tbody裡面那個members陣列的member
    const handleEdit = (member) => {
        setEditedMember({ ...member });
    };

    // 處理編輯框modal的value
    const handleInput = (e) => {
        // name是要編輯的欄位名稱，value是該欄位的值
        const { name, value } = e.target;
        setEditedMember((prevMember) => ({
            // 使用展開運算符創建 prevMember 的一個淺層複本，以確保不會直接修改原始狀態。
            ...prevMember,
            [name]: value,
        }));
    };

    // 按下編輯的modal的確認按鈕
    const handleConfirmEdit = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.put("/member",
                JSON.stringify({ editedMember }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
                console.log(response.data);
                // 更改成功 直接更改members的資料
                setMembers((prevMember) =>
                    prevMember.map((member) =>
                        member._id === editedMember._id ? editedMember : member
                    )
                );
        } catch (err) {
            console.log(err);
        }
    }

    // 按下刪除按鈕後，把member的資料送到modal
    // 這裡的member是tbody裡面那個members陣列的member
    const handleDelete = (member) => {
        setEditedMember({ ...member });
    };

    // 按下刪除的modal的確認按鈕
    const handleConfirmDelete  = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.delete("/member",
                // delete的資料傳送形式要跟其他的不一樣
                {
                    data:JSON.stringify({ editedMember }),
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


    return (
        <Transition>
            <div className="container text-center px-4 border rounded-3 bg-white mt-3">
                <div className="row">
                    <table className="col table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>暱稱</th>
                                <th>電子信箱</th>
                                <th>權限</th>
                                <th>訂單</th>
                                <th>編輯</th>
                                <th>刪除</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => (
                                <tr className="align-middle" key={index}>
                                    <td>{member._id}</td>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.roles}</td>
                                    <td> <Link className="btn btn-warning" to={`/orders/${member._id}`}>訂單</Link></td>
                                    <td>
                                        <button 
                                        type="button" 
                                        className="btn btn-success" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#editModal"
                                        onClick={() => handleEdit(member)}
                                        >
                                            編輯
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#deleteModal"
                                        onClick={() => handleDelete(member)}
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
            <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">編輯會員資料</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {editedMember && (
                                <form 
                                    className="form-control d-flex flex-column justify-content-center w-modal mx-auto list-unstyled gap-2 border-0"
                                    id="editMember"
                                >
                                    <p>ID： {editedMember._id}</p>
                                    <p>電子信箱： {editedMember.email}</p>
                                    <li className="d-flex justify-content-between">
                                        <label htmlFor="name">暱稱：</label>
                                        <input type="text" id="name" name="name" required value={editedMember.name} onChange={handleInput} />
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <label htmlFor="roles">權限：</label>
                                        <input type="text" id="roles" name="roles" required value={editedMember.roles} onChange={handleInput} />
                                    </li>
                                </form>
                            )}
                        </div>
                        <div className="modal-footer">
                            <input type="submit" value="確認" className="btn btn-success" form="editMember" data-bs-dismiss="modal" onClick={handleConfirmEdit}/>
                            <button type="button"  className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
            {/*  下面開始是刪除的modal */}
            <>
            <div className="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">刪除會員資料</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {editedMember && (
                        <div className="modal-body d-flex flex-column justify-content-center w-modal mx-auto list-unstyled gap-2 border-0">
                            <p><span>ID：</span>{editedMember._id}</p>
                            <p><span>電子信箱：</span>{editedMember.email}</p>
                            <p><span>暱稱：</span>{editedMember.name}</p>
                            <p><span>權限：</span>{editedMember.roles}</p>
                            <p className="text-danger text-center bg-light">確認刪除？</p>
                        </div>
                    )}
                    <div className="modal-footer">
                        <button type="button"  className="btn btn-danger" data-bs-dismiss="modal" onClick={handleConfirmDelete}>確認</button>
                        <button type="button"  className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </div>
                    </div>
                </div>
            </div>
            </>
        </Transition>
    )
}

export default Member