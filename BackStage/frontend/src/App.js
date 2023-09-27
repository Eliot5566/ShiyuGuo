import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Member from './components/Member';
import Order from './components/Order';
import NewProduct from './components/NewProduct';
import ForgetPWD from './components/ForgetPWD';
import ResetPWD from './components/ResetPWD';
import Layout from './layout/Layout';

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Products from './components/Products';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes key={location.pathname} location={location}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgetPWD" element={<ForgetPWD />} />
        <Route path="resetPWD/:user/:resetPWDToken" element={<ResetPWD />} />
        
        <Route path="/" element={<Layout />}>
          {/* 無權限的路由 */}
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* 有權限的路由 - 會用RequireAuth包起來 */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="member" element={<Member />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="products" element={<Products />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="products/new" element={<NewProduct />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="/orders/:_id" element={<Order />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={1} />}>
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>
          {/* 只要是未匹配的路由，都會跑到這裡，對應server端檔案app.js第57行 */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;