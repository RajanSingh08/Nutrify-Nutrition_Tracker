import { Link } from "react-router-dom";

export default function NotFound(){
    return(
        <section className="container">
        <div className="not-found">
            <h1>Page Does Not Exists</h1>
            <p><Link to="/register">typo?</Link> Go to main page</p>
        </div>
        </section>
    )
}