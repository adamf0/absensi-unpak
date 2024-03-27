import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authselector } from '../redux/authSlice';
import { useAppSelector } from '../redux/hooks';

const AuthenticateRoutes = (props:any) => {
    const navigate = useNavigate();
    const selectorAuth = useAppSelector(authselector);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const checkUserToken = () => {
        if (selectorAuth.nidn==null) {
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