const express=require("express");
const router=express.Router();
const mongoose =require("mongoose");
const students_sch=require("../model/Student_Schema");
const faculty_sch=require("../model/faculty_Schema");


const Student_schema=mongoose.model("Student-list");
const Faculty_schema=mongoose.model("Faculty-list");

//for student login
router.post("/student/login",async(req,res)=>{
    if((req.body.UserId &&req.body.Password)){
        const student_schema=new Student_schema();
        student_schema.UserId=req.body.UserId;
        student_schema.Password=req.body.Password;
        await Student_schema.findOne({UserId:student_schema.UserId,
        Password:student_schema.Password},(err,existingUser)=>{
            if(existingUser!=null){
                console.log("you are sucessfully loged in");
                const objTosend={
                    Name:existingUser.Name,
                    UserId:existingUser.UserId
                }
               res.status(200).send(objTosend);
                console.log(objTosend);
            }
            else{ 
                console.log("wrong credential");
                res.status(201).send({notfound:"wrong credential"});
            }
        })
    }else{
        console.log("plz enter your all required field")
        res.status(404).send("Please enter all required field")
    }    
})

//for student signup
router.post("/student/signup",(req, res)=>{
    if((req.body.UserId && req.body.Password && req.body.Name)){
        const student_schema=new Student_schema();
        student_schema.Name=req.body.Name;
        student_schema.UserId=req.body.UserId;
        student_schema.Password=req.body.Password;
        Student_schema.findOne({UserId:student_schema.UserId},async(err,existingUser)=>{
        if(existingUser===null){
            await student_schema.save();
            res.status(200).send({login:"Success"});
        }else{
            console.log("user is exist")
            res.status(201).send({login:"user is already exist"});
        }
        })
    }else{
        res.send("Please enter all required field")
    }
})

//to student change password
router.put("/student/:userId",(req,res)=>{
    if((req.body.NewPassword &&req.body.Password)){
        Student_schema.findOne({UserId:req.params.userId},async(err,existingUser)=>{
            if(existingUser!=null){
                const oldPassword=req.body.Password;
                if(existingUser.Password===oldPassword){
                    existingUser.Password=req.body.NewPassword;
                    await existingUser.save();
                    res.status(200).send({change_pass:"Password is updated"})
                    //res.send(existingUser);
                }else{
                    res.status(201).send({change_pass:"Your old password must not be match with new password"});
                    
                }  
            }else{
                res.send({change_pass:"Password is not updated"})
            }
        })
    }else{
        res.send("Please enter all required field")
    }  
})

//to get all registered student/faculty in database
router.get("/:student/get-all-list",(req,res)=>{
    switch (req.params.student){
        case "student":{
            Student_schema.find({},(err,existingUser)=>{
                if(existingUser===null){
                    res.send("no record found")
                }else{
                    res.send(existingUser);
                }
            })
            break;
        }
        case "faculty":{
            Faculty_schema.find({},(err,existingUser)=>{
                if(existingUser===null){
                    res.send("no record found")
                }
                else{
                    res.send(existingUser);
                }
            })
            break;
        }
        default:{
            res.send("This is not valid url")
        }
    }
})
//Faculty login
router.post("/faculty/login",async(req,res)=>{
    if(req.body.Email && req.body.Password){
        const faculty_schema=new Faculty_schema();
        faculty_schema.Email=req.body.Email;
        faculty_schema.Password=req.body.Password;
        await Faculty_schema.findOne({Email:faculty_schema.Email,
        Password:faculty_schema.Password},(err,existingUser)=>{
            if(existingUser!=null){

               // console.log("you are sucessfully loged in");
               const objTosend={
                Name:existingUser.Name,
                Email:existingUser.Email
            }
            res.status(200).send(objTosend);
            console.log(objTosend); 
            }
            else{
                res.status(201).send({notfound:"wrong credential"});
            }
        })
    }else{
        res.send("Please enter all required field")
    }    
})

// Faculty signup
router.post("/faculty/signup",(req,res)=>{
    if((req.body.Name && req.body.Password && req.body.Email)){
        const faculty_Schema=new Faculty_schema();
        faculty_Schema.Name=req.body.Name;
        faculty_Schema.Email=req.body.Email;
        faculty_Schema.Password=req.body.Password;
        Faculty_schema.findOne({Email:faculty_Schema.Email},async(err,existingUser)=>{
             if(existingUser==null){
                await faculty_Schema.save();
                console.log("login");
                res.status(200).send({login:"Success"});
            }else{
                console.log("user is exist")
                res.status(201).send({login:"user is already exist"});
            }
        })
    }else{
        res.send("Please enter all required field")
    }
})

//faculty change password

router.put("/faculty/:email",(req,res)=>{
    if(req.body.NewPassword && req.body.Password){
        if(req.body.NewPassword != req.body.Password){
            Faculty_schema.findOne({Email:req.params.email},async(err,existingUser)=>{
                if(existingUser!=null){
                    const oldPassword=req.body.Password;
                    if(existingUser.Password===oldPassword){
                        existingUser.Password=req.body.NewPassword;
                        await existingUser.save();
                        res.status(200).send({change_pass:"password is updated"});
                    }else{
                        res.status(201).send({change_pass:"Your old password is not currect"});
                       // console.log(existingUser.Password);
                    }  
                }else{
                    res.send("Password is not updated")
                }
            })
        }else{
            res.send("Old and new Password is same")
        }
    }else{
        res.send("Please enter all required field")
    }
    
})
module.exports=router;