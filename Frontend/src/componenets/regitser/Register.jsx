import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        mobile: ""
    });

    const [message, setMessage] = useState({
        type: "invisible-msg",
        text: "Dummy Msg"
    });

    function handleInput(event) {
        setUserDetails((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/registration", {
                method: "POST",
                body: JSON.stringify(userDetails),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const data = await response.json();

            setMessage({ type: "success", text: data.message });

            setUserDetails({
                name: "",
                email: "",
                password: "",
                age: "",
                mobile: ""
            });

            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "Dummy Msg" });
            }, 5000);

        } catch (error) {
            console.log(error);
            setMessage({ type: "error", text: error.message });
        }
    }

    return (
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Start Your Fitness</h1>

                <input className="inp" type="text" required onChange={handleInput}
                    placeholder="Enter Name" name="name" value={userDetails.name} />

                <input className="inp" type="email" required onChange={handleInput}
                    placeholder="Enter Email" name="email" value={userDetails.email} />

                <input className="inp" type="password" required maxLength={8} onChange={handleInput}
                    placeholder="Enter Password" name="password" value={userDetails.password} />

                <input className="inp" max={100} min={12} type="number" onChange={handleInput}
                    placeholder="Enter Age" name="age" value={userDetails.age} />

                <input className="inp" type="text" required onChange={handleInput}
                    placeholder="Enter Mobile" name="mobile" value={userDetails.mobile} />

                <button className="btn">Register</button>

                <p>Already Registered? <Link to="/login">Login</Link> </p>

                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    );
}
