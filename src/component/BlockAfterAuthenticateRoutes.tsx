import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authselector } from '../redux/authSlice';
import { useAppSelector } from '../redux/hooks';

const BlockAfterAuthenticateRoutes = (props:any) => {
    const navigate = useNavigate();
    const selectorAuth = useAppSelector(authselector);
    
    useEffect(() => {
        if (selectorAuth.nidn!=null) {
            return navigate('/');
        }
    }, []);
    
    return (
        <>
            {props.children}
        </>
    );
}
export default BlockAfterAuthenticateRoutes;