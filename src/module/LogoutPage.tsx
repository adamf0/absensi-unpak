import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        navigate('/login')
    }, []);
    
    return <></>;
}
export default LogoutPage;