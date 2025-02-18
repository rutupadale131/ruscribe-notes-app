import { BiError } from "react-icons/bi";

import "./index.css"

const FailureView=()=>{
    return(
        <div className="failure-container">
        <BiError className="error-icon" size={120} color="#ffffff"/>
        <p className="failure-text">Oops! Something went wrong. <br/>Please refresh or try again later.</p>
    </div>
    )
}

export default FailureView;