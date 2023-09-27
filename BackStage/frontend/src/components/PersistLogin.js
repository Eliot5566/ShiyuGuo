import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <div className="d-flex justify-content-around p-4 align-items-center min-vh-100"><p>正在加載中...</p></div>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin