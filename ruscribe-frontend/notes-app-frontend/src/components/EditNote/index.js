import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'motion/react';
import { useParams, useNavigate}  from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoArrowBack } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Loader from '../Loader';
import FailureView from '../FailureView';
import "./index.css"

const apiStatusConstants={
    initial:"INITIAL",
    loading:"LOADING",
    success:"SUCCESS",
    failure:"FAILURE"
}

class EditNote extends Component {
    state={
        note:"",
        title:"",
        errorMsg:"",
        apiStatus:apiStatusConstants.initial
    }
    
    componentDidMount() {
        this.getSavedNote();
        if (this.props.noteAdded) {
            Swal.fire({
                icon: "success",
                title: "Note added successfully!",
                timer:2000,
                showConfirmButton:false
            });
        }
    }

    getSavedNote=async()=>{
        this.setState({apiStatus:apiStatusConstants.loading})
        const jwt = Cookies.get("jwt_token"); 
        const {id}=this.props
        const url=`https://notes-app-backend-production-55cf.up.railway.app/notes/${id}`
        const options={
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${jwt}`
            }
        }
        const response=await fetch(url,options)
        const data=await response.json()
        console.log(data)
        if(response.status===401){
            Cookies.remove("jwt_token")
            this.props.navigate("/login", { replace: true });
                return;
        }
        if(response.ok){
            this.setState({note:data.content,
                title:data.title,
             apiStatus:apiStatusConstants.success
            })
            return;
        }else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }
    }

    handleChangeNote = (event) => {
        this.setState({ note: event.target.value });
    }

    handleChangeTitle = (event) => {
        this.setState({ title: event.target.value });
    }

    handleSubmit =async (event) => {
        event.preventDefault();
        this.setState({apiStatus:apiStatusConstants.loading})
        const jwt = Cookies.get("jwt_token"); 
        const {id}=this.props
        const url=`https://notes-app-backend-production-55cf.up.railway.app/notes/${id}`
        const options={
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${jwt}`
            },
            body:JSON.stringify({title:this.state.title,content:this.state.note})
        }
        const response=await fetch(url,options)
        const data=await response.json()
        if(response.ok){
            this.setState({apiStatus:apiStatusConstants.success,errorMsg:""})
            Swal.fire({
                icon: "success",
                title: "Changes saved successfully!",
                timer: 2000,
                showConfirmButton: false,
            });
            
            return;
        }
        if(response.status===400){
            const {message}=data
            this.setState({errorMsg:`*${message}`,apiStatus:apiStatusConstants.success})
            return;
        }
        console.log(data)
        this.setState({apiStatus:apiStatusConstants.success})
    }

    onDeleteNote=async()=>{
        const jwt = Cookies.get("jwt_token"); 
        if (!jwt) {
            this.props.navigate("/login", { replace: true });
            return;
        }
        const {id}=this.props
        const url=`https://notes-app-backend-production-55cf.up.railway.app/notes/${id}`
        const options = {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ title: this.state.title, content: this.state.note })
        };

         const result=await Swal.fire({
                    title: "Are you sure?",
                    text: "Note will be permanently deleted!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete note!",
                    cancelButtonText: "Cancel"
                })
        if (result.isConfirmed) {
                    const response=await fetch(url,options)
                    const data=await response.json()
                    console.log(data)
                    if(response.status===401){
                        Cookies.remove("jwt_token")
                        this.props.navigate("/login",{replace:true})
                        return;
                    }

                    if(response.ok){
                        this.props.navigate("/",{replace:true,state:{noteDeleted:true}})
                    }
                                }
                        

        
    }

    onClickBack=()=>{
        this.props.navigate("/",{replace:true})
    }

    renderLoadingView=()=>{
        return <Loader/>
      }
      
    renderFailureView=()=>{
       return <FailureView/>
   
      }

    renderSuccessView=()=>{
        const {note,title,errorMsg}=this.state
        
        return (
            <div className='editnote-bg'>
                <div className='button-group'>
                <motion.button 
                type="button" 
                onClick={this.onClickBack} 
                className='back-button-editnote'
                initial={{opacity:0,x:20}}
                animate={{opacity:1,x:0}}
                transition={{duration:1,ease:"easeOut"}}
                >
                    <IoArrowBack size={30}/>
                </motion.button>
                <motion.button 
                type='button' 
                onClick={this.onDeleteNote} 
                className='delete-button'
                initial={{opacity:0,x:-20}}
                animate={{opacity:1,x:0}}
                transition={{duration:1,ease:"easeOut"}}
                >
                    <MdDelete size={24}/>
                    </motion.button>
                </div>
            
            <motion.form 
            onSubmit={this.handleSubmit} 
            className='form-group'
            initial={{opacity:0,y:30}}
            animate={{opacity:1,y:0}}
            transition={{duration:1,ease:"easeOut"}}
            >
                
                <input 
                type="text"
                value={title}
                onChange={this.handleChangeTitle}
                className='input-title'
                placeholder='Enter Title'
                />
                <TextareaAutosize
                minRows={20}
                value={note}
                onChange={this.handleChangeNote}
                className='textarea-note'
                placeholder='Write your note here...'
                />
                <p className='error-msg-editnote'>{errorMsg}</p>
                <motion.button 
                type="submit" 
                className='save-button'
                initial={{scale:0.8}}
                animate={{scale:1}}
                transition={{duration:0.8,ease:"easeOut"}}
                >
                Save
                </motion.button>
                
            </motion.form>
            </div>
        );
    }

    renderEditPage=()=>{
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
    
    render() {
        const jwt=Cookies.get("jwt_token")
        if(jwt===undefined){
            return <Navigate to="/login" replace={true}/>
        }

        return(
            <>
            {this.renderEditPage()}
            </>
        )
        
    }
}

function EditNoteWrapper(){
    const {id}=useParams()
    const navigate=useNavigate()
    
    return <EditNote id={id} navigate={navigate} />
}

export default EditNoteWrapper;