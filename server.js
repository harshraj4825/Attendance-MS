const express=require("express");
const app=express();
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const sroutes=require("./routes/testf")
const routes=require("./routes/Authentication")
const routess=require("./routes/Image_upload")

require("./mongo");
// require("./model/schema");
// require("./model/Student_Schema");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/",require("./routes/testf"));

app.use("/",require("./routes/Authentication"));
app.use("/",require("./routes/Image_upload"));
app.use("/",require("./routes/course_register"));
app.use((req,res,next)=>{
    req.status=404;
    const error=new Error("Routes not found");

    next(error);
});
app.listen(3001,()=>{
    console.log("server is running on 3001");
})