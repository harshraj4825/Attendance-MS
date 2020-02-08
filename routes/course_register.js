const express=require("express");
const course_router=express.Router();
const mongoose =require("mongoose");
var datetime = require('node-datetime');
const students_sch=require("../model/Courses_Schema");


const Courses=mongoose.model("courses-list");
const Student_schema=mongoose.model("Student-list");
//to register courses
//course code, course name and faculty name required
course_router.post("/courses/register",(req, res)=>{
    if(req.body.Course_code && req.body.Course_name && req.body.Faculty_Email){
        const course_schema=new Courses();
        course_schema.Course_code=req.body.Course_code;
        course_schema.Course_name=req.body.Course_name;
        course_schema.Faculty_Email=req.body.Faculty_Email;
        //find course
        Courses.findOne({Course_code:course_schema.Course_code},async(err,existingCourse)=>{
        //if course is not register
        if(existingCourse===null){
            await course_schema.save();
            res.status(200).send({course_register:"successfully"});
        }else{
            res.status(201).send({course_register:"Course is already exist"});
        }
        })
    }else{
        res.send("Please enter all required field")
    }
})
//to get all course for by specific faculty
course_router.post("/courses/get-all",async(req,res)=>{
    if(req.body.UserId){
        await Courses.find({Faculty_Email:req.body.UserId},(err,getallcourses)=>{
            if(getallcourses!=null){
                const objtosend=[]
                for(i in getallcourses){
                    objtosend[i]={"Course_code":getallcourses[i].Course_code,"Registered_Students":getallcourses[i].student_registered.length}
                }
                res.status(200).send(objtosend)
            }else{
                res.status(201).send({getall:"No course exist"})
            }
        })
    }else{
        res.send("Plz enter all required field");
    }
})
//to  delete/deregister courses from database
course_router.delete("/courses/delete",(req,res)=>{
    const query=req.body;
     Courses.deleteMany(query,(err)=>{
     res.send("deleted many");})
 })
//to change course_code and course name
course_router.put("/courses/change/:value",(req,res)=>{
    if(req.params.value==="course-code"){
        if(req.body.course_code!=null && req.body.new_course_code!=null&&req.body.course_code!=req.body.new_course_code){
            Courses.findOne({Course_code:req.body.course_code},async(err,existingCourse)=>{
                if(existingCourse===null){
                     res.send("course is not found")
                }
                else{
                    Courses.findOne({Course_code:req.body.new_course_code},async(err,new_existingCourse)=>{
                    if(new_existingCourse===null){
                        existingCourse.Course_code=req.body.new_course_code;
                        await existingCourse.save();
                        res.send(existingCourse.Course_code);
                    }
                    else{
                        res.send("The new course code is exist")  
                    }
                })
                }    
            })
        }else{
            res.send("plz enter all field")
        }
    }
    else if(req.params.value==="course-name"){
        if(req.body.course_code!=null &&req.body.course_name!=null){
            Courses.findOne({Course_code:req.body.course_code},async(err,existingCourse)=>{
                if(existingCourse===null){
                     res.send("course is not found")
                }
                else{
                    Courses.findOne({Course_name:req.body.course_name},async(err,new_existingCourse)=>{
                    if(new_existingCourse===null){
                        existingCourse.Course_name=req.body.course_name;
                        await existingCourse.save();
                        res.send(existingCourse.Course_name);
                    }
                    else{
                        res.send("The new course name is exist")  
                    }
                })
                }           
            })
        }else{
            res.send("plz enter all field")
        }
    }
})
 //to search course detail by course code or course name
course_router.post("/courses/findone",async(req,res)=>{   
    if((req.body.course_name!=null)||(req.body.course_code!=null)){
        const course_attribute=req.body
        switch (Object.keys(course_attribute)[0]){
            //search course by course_code
            case "course_code":{await Courses.findOne({Course_code:req.body.course_code},async(err,existingCourse)=>{
                if(existingCourse!=null){
                const student_lists=[];
                const no_of_classes=existingCourse.attendance.length
                    for (let i=0; i<existingCourse.student_registered.length; i++) {
                        let count=0;
                        await Student_schema.findOne({UserId:existingCourse.student_registered[i]},(err,existingName)=>{   
                            for(let k=0;k<no_of_classes;k++){
                                for(let j=0;j<existingCourse.attendance[k].attendance_list.length;j++){
                                    if(existingCourse.attendance[k].attendance_list[j].student_id===existingCourse.student_registered[i] && existingCourse.attendance[k].attendance_list[j].attend===true){
                                        count=count+1;
                                    }
                                }
                            }
                            let persentage_of_attendance=(count*100/no_of_classes);
                            student_lists.push({"student_roll_number":existingCourse.student_registered[i],"student_name":existingName.Name,"persentage_of_attendance":parseFloat(persentage_of_attendance).toFixed(2)});    
                        })
                    }
                    const objtosend={"student_information":student_lists};
                    objtosend["total_students"]=existingCourse.student_registered.length;
                    objtosend["course_name"]=existingCourse.Course_name;
                    objtosend["faculty_name"]=existingCourse.Faculty_Email;
                    res.status(200).send(objtosend);
                }else{
                       res.send("course code doesn't exist")
                   } 
                })
                break;}
            case "course_name":{await Courses.findOne(({Course_name:req.body.course_name},(err,existingCourse)=>{
                if(existingCourse!=null){
                          res.send(existingCourse)
                }else{
                       res.send("course doesn't exist")
                }
                }))
                break;}
            default:{
                res.send("Plz enter valid detail")
            }
       }
    }else{
        res.send("plz enter required field")
    }
})
//to get attendance of a student for a paricular course
course_router.post("/courses/student-attendance",async(req,res)=>{
    if(req.body.student_id!=null && req.body.course_code!=null){
        await Courses.findOne({Course_code:req.body.course_code},(err,existingCourse)=>{
            if(existingCourse!=null){
                const attendanceSummary=[];
                const no_of_classes=existingCourse.attendance.length;
                if(existingCourse.student_registered.includes(req.body.student_id)){
                    let present=0;
                    let sl_no=1;
                    for(let i=0;i<no_of_classes;i++){
                        for(let j=0;j<existingCourse.attendance[i].attendance_list.length;j++){
                            if(existingCourse.attendance[i].attendance_list[j].student_id===req.body.student_id){
                                if(existingCourse.attendance[i].attendance_list[j].attend===true){
                                    present=present+1;
                                    attendanceSummary.push({"sl_no":sl_no,"Date":existingCourse.attendance[i].date,"Status":"Present"})
                                }else{
                                    attendanceSummary.push({"sl_no":sl_no,"Date":existingCourse.attendance[i].date,"Status":"Absent"})
                                }
                            }
                        }
                        sl_no=sl_no+1;
                    }
                    const objtosend={"Attendance_Status":attendanceSummary};
                    objtosend["Total_lacture"]=no_of_classes;
                    objtosend["Total_Present"]=present;
                    //res.status(200).send(no_of_classes.toString())
                    //console.log(present);
                    res.status(200).send(objtosend)
                }else{
                    res.send("student is not register");
                }
            }
        })

    }else{
        res.send("plz enter all  field")
    }
})
 //to get all courses course dstails
course_router.get("/courses/get-all-course",async(req,res)=>{
    Courses.find({},(err,existingCourse)=>{
        if(existingCourse!=null){
            res.send(existingCourse)
        }else{
            res.send("no course is register")
        }
        
    })
})
//to take attendance
// attendance json example [{"student_id":123556,"attend":true},{"student_id":1234560222}]
//https://stackoverflow.com/questions/56981910/how-to-send-json-array-in-android-retrofit/56982069
course_router.put("/courses/attendance/:course_code",async(req,res)=>{
    if(req.params.course_code){
        const dt = datetime.create();
        const formatted_date = dt.format('Y/m/d');
        const formatted_time=dt.format("H:M:S");
         await Courses.findOne({Course_code:req.params.course_code},async(err,existingCourse)=>{
          const  arrayLength=(existingCourse.attendance.length);
            if(existingCourse){
                existingCourse.attendance.push({date:formatted_date,time:formatted_time});
                if(existingCourse.student_registered.length===req.body.length){
                    for(let i=0;i<req.body.length;i++){
                        if(existingCourse.student_registered.includes(req.body[i].student_id)){
                        existingCourse.attendance[arrayLength].attendance_list.push(req.body[i])
                        }
                        else{
                        res.send(req.body[i].student_id.toString())
                        res.end()
                        }
                    }
                    await existingCourse.save();
                    res.send(existingCourse.attendance); 
                }
                else{
                    res.send("plz provide all students status")
                }
                
            }else{
                res.send("bad request")
           }
        })

    }else{
        res.send("Please enter all required field")
    }
})
//to get attendance of student for a course

// to check the student resister for the course
//ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
function checkAvailability(arr, val) {
    const check= arr.some(arrVal => {
        if(val===arrVal){
            return true;
        }else{
            return false;
        }
    });
    return check;
}

//to resister/update the student in course
course_router.put("/courses/:register/student/",(req,res)=>{   
    if(req.body.course_code){
        Courses.findOne({Course_code:req.body.course_code},async(err,existingCourse)=>{
            if(existingCourse){
                    switch(req.params.register){
                        case "register":{
                            if(checkAvailability(existingCourse.student_registered,req.body.student_id)===false){
                                if(req.body.student_id){
                                    existingCourse.student_registered.push(req.body.student_id);
                                    await existingCourse.save();
                                    res.send(existingCourse)
                                }
                                else{
                                    res.send("please enter all required field") 
                                }
                            }else{
                                 res.send("you are already registered for this course")
                                }
                            break;
                        }
                        case "update":{
                            if(checkAvailability(existingCourse.student_registered,req.body.student_id)===true){
                                if(req.body.student_id && req.body.new_student_id){
                                    existingCourse.student_registered.pull(req.body.student_id);
                                    existingCourse.student_registered.push(req.body.new_student_id);
                                    await existingCourse.save();
                                    res.send(existingCourse)   
                                }else{
                                    res.send("please enter all required field")
                                }
                            }else{
                                res.send("you are not registered for this course")
                            }
                            
                            break
                        }
                    } 
            }else{}
        })
    }else{
        res.send("Please enter all required field");
    }
})

//to deregister the student from the course
course_router.delete("/courses/deregister/student/:course_code",(req,res)=>{
    if(req.params.course_code){
        Courses.findOne({Course_code:req.params.course_code},async(err,existingCourse)=>{
            if(checkAvailability(existingCourse.student_registered,req.body.student_id)===true){
                existingCourse.student_registered.pull(req.body.student_id);
                    await existingCourse.save();
                    res.send(existingCourse)
            }else{
                res.send("you are not register for this course")
            }
        })
    }else{
        res.send("Please enter all required field");
    }
})
//to get list of register students for the course
course_router.get("/courses/registered-students",async(req,res)=>{
    if(req.body.course_code){
        await Courses.findOne({Course_code:req.body.course_code},async(err,existingCourse)=>{
            res.send(existingCourse.student_registered);
        })
    }else{
        res.send("please enter course code")
    }
})
//to get query
//http://localhost:3001/resp?id=12345
course_router.get("/resp",(req,res)=>{
    res.send({UserId:12321,Name:"harsh"});
})

module.exports=course_router;