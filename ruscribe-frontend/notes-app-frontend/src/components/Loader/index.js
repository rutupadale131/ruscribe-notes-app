import {PuffLoader} from "react-spinners"

import "./index.css"

const Loader=()=>{
    return(<div className="loader-container">
        <PuffLoader color="#36d7b7" size={60}/>
        </div>)
}

export default Loader;