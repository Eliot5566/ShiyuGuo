import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const RESETPWD_URL = '/resetPWD/';

const ResetPWD = () => {
    const param = useParams();
    const {email, resetPWDToken} = param;

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
        setErrMsg('');
    }, [pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = PWD_REGEX.test(pwd);
        if (!v1) {
            setErrMsg("無效的輸入！");
            return;
        }
        try {
            const response = await axios.post(RESETPWD_URL,
                JSON.stringify({ email, pwd, resetPWDToken }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            setSuccess(true);
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('伺服器沒有回應');
            } else if (err.response?.status === 403) {
                setErrMsg('Token驗證失敗');
            } else {
                setErrMsg('密碼重置失敗')
            }
        }
    }

    return (
        // 下面這個<>是 <React.Fragment> 的語法糖
        <>  
            {success ? (
                <section className="container d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                        <h2>重置成功!</h2>
                        <Link className="btn btn-primary fs-5 mt-2" to="/">登入</Link>
                    </div>
                </section>
            ) : (
                <div className="container d-flex justify-content-center align-items-center vh-100 w-25">
                    <section>
                        <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
                        <h1>重置密碼</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="password" className="form-label">
                                新密碼:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                className="form-control"
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8至24個字元<br />
                                必須包含至少一個小寫字母、大寫字母、一個數字<br />
                                不允許特殊字符
                            </p>

                            <label htmlFor="confirmPwd" className="form-label">
                                確認新密碼:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                className="form-control"
                                type="password"
                                id="confirmPwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                密碼必須與一致
                            </p>
                            <button className="btn btn-primary fs-5 mt-2 w-100" disabled={ !validPwd || !validMatch ? true : false}>重置密碼</button>
                            <div className='d-flex justify-content-between'>
                                <Link to="/" className="btn btn-primary fs-5 mt-2">登入</Link> <br/>
                                <Link to="/" className="btn btn-primary fs-5 mt-2" replace>回到上一頁</Link>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default ResetPWD;
