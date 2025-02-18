const express=require("express");
const cors=require("cors");
const sqlite3=require("sqlite3")
const {open}=require("sqlite")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");

const path=require("path");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;


const app=express();
const dbPath=path.join(__dirname,"notes.db")

console.log(dbPath)
app.use(cors({ origin: "*" ,credentials:true}));

app.use(express.json());

const PORT=process.env.PORT || 5501;

let db=null;

const initializeDbAndServer=async ()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        });

        await db.run(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL
                  
            )
          `);

        await db.run(`
            CREATE TABLE IF NOT EXISTS notes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER NOT NULL, 
            FOREIGN KEY (user_id) REFERENCES users(id)
            )
            `);

            console.log("DB initiated")
        app.listen(PORT,()=>{
            console.log("Server Initialized")
        });
        
    }catch(e){
        console.log(e);
        process.exit(1);
    }
}

app.post("/register",async (request,response)=>{
    const {username,password}=request.body;
    if(!username || !password){
        return response.status(400).json({message: "Username and password are required"});
    }

    const hashedPassword=await bcrypt.hash(password,10);

    try{
        const result=await db.run(`
            INSERT INTO users (username,password) values(?,?)
            `,[username,hashedPassword]);

            if (result.changes === 0) {
                return response.status(500).json({message: "Error registering user"});
            }

            response.status(201).json({id: result.lastID, username});
    }catch(error){
        console.log("dbError:",error );
        if (error.code.includes("SQLITE_CONSTRAINT")) {
            response.status(400).json({ message: "Username already exists. Please choose a different one." });
            return;
        }else{
        return response.status(500).json({ message: "Error registering user" });
    }}
})

app.post("/login",async (request,response)=>{
    const {username,password}=request.body;
    if(!username || !password){
        return response.status(400).json({message:"Username and password are required"});
    }
    try{
        const user=await db.get(`SELECT * FROM users WHERE username=?`,[username]);
        if(!user){
            return response.status(400).json({message:"Invalid credentials"});
        }
        const isValidPassword=await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return response.status(400).json({message:"Invalid credentials"});
        }

        const token=jwt.sign({id:user.id,username:user.username},JWT_SECRET,{expiresIn:"2h"});
        response.status(200).json({token});
    
    }catch(error){
        response.status(500).json({message:"Error logging in"});
    }
})

const authenticateToken=(request,response,next)=>{
    const authHeader =request.header("Authorization");
    
    
    const token=authHeader && authHeader.split(" ")[1];
    
    if(!token){
        return response.status(401).json({message:"Access Denied"});
    }
    jwt.verify(token,JWT_SECRET,(err,user)=>{
        if(err){
            return response.status(401).json({message:"Access Denied"});
        }
        console.log(user);
        request.user=user;
        next();
    })
}

app.post("/notes",authenticateToken,async (request,response)=>{
    const {title,content}=request.body;
    const userId=request.user.id;
    if(!title || !content){
        return response.status(400).json({message:"Title and Content are required"});
    }

    try{
        const result=await db.run(
            `INSERT INTO notes (title,content,user_id) VALUES (?,?,?)`,[title,content,userId]
        );
        response.status(201).json({id:result.lastID,title,content});
    }catch(error){
        response.status(500).json({message:"Error creating note"});
    }
})

app.get('/notes',authenticateToken,async (request,response)=>{
    const userId=request.user.id;
    console.log(userId);
    

    try{
        const notes=await db.all(`
            SELECT * FROM 
            notes WHERE user_id=?
            
            `,[userId]);
        response.status(200).json(notes);
    }catch(error){
        response.status(500).json({message:"Error retrieving notes"});
    }
});

app.get("/notes/:id",authenticateToken,async (request,response)=>{
    const {id}=request.params;
    const userId=request.user.id
    console.log(userId);
    try{
        const note =await db.get(`SELECT * FROM notes WHERE id=? AND user_id=?`,[id,userId]);
        if(!note){
            return response.status(404).json({message:"Note not found"});
        }
        response.status(200).json(note);
    }catch(error){
        response.status(500).json({message:"Error retrieving note"});
    }
});

app.put("/notes/:id",authenticateToken,async (request,response)=>{
    const {id}=request.params;
    const {title,content}=request.body;
    const userId=request.user.id;
    if(!title || !content){
        return response.status(400).json({message:"Title and content are required"});
    }

    try{
        const result = await db.run(`
            UPDATE notes SET title=?, content=? where id=? AND user_id=?
            `,[title,content,id,userId]);
            if(result.changes===0){
                return response.status(404).json({message:"Note not found"});
            }
            response.status(200).json({id,title,content});
    }catch(e){
        response.status(500).json({message:"Error updating note"});
    }
});

app.delete('/notes/:id',authenticateToken, async (request, response) => {
    const { id } = request.params;
    const userId=request.user.id;
    try {
        const result = await db.run(`DELETE FROM notes WHERE id = ? AND user_id=?`,[id,userId]);
        if (result.changes === 0) {
            return response.status(404).json({message:'Note not found'});
        }
        response.status(200).json({message:'Note deleted successfully'});
    } catch (error) {
        response.status(500).json({message:'Error deleting note'});
    }
});

app.delete("/delete-account",authenticateToken,async (request,response)=>{
    try{
        const userId=request.user.id;
        
        await db.run(`DELETE FROM notes WHERE user_id=?`,[userId]);
        await db.run(`DELETE FROM users WHERE id=?`,[userId]);
        

        response.status(200).json({message:"Account deleted permanently."})
    }catch(error){
        console.log(error)
        response.status(500).json({message:"Error deleting account"});
    }
});

initializeDbAndServer();

