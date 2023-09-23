import { createContext, useState } from "react";

// AuthContext是一個React前後文，用於共享全域的身份驗證狀態。它被建立為一個空物件{}的前後文初始值
const AuthContext = createContext({});

// AuthProvider 是一個前後文提供器，它接受一個名為 children 的 prop，
// 這個 children prop 是指要包裝在前後文中的 React 元件。
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    // 在 AuthProvider 內部，使用 <AuthContext.Provider> 包裝了 children。
    // 這意味著你可以在應用程式的其他部分使用 AuthContext 來訪問 auth 狀態以及一個 setAuth 函式，
    // 用於更新身份驗證相關的狀態。
    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;