import { useState } from "react"
import { useNavigate } from "react-router-dom";
import ConfirmPassword from "./ConfirmPassword";

export default function ForgetPassword(){
    const navigate = useNavigate();
    const [link,setLink] = useState("");
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
        fetch("http://localhost:8080/api/password-reset",{
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
            if(data.message !== "link sent"){
                setMessage({type:"error",text:data.message})
            }else{
                setMessage({type:"success",text:"Password reset link sent to your email"})
                setLink(data.link);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return(
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Bhai Password bhul gya 😱</h1>
                <input type="email" className="inp"
                placeholder="Email" onChange={handleChange}  required/>
                <button className="btn">Send Email</button>
                <p className={message.type}>{message.text}</p>
            </form>
            <div>
            {link && <ConfirmPassword link={link} />}
            </div>
        </section>
    )
}