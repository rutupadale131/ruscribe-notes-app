import { Component ,useEffect} from "react"
import Cookies from "js-cookie"
import NoteItem  from "../NoteItem"
import {motion} from "motion/react"
import {Link, Navigate,useNavigate,useLocation} from "react-router-dom"
import Swal from "sweetalert2"
import Loader from "../Loader"

import FailureView from "../FailureView"

import "./index.css"

const apiStatusConstants={
    initial:"INITIAL",
    loading:"LOADING",
    success:"SUCCESS",
    failure:"FAILURE"
}

class Dashboard extends Component{
    state={
        notesList:[],
        apiStatus:apiStatusConstants.initial,
        searchInput:"",
        hasSavedNotes:false,
    }

    onChangeSearch=(event)=>{
        this.setState({searchInput:event.target.value})
    }

    


    componentDidMount(){
        this.getNotesList()
    }
    
    getNotesList=async()=>{
        this.setState({apiStatus:apiStatusConstants.loading})
        const jwt=Cookies.get("jwt_token")
        console.log(jwt)
        
        
        const url=`https://notes-app-backend-production-55cf.up.railway.app/notes`
        const options = {
            method: "GET",
            headers: {
            Authorization: `Bearer ${jwt}`
            }
        }
        const response=await fetch(url,options)
        const data=await response.json()
        console.log(response)
        if(response.status===401){
            Cookies.remove("jwt_token")
            this.props.navigate("/login", { replace: true });
                return;
        }
        if(response.ok){
            let displayWelcomeView=true;
            if(data.length>0){
                displayWelcomeView=false
            }
        this.setState({
            notesList:[...data],
            apiStatus:apiStatusConstants.success,
            hasSavedNotes:displayWelcomeView
        })
        return;
        }else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }
}

   renderLoadingView=()=>{
     return <Loader/>
   }
   
   renderFailureView=()=>{
    return <FailureView/>

   }

   renderWelcomeView=()=>{
    return(
        <motion.div 
        className="welcome-bg"
        
        >
            <motion.div 
            className="welcome-container"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            >
            <motion.img 
            src='/images/welcome-view-illustration.png' 
            alt="Logo"
            className="welcome-img" 
            initial={{ opacity: 0, scale: 0.8, x:-20}}
            animate={{ opacity: 1, scale: 1 ,x:0}}
            transition={{ duration: 1, ease: "easeOut" }}
            />
            
            <motion.div 
            className="welcome-text-box"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1>Welcome to RuScribe</h1>
                <p>Smart note-taking made simple and seamless.</p>
                <Link to="/createnote">
                <motion.button 
                className="welcome-create-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                >
                    Create Your First Note
                </motion.button>
                </Link>
            </motion.div>
            </motion.div>
        </motion.div>
    )
   }

   renderSuccessView=()=>{
    const {notesList,searchInput}=this.state
        console.log("notesList:",notesList)

        const listVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3 }
            }
        };

        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        };

        const renderNotesList=notesList.filter((eachNote)=> (
            eachNote.title.toLowerCase().includes(searchInput.toLocaleLowerCase())
        )   
        )

        const sortedNotesList=renderNotesList.sort((a,b)=>
        a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase())
        );

        return (
            <div className="dashboard-container">
                <div className="search-bg">
            <input type="search" 
            className="search" 
            placeholder="Search notes"
            value={searchInput}
            onChange={this.onChangeSearch}
            
            />
            </div>
            {renderNotesList.length===0?
             (<div className="no-search-results"><p>No matching notes found.</p></div>):
             (<motion.ul 
                initial="hidden"
                animate="visible"
                variants={listVariants}
                className="notes-list"
            >
                {sortedNotesList.map(eachNote => (
                <motion.li 
                    key={eachNote.id} 
                    variants={itemVariants} 
                    style={{ listStyleType: "none" }}
                >
                    <NoteItem note={eachNote} />
                </motion.li>
                ))}
            </motion.ul>)    
        }
            
            
            <Link to="/createnote" >
                <button type="button" className="create-button">+</button>
            </Link>
            </div>
        )
    
   }

   renderDashboard=()=>{
    const {apiStatus}=this.state
    switch(apiStatus){
        case apiStatusConstants.loading:
            return this.renderLoadingView()
        case apiStatusConstants.success:
            return this.renderSuccessView()
        case apiStatusConstants.failure:
            return this.renderFailureView()
        default:
            return null
    }

   }
   
    render(){
        const jwt=Cookies.get("jwt_token")
        if(jwt===undefined){
            return <Navigate to="/login" replace={true}/>
        }
        const {hasSavedNotes}=this.state
        
        return(
            <>
                {hasSavedNotes?
                this.renderWelcomeView():
                this.renderDashboard()    
            }
            </>
        )
    }
}

function DashboardWrapper(){
    const navigate =useNavigate()
    const {state}=useLocation();
    const noteDeleted=state?.noteDeleted
    const username=state?.username
    const noteAdded=state?.noteAdded

    useEffect(() => {
        if (noteDeleted) {
            Swal.fire({
                icon: "success",
                title: "Note Deleted Successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
            
        }
        if(username!==undefined){
            Swal.fire(
                {
                    icon: "success",
                    title: "Logged In Successfully!",
                    text:`Welcome ${username}`,
                    timer: 2000,
                    showConfirmButton: false,  
                }
            )
        }
        if (noteAdded) {
            Swal.fire({
                icon: "success",
                title: "Note added successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
        }
        if (noteDeleted || username!==undefined||noteAdded) {
            setTimeout(() => {
                navigate(".", { replace: true, state: {} });
            }, 0);
        }
    }, [noteDeleted,username,noteAdded,navigate]);


    return <Dashboard navigate={navigate}/>
}

export default DashboardWrapper