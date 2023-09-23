import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        // 請求攔截器，檢查請求的 headers，如果缺少授權標頭（Authorization），
        // 則添加授權標頭，使用 auth.accessToken 作為授權令牌。
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );
        // 回應攔截器，它用於處理當 API 回應返回 403 錯誤（未授權）時的情況。
        // 如果出現這種情況，它會嘗試使用 refresh 函數來獲取新的訪問令牌，然後更新請求的授權標頭並重新發送請求。
        // 這邊的API回應403，是指verifyJWT檔案的第20行所回傳的403
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])
    
    // 回傳 axiosPrivate，這使得其他組件可以使用此 Hook 來發送需要授權的請求
    return axiosPrivate;
}

export default useAxiosPrivate;