import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    // 使用 useContext 來從 AuthContext 中獲取 auth 和 setAuth()
    const { auth } = useContext(AuthContext);
    
    // 使用 useDebugValue 來提供有關 auth 狀態的除錯資訊
    // 第一個參數是要提供除錯資訊的值。在這個情境下，它是你從前後文中取得的 auth 狀態。
    // 第二個參數是一個回呼函式，用於計算和提供除錯資訊。回呼函式接受 auth 作為參數，
    // 然後根據 auth?.email 的存在（也就是是否有使用者登錄）返回一個對應的字串。
    useDebugValue(auth, auth => auth?.email ? "Logged In" : "Logged Out")

    // 返回一個包含 auth 和 setAuth 的物件，這樣其他組件可以使用這個Hook來獲取和更新身份驗證相關的狀態。
    return useContext(AuthContext);
}

export default useAuth;