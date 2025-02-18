import {BrowserRouter,Routes,Route,useLocation} from "react-router-dom"
import LoginWrapper from "./components/Login"
import RegisterationWrapper from "./components/Registeration"
import DashboardWrapper from "./components/Dashboard"
import CreateNoteWrapper from "./components/CreateNote"
import EditNoteWrapper from "./components/EditNote"
import Header from "./components/Header"

const AppContent=()=>{
  const location=useLocation();
  const hideHeaderRoutes=['/login','/register']

  return (
    <>
    {!hideHeaderRoutes.includes(location.pathname) && <Header/>}
    <Routes>
    <Route exact path="/login" element={<LoginWrapper/>}/>
    <Route exact path="/register" element={<RegisterationWrapper/>}/>
    <Route exact path="/" element={<DashboardWrapper/>}/>
    <Route exact path="/createnote" element={<CreateNoteWrapper/>}/>
    <Route exact path="/editnote/:id" element={<EditNoteWrapper/>}/>
    </Routes>
    </>
  )
}

const App=()=>{
  

  return(
    
    <BrowserRouter>
    
    <AppContent/>
    </BrowserRouter>
    
  )
}

export default App;
