import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BlockAfterAuthenticateRoutes = (props:any) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('authData')!=null) {
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