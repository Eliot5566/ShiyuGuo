import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if(auth.roles >= allowedRoles){
        // 如果符合權限要求 則進入主頁
        return <Outlet />
    }else if(auth?.accessToken){
        // 不符合權限 轉到沒有權限的頁面
        return <Navigate to="/unauthorized" state={{ from: location }} replace />
    }else{
        // 尚未登入 轉到登入頁
        return <Navigate to="/login" state={{ from: location }} replace />
    }
}

export default RequireAuth;

