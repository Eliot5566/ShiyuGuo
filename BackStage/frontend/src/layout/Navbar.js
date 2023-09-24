import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import useLogout from "../hooks/useLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.js';

function Navbar({Toggle}) {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex">
            <div className="container-fluid">
                <span to="/" className="navbar-brand d-none d-md-block" >儀錶板</span>
                <span to="/" className="navbar-brand d-block d-md-none" onClick={Toggle} >
                    <FontAwesomeIcon icon={faBars} />
                </span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item border rounded">
                            <Link to="/products" className="nav-link text-white" aria-current="page"> <i className='bi bi-search'></i>產品</Link>
                        </li>
                        <li className="nav-item mx-2 border rounded">
                            <Link to="/member" className="nav-link text-white" aria-current="page">會員</Link>
                        </li>
                        <li className="nav-item border rounded">
                            <button className="nav-link text-white" aria-current="page" onClick={signOut}>登出</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar