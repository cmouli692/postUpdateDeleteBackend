const express = require("express")

const cors  = require("cors")

const sqlite3 = require("sqlite3").verbose()

const app = express()

const corsOptions = {
    origin : "http://localhost:3000",
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

const PORT  = 3001

// creating a data  

const db= new sqlite3.Database("mydatabase.db",err => {
    if(err){
        console.error("Error opening database:",err.message)
    }else{
        console.log("Connected to SQLITE database")

        db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,post TEXT,unique_key TEXT)",err => {
            if(err){
                console.error("Error creating table",err)
            }else{
                console.log("Table created successfully")
            }
        })

    }
})


app.listen(PORT,() => {
    console.log(`server is running at ${PORT}`)
})



app.get("/", async(req,res) => {

    const getAllPostsQuery = `SELECT post , unique_key FROM posts`
    db.all(getAllPostsQuery,(err,rows) => {
        if(err){
            console.error("Error fetching Posts : " , err.message)
            res.status(500).send({error : "Failed to fetch posts"})
        }else{
            res.json(rows)
        }
    })
    
})

// inserting values

app.post("/",(req,res)=> {
    const {uniqueKey,post} = req.body 

    const insertPostQuery = `INSERT INTO posts(unique_key,post)  VALUES (?,?)`

    db.run(insertPostQuery,[uniqueKey,post],err =>{
        if(err){
            console.error("Error at inserting post values",err.message)
        }else{
            console.log("values inserted successfully in post table")
        }
    })

   
})

// updating values

app.put("/", async(req,res) => {
    const {post,uniqueKey} = req.body

    const updatePostQuery = `UPDATE posts SET post = ? WHERE unique_key = ?`;

    db.run(updatePostQuery,[post,uniqueKey],err => {
        if(err){
            console.error("Error updating post : " , err.message)
            res.status(500).send({error : "failed to update post"})
        }else{
            res.send({message : "Post updated successfully"})
        }
    })
})

app.delete("/:uniqueKey/",(req,res) => {
    const {uniqueKey} = req.params

    const deletePostQuery = `DELETE FROM posts WHERE unique_key = ?`

    db.run(deletePostQuery,uniqueKey , (err) => {
        if(err){
            return res.status(500).json({error : err.message})
        }

        if(this.changes === 0){
            return res.status(404).json({message: "user not found"})
        }

        res.json({message:"user deleted successfully"})
    })
})




// closing database

// db.close(err =>{
//     if(err){
//        console.error("Error at closing database", err.message)  
//     }else{
//         console.log("Database is closed")
//     }
   
// })





