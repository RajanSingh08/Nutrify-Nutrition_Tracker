import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
export default function Register (){
    const navigate = useNavigate()
    const [userDetails, setUserdetails] = useState({
        name :"",
        email : "",
        password : "",
        age : "",
        mobile : ""
    })

    const [message,setMessage] = useState({
        type : "",
        text : ""
    })
    const handleChange = (e)=>{
        setUserdetails({
            ...userDetails,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(userDetails)
        fetch("http://localhost:8080/registration",{
            method : "POST",
            body : JSON.stringify(userDetails),
            headers : {
                "Content-Type" : "application/json"
            },
        }).then((res)=>res.json())
        .then((data)=>{
            if(data.name === "ValidationError"){
                setMessage({
                    type : "error",
                    text : data.message
                })
            }else{
                setMessage({
                    type : "success",
                    text : data.message
                })
            }
            setUserdetails({
                name :"",
                email : "",
                password : "",
                age : "",
                mobile : ""
            })
            if(message.type === "success"){
                setTimeout( async()=>{
                    navigate("/login")
                },2000)
            }
        })
        .catch((err)=>{
            setMessage({
                type : "error",
                text : "Something went wrong"
            })
            console.log(err);
        })
    }
    return( 
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Start your fitness</h1>
                <input type="text" className="inp" required 
                placeholder="Enter Name" name="name" onChange={handleChange} />

                <input type="text" className="inp" required
                placeholder="Enter Email" name="email" onChange={handleChange}/>

                <input type="password" className="inp" required
                placeholder="Enter password" name="password" onChange={handleChange}/>

                <input type="number" className="inp" required
                placeholder="Enter age" name="age" onChange={handleChange}/>

                <input type="text" className="inp" required
                placeholder="Enter Mobile Number" name="mobile" onChange={handleChange}/>

                <button className="btn">Join</button>
                <p>Alreay Registerd ? <Link to = "/login">Login</Link></p>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    )
}