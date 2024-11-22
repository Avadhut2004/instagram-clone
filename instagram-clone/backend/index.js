import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from 'cookie-parser';
import dotenv from "dotenv";
import connectdb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config({});

console.log("port :",process.env.PORT);
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(urlencoded({extended:true}));

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));

// API s here 

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

app.listen(PORT , ()=>{
    connectdb();
    console.log(`Listening to port ${PORT}`);
})
app.get("/",(req,res)=>{
  return res.status(200).json({
    message:'from backend',
    success : true
  })
})

