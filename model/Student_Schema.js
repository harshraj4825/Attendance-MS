const mongoose=require("mongoose");
const student_schema=new mongoose.Schema({
    Name: {
        type:String,
     },
    UserId:{
        type:Number,
        required:[true,"Roll number  is required"],
     },
     Password:{
         type:String,
         required:[true,"Password is required"]
     },
     profileImage:{contentType:String,
        data:Buffer,
        Path2D:String
    }
    
 })
 const Student_schema=mongoose.model("Student-list",student_schema);
//  module.exports=Student_schema;