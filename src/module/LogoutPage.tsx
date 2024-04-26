import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        localStorage.setItem("user","null")	
        localStorage.setItem("fyr_language","en")	
        localStorage.setItem("theme","light")
        localStorage.setItem("fyr_asideStatus","true")	
        localStorage.setItem("fyr_fontSize","14")
        localStorage.setItem("levelMode","")
        localStorage.setItem("userRef","")
        navigate('/login')
    }, []);
    
    return <></>;
}
export default LogoutPage;