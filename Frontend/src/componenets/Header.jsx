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

                {/* <ul>
                    <Link to="/track"><li>Track</li></Link>
                    <Link to="/diet"><li>Diet</li></Link>
                    <li onClick={logout}>Logout</li>
                </ul> */}

                <ul className="button-list">
  <li><Link to="/track"><button className="btn">Track</button></Link></li>
  <li><Link to="/diet"><button className="btn">Diet</button></Link></li>
  <li className="logout"><button className="btn" onClick={logout}>Logout</button></li>
</ul>


        </div>
    )
}