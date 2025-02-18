import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { motion } from 'motion/react';
import TextareaAutosize from 'react-textarea-autosize';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import Loader from '../Loader';
import "./index.css"

const apiStatusConstants={
    initial:"INITIAL",
    loading:"LOADING",
    success:"SUCCESS",
    failure:"FAILURE"
}

class CreateNote extends Component {
    state={
        title:'',
        content:'',
        apiStatus:apiStatusConstants.initial,
        emptyFields:false,
        emptyFieldsMsg:""
    }

    componentDidMount(){
        this.checkTokenValidity()
    }
    

    checkTokenValidity=async()=>{
        const jwt=Cookies.get("jwt_token")
        if(jwt===undefined){
            this.props.navigate("/login",{replace:true})
            return;
        }

        const url="https://notes-app-backend-production-55cf.up.railway.app/notes"
        const options={
            method:"GET",
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        }

        const response=await fetch(url,options)
        if(response.status===401){
            Cookies.remove("jwt_token")
            this.props.navigate("/login",{replace:true})
            return;
        }
    }
    

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }
    
    onClickAddNote = async (event) => {
        event.preventDefault();
        this.setState({apiStatus:apiStatusConstants.loading})
        const { title, content } = this.state;
        const note = { title, content };
        const jwt=Cookies.get("jwt_token");

        try {
            const response = await fetch('https://notes-app-backend-production-55cf.up.railway.app/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(note),
            });

            if(response.status===401){
                Cookies.remove("jwt_token")
                this.setState({apiStatus:apiStatusConstants.initial})
                this.props.navigate("/login", { replace: true });
                    return;
            }

            if(response.status===400){
                const {message}=await response.json()
                console.log(message)
                this.setState({emptyFields:true,emptyFieldsMsg:message,apiStatus:apiStatusConstants.initial})
                return;
            }

            const data = await response.json();
            console.log('Note added successfully:', data);
            this.setState({apiStatus:apiStatusConstants.success})
            this.props.navigate("/",{replace:true,state:{noteAdded:true}})
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    onClickBack=()=>{
        this.props.navigate("/")
        console.log("backbutton clicked")
        return;
    }

    renderSuccessView=()=>{
        const {title,
            content,
            emptyFields,
            emptyFieldsMsg
        }=this.state

        return (
            <div className='create-note-bg'>
                <motion.div 
                className="back-button-container"
                initial={{opacity:0,x:20}}
                animate={{opacity:1,x:0}}
                transition={{duration:0.8,ease:"easeOut"}}
                >
            <button
            className='back-button'
            onClick={this.onClickBack}>
                <IoArrowBack size={30}/>
            </button>
            </motion.div>
            <motion.form 
            className="create-note-container" 
            onSubmit={this.onClickAddNote}
            initial={{opacity:0,y:30}}
            animate={{opacity:1,y:0}}
            transition={{duration:1,ease:"easeOut"}}
            >
            <input 
                type="text" 
                placeholder="Enter Title" 
                className="custom-input" 
                onChange={this.handleTitleChange} 
                value={title}
            />
            <TextareaAutosize
                minRows={20}
                placeholder="Enter Content" 
                className="textarea-create-note" 
                onChange={this.handleContentChange} 
                value={content}
            /> 
            <p className='error-msg-createnote'>{emptyFields?(`* ${emptyFieldsMsg}`):null}</p>
            <motion.button 
                className="add-note-button" 
                type='submit'
                initial={{scale:0.8}}
                animate={{scale:1}}
                transition={{duration:1,ease:"easeOut"}}
            >
                Add Note
            </motion.button>
            
            </motion.form>
            </div>
        );
    }

    renderLoadingView=()=>{
        return <Loader/>
      }

      renderCreateNotePage=()=>{
        const {apiStatus}=this.state
        switch(apiStatus){
            case apiStatusConstants.loading:
                return this.renderLoadingView()
            case apiStatusConstants.success:
                return this.renderSuccessView()
            case apiStatusConstants.initial:
                return this.renderSuccessView()
            default:
                return null
        }
    
       }

    render() {
       return(
        <>
        {this.renderCreateNotePage()}
        </>
       )
    }
}
function CreateNoteWrapper() {
    const navigate = useNavigate();

    return <CreateNote navigate={navigate} />;
}

export default CreateNoteWrapper;