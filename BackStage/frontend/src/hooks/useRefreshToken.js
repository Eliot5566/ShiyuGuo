import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        // 當刷新請求成功返回時使用 setAuth 將回傳的 accessToken 的值（新的訪問令牌）
        // 「更新」到身份驗證狀態中，
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);
            return { 
                ...prev,
                roles: response.data.roles,
                accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
