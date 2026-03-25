import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "@/Redux/Auth/AuthSlice";

const AuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (token) {
            localStorage.setItem("jwt", token);
            dispatch(getUser(token));
            navigate("/");
        } else {
            navigate("/signin");
        }
    }, [dispatch, location.search, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Logging you in...</p>
        </div>
    );
};

export default AuthCallback;
