import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {UserContext} from "../../context/UserContext"
export default function Login (){
    const loggedInData = useContext(UserContext);

    const [loginDetails,setLoginDetails] = useState({
        email : "",
        password : ""
    })

    const [message,setMessage] = useState({
        type : "",
        text : ""
    })
    const change = ()=>{
        if(message.type === "success"){
            navigate("/track")
        }
    }
    const handleChange = (e)=>{
        setLoginDetails({
            ...loginDetails,
            [e.target.name] : e.target.value
        })
     }
     const navigate = useNavigate();
     const handleSubmit = (e)=>{
        e.preventDefault()
        fetch("http://localhost:8080/login",{
            method : "POST",
            body : JSON.stringify(loginDetails),
            headers : {
                "Content-Type" : "application/json"
            },
        }).then((response)=>{
            if(response.status === 500){
                setMessage({type:"error",text:"Incorrect password"})
            }else{
                setMessage({type:"error",text:"Username or Email Doesnt Exist"});
            }
            setTimeout(()=>{
                setMessage({type:"invisible-msg",text:"Dummy Msg"})
            },5000)
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            if(data.token!==undefined){
                localStorage.setItem("token",JSON.stringify(data))
                loggedInData.setLoggedUser(data);
                navigate("/track")
            }
        })
        .catch((err)=>{
            console.log(err);
        })
        change()
     }
    return(
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Login to fitness</h1>

                <input type="text" className="inp" name="email"
                placeholder="Enter Email" onChange={handleChange} />

                <input type="text" className="inp" name="password"
                placeholder="Enter password" onChange={handleChange} />
                
                <button className="btn">Login</button>
                <p><Link to= "/register">Create Account</Link></p>
                <p><Link to= "/forgetpassword">Forget Password</Link></p>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    )
}