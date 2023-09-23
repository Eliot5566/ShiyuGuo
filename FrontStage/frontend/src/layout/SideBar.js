// import React from 'react'
// // import { useState } from 'react'
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleUser, faBook, faGauge } from '@fortawesome/free-solid-svg-icons';
// import { useLocation } from "react-router-dom";


// function SideBar() {
//     const location = useLocation();

//     return (
//         <div className='sidebar d-flex justify-content-between flex-column bg-dark text-white p-4 vh-100'>
//             <div>
//                 <Link to="/" className='p-3 text-white'>
//                     <i className='bi bi-code-slash'></i>
//                     <span className='fs-4'>拾月粿</span>
//                 </Link>
//                 <hr className='text-white mt-2'/>
//                 <ul className='nav nav-pills flex-column mt-3'>
//                     <li className={location.pathname ==='/' ? 'active nav-item p-1':'nav-item p-1'}>
//                         <Link to="/" className='p-1 text-white d-block'>
//                         <FontAwesomeIcon icon={faGauge} className='me-3 fs-5'/>
//                             <span className='fs-4'>儀錶板</span>
//                         </Link>
//                     </li>
//                     <li className={location.pathname ==='/member' ? 'active nav-item p-1':'nav-item p-1'} >
//                         <Link to="/member" className='p-1 text-white d-block'>
//                             <FontAwesomeIcon icon={faCircleUser} className='me-3 fs-5'/>
//                             <span className='fs-4'>會員</span>
//                         </Link>
//                     </li>
//                     <li className={location.pathname ==='/products' ? 'active nav-item p-1':'nav-item p-1'}>
//                         <Link to="/products" className='p-1 text-white d-block'>
//                             <FontAwesomeIcon icon={faBook} className='me-3 fs-5'/>
//                             <span className='fs-4'>產品</span>
//                         </Link>
//                     </li>
//                     <li className={location.pathname ==='/orders' ? 'active nav-item p-1':'nav-item p-1'}>
//                         <Link to="/orders" className='p-1 text-white d-block'>
//                             <FontAwesomeIcon icon={faBook} className='me-3 fs-5'/>
//                             <span className='fs-4'>訂單</span>
//                         </Link>
//                     </li>
//                 </ul>
//             </div>
//             <div>
//                 <hr className='text-white'/>
//                 <div className='nav-item p-2'>
//                     <Link to="/admin" className='p-1 text-white'>
//                         <i className='bi bi-person-circle me-3 fs-4'></i>
//                         <span className='fs-4'><strong>管理員</strong></span>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SideBar