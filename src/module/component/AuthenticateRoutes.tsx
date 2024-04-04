import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthenticateRoutes = (props:any) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const checkUserToken = () => {
        if (localStorage.getItem('authData')==null) {
            setIsLoggedIn(false);
            return navigate('/login');
        }
        setIsLoggedIn(true);
    }

    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);
    
    return (
        <>
            {isLoggedIn ? props.children : null}
        </>
    );
}
export default AuthenticateRoutes;