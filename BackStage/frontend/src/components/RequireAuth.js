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

// return (
//     // 檢查使用者是否具有在 allowedRoles 中指定的角色之一 (就是App.js裡的那個陣列)
//     auth?.roles?.find(role => allowedRoles?.includes(role))
//         ? <Outlet />    // 如果使用者具有允許的角色之一，則顯示Outlet。
//         : auth?.user    
//             ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//             : <Navigate to="/login" state={{ from: location }} replace />
//             // 如果使用者已經登錄但不具有所需的roles，則導向unauthorized。
//             // 如果使用者尚未登錄，則導向login，同時傳遞原始的路徑訊息（來自 location）以便登錄後可以返回。
// );

