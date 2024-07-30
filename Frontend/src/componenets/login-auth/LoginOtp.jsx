import { useState } from "react"
import { useNavigate } from "react-router-dom";
import ConfirmOtp from "./ConfirmOtp"; 

export default function LoginOtp(){
    const navigate = useNavigate();
    const [otp,sentOtp] = useState(false);
    const [userID,setUserID] = useState("");
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState({
        type :"",
        text : ""
    })


    function handleChange(e){
        setEmail(e.target.value);
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch("http://localhost:8080/login-otp",{
            method : "POST",
            body : JSON.stringify({email}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then((response)=> {
           return response.json();
        })
        .then((data)=>{
            if(!data.success){
                setMessage({type:"error",text:data.message})
            }else{
                setMessage({type:"success",text:`${data.msg}`})
                sentOtp(true);
                setUserID(data.user_id);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return(
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1> OTP - Login</h1>
                <input type="email" className="inp"
                placeholder="Email" onChange={handleChange}  required/>
                <button className="btn">Send Email</button>
                <p className={message.type}>{message.text}</p>
            </form>
            <div>
            {otp && <ConfirmOtp userID = {userID}/>}
            </div>
        </section>
    )
}