import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate,Link } from "react-router-dom";
export default function Header()
{

    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    function logout()
    {
        localStorage.removeItem("token");
        loggedData.setLoggedUser(null);
        navigate("/login");

    }

    return (
        <div>

                <ul>
                    <Link to="/track"><li>Track</li></Link>
                    <Link to="/diet"><li>Diet</li></Link>
                    <li onClick={logout}>Logout</li>
                </ul>


        </div>
    )
}