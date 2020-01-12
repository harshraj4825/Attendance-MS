const express=require("express");
const Image_router=express.Router();
const multer = require('multer');
const path=require("path");
const fs = require("fs");
const mongoose =require("mongoose");
const students_sch=require("../model/Student_Schema");
const faculty_sch=require("../model/faculty_Schema");


const Student_schema=mongoose.model("Student-list");
const Faculty_schema=mongoose.model("Faculty-list");

Image_router.use(express.static(__dirname+"./public"));

//set storage engine
const storage = multer.diskStorage({
    destination:"./public/uploaded_image",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage
                     }).single('profileImage');

Image_router.post('/:userType/profileImage/:userid',upload, function (req, res) {
    //userid ==Email(faculty)/UserId(student)
    const file=req.file;
    if(!file){
        res.send("Please upload file")
    }else{
        const photo=fs.readFileSync(req.file.path);
        const encodePhoto=photo.toString('base64');
        const buffer=new Buffer(encodePhoto,'base64')
        const student_schema=new Student_schema();
        if(req.params.userType==="student"){
            Student_schema.findOne({UserId:req.params.userid},async(err,existingUser)=>{
                if(existingUser===null){
                    await existingUser.save();
                    console.log(existingUser)
                    res.status(200).send(existingUser);
                }else{
                    existingUser.profileImage.contentType=req.file.mimetype
                    existingUser.profileImage.Path2D=req.file.path
                    existingUser.profileImage.data=buffer
                    await existingUser.save();
                    res.status(200).send("ok");
                    // res.status(200).send(existingUser.profileImage.data);
                    // res.status(400).send();
                }
            })
        }else if(req.params.userType==="faculty"){
            Faculty_schema.findOne({Email:req.params.userid},async(err,existingUser)=>{
                if(existingUser===null){
                    await existingUser.save();
                    console.log(existingUser)
                    res.status(200).send(existingUser);
                }else{
                    existingUser.profileImage.contentType=req.file.mimetype
                    existingUser.profileImage.Path2D=req.file.path
                    existingUser.profileImage.data=buffer
                    await existingUser.save();
                    res.status(200).send("ok");
                }
            })
        }
    }
});
module.exports=Image_router;