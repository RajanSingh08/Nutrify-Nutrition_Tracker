import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
export default function ConfirmOtp(prop){
    const loggedInData = useContext(UserContext);
    const [otp,setOtp] = useState("");
    const navigate = useNavigate();
    function handleChange(e){
        setOtp(e.target.value);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch("http://localhost:8080/verify-otp",{
            method : "POST",
            body : JSON.stringify({user_id : prop.userID,otp : otp}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then((response)=> {
           return response.json();
        })
        .then((data)=>{
            if(!data.success){
                alert(data.message)
            }else{
                localStorage.setItem("token",JSON.stringify(data))
                loggedInData.setLoggedUser(data);
                navigate("/track")
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    return(
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Confirm Password</h1>
                <input type="number" className="inp" onChange={handleChange} 
                placeholder="OTP" required/>
                <button className="btn">Confirm</button>
            </form>
        </section>
    )
}