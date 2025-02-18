import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Menu } from "lucide-react";
import './index.css';



const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate=useNavigate()

    const toggleMenu=()=>{
        setMenuOpen(!menuOpen);
    }

    const closeMenu=()=>{
        setMenuOpen(false);
    }

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log out!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("User logged out");
                Cookies.remove("jwt_token");
                
                navigate("/login",{replace:true})
            }
            closeMenu();
        });
    };

    const onDeleteAccount=async ()=>{
        const result=await  Swal.fire({
            title: "Are you sure?",
            text: "Your account will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete account!",
            cancelButtonText: "Cancel"
        });

        if(!result.isConfirmed){
            closeMenu();
            return;
        }
        const jwt=Cookies.get("jwt_token")
        const url="https://notes-app-backend-production-55cf.up.railway.app/delete-account"
        const options={
            method:"DELETE",
            headers:{
                Authorization: `Bearer ${jwt}`
            }
        }

        const response=await fetch(url,options)
        if(response.ok){
            const result=await response.json()
            const {message}=result
            console.log(message)
            navigate("/login",{replace:true})
        }
        closeMenu();
    }

  

    return (
        <nav className="navbar">
            <div className="">
                <Link to="/" className='navbar-brand'>RuScribe</Link>
            </div>
            <button 
            onClick={toggleMenu} 
            className="menu-icon">
        <Menu size={24} color='#eaeaea'/>
      </button>

      {menuOpen && (
        <div className="dropdown-menu" >
          <ul>
            <li>
              <Link to="/" 
              onClick={closeMenu}
              className='home-link'
              >
                Home
              </Link>
            </li>
            <li onClick={handleLogout}>Logout</li>
            <li onClick={onDeleteAccount}>Delete Account</li>
          </ul>
        </div>
      )}
        </nav>
    );
};

export default Header;
