import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ConfirmPassword(prop){
    const Navigate = useNavigate();
    const [password,setPassword] = useState("");
    function handleChange(e){
        setPassword(e.target.value);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch(`${prop.link}`,{
            method : "POST",
            body : JSON.stringify({password}),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then((response)=> {
           return response.json();
        })
        .then((data)=>{
            if(data.message !== "password updated sucessfully"){
                alert(data.message)
            }else{
                alert("Password updated successfully")
                Navigate("/login")
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
                <input type="password" className="inp" onChange={handleChange} 
                placeholder="Password" required/>
                <button className="btn">Confirm</button>
            </form>
        </section>
    )
}