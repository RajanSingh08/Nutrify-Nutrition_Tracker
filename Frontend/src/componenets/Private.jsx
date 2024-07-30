import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate } from "react-router-dom";
export default function Private(props) {
    const loggedIn = useContext(UserContext);
    return (
        loggedIn.loggedUser !== null ?
         <props.Component/> : 
         <Navigate to="/login"/>
    )
}