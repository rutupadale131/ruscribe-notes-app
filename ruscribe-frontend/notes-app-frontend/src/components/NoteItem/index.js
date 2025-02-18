import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const NoteItem = (props) => {
    const {note}=props
    const {id,title,content}=note
    const truncatedContent = note.content.length > 100 
        ? content.slice(0, 100) + "..." 
        : content + "...";
    return (
        <Link to={`/editnote/${id}`} className="link-item"> 
        <div className="note-item">      
            <h1 className='note-item-title'>{title}</h1>
            <p className='note-item-content'>{truncatedContent}</p>
            </div>
        </Link>
    );
};


export default NoteItem;