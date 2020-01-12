const mongoose=require("mongoose");

const attendance_list=mongoose.Schema([{
    _id:false,
    student_id:Number,
    attend:{type: Boolean,
    default:false}
}])
const attendance=mongoose.Schema({
    _id:false,
    date:{type:String,required:true},
    time:String,
    attendance_list:[attendance_list]
})
const course_schema=mongoose.Schema({
   Course_name: {
       type:String,
       required:true
    },
    Course_code:{
        type:String,
        required:true
    },
    Faculty_name:{
        type:String,
        required:true
    },
    student_registered:[{type:Number}],

    attendance:[attendance]
})

module.exports=mongoose.model("courses-list",course_schema);