import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Transition from '../components/Transition';
import { Helmet } from 'react-helmet-async';
import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
    // 登入狀態
    const { setAuth, persist, setPersist } = useAuth();
    // 跳轉到登入前的頁面 如果沒有 就跳轉到根路由
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    // 輸入的資料
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    // 錯誤訊息
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ email, roles, accessToken });
            setEmail('');
            setPwd('');
            navigate(from, {replace:true});
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsg('伺服器沒有回應');
            } else if (err.response?.status === 400) {
                setErrMsg('信箱或密碼不正確');
            } else if (err.response?.status === 401) {
                setErrMsg('無此信箱或密碼');
            } else {
                setErrMsg('登入失敗');
            }
        }
    }
    // 「信任此裝置」的按鈕
    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        // 把persist(第二個參數)儲存到名為persist(第一個參數)的本地儲存中
        // 第二個參數就是第11行的persist
        localStorage.setItem("persist", persist);
    }, [persist])

    return (
        <Transition>
            <Helmet>
                <title>登入</title>
            </Helmet>
            <section className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-5 p-3 bg-white shadow box-area">
                    <div className="left-box col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <p className="text-white fs-2 bg-dark bg-opacity-50 shadow rounded p-1 courier mb-2">拾月菓</p>
                        <small className="join text-white text-wrap text-center  bg-dark bg-opacity-50 shadow rounded fs-5">每一口，都是和菓子的味道</small>
                    </div>
                    <div className="col-md-6 right-box">
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>你好！</h2>
                                <p>歡迎回來！</p>
                            </div>
                            <form onSubmit={handleSubmit} className='mt-1'>
                                <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
                                <label htmlFor="email" className='form-label'>電子信箱:</label>
                                <input
                                    className='form-control form-control-lg bg-light fs-6'
                                    type="text"
                                    id="email"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />

                                <label htmlFor="pwd" className='form-label mt-1'>密碼:</label>
                                <input
                                    className='form-control form-control-lg bg-light fs-6'
                                    type="password"
                                    id="pwd"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                                <div className='d-flex justify-content-between my-1'>
                                    <Link to="/forgetPWD">忘記密碼？</Link>
                                    <span className='persistCheck'>
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            id="persist"
                                            onChange={togglePersist}
                                            checked={persist}
                                            />
                                        <label htmlFor="persist" className='form-check-label text-secondary'>信任這個裝置</label>
                                    </span>
                                </div>
                                <button className="btn btn-primary w-100 fs-5">登入</button>
                            </form>
                            <div className="mt-2">
                                <p>尚未創建帳戶？</p>
                                <Link to="/register">註冊</Link><br/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <div className='d-flex justify-content-center align-items-center'>
                <div className='test bg-light'>123</div>
            </div> */}
        </Transition>
    )
}

export default Login
