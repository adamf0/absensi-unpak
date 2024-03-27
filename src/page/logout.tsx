import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from '../redux/authSlice';
import { useAppDispatch } from '../redux/hooks';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearAuth())
        navigate('/login')
    }, []);
    
    return <></>;
}
export default Logout;