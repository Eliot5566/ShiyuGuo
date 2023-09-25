import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Transition from '../components/Transition';
import { Helmet } from 'react-helmet-async';


const Users = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    // controller.signal這個信號通常用於中止請求，
                    // 以確保在組件卸載或不再需要請求的情況下能夠停止請求的進行。
                    signal: controller.signal
                });
                // console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Transition>
        <Helmet>
            <title>管理員</title>
        </Helmet>
        <div className="container">
            <article>
                <div className="px-4 border rounded-3 bg-white mt-3">
                <h2>管理員列表</h2>
                <div className="row">
                    <table className="col table table-striped table-hover text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>暱稱</th>
                                <th>電子信箱</th>
                                <th>電話</th>
                                <th>權限</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="align-middle">{user.id}</td>
                                    <td className="align-middle">{user.name}</td>
                                    <td className="align-middle">{user.email}</td>
                                    <td className="align-middle">{user.phone}</td>
                                    <td className="align-middle">{user.roles ? "管理員" : "員工"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </article>
        </div>
        </Transition>
    );
};

export default Users;
