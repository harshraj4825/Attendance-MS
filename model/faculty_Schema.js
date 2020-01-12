const mongoose=require("mongoose");
const faculty_schema=mongoose.Schema({
    Name: {
        type:String,
     },
    Email:{
        type:String,
        required:[true,"Email is required"]
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
 faculty_list_schema=mongoose.model("Faculty-list",faculty_schema);
// module.exports=faculty_list_schema;