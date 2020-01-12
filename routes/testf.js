const express=require("express");
const srouter=express.Router();
const mongoose =require("mongoose");
const students_sch=require("../model/schema");

const Parent=mongoose.model("Parent");

// srouter.post("/test",(req,res)=>{
//     const schema=new Parent();
//     schema.title=req.body.title;

//     Schema.findOne({title:req.body.title},async(err,existingUser)=>{
//         if(existingUser===null){
//             await schema.save();
//             res.send(schema)
//         }else{
//             res.send("user is exist")
//         }
//     })
// })
srouter.post("/attendence",(req,res)=>{
    // const schema=new Parent({children: [{ name: 'Matt' }, { name: 'Sarah' }]});
    // schema.children[0].name = 'Matthew';
    // schema.children.push({ name: 'lol' });
    // schema.save();
    //res.send(schema)
    Parent.findOne({_id:"5e1594a99fb8d150bcbe1e84"},(err,exi)=>{
        // exi.children.findOne({_id:"5e1594a99fb8d150bcbe1e87"},(errr,e)=>{
        //     e.children.childSchemanext.push({name:"harsh"})
        // })
       //exi.children[0].push({childSchemanext:[{name:"lof"}]})
       if(exi){
        exi.children.push({name:"loft"})
        exi.children[1].childSchemanext.push({name:"hhi"});
        exi.save();
        res.send(exi.children)
       }
       else{
           const schema=new Parent();
           schema.children={name:"harsh"};
           res.send(schema);

       }
            

    })
    // Schema.findOne({title:req.body.title},(err,existingUser)=>{
    //     if(existingUser===null){
    //         res.send("user not find")
    //     }else{
    //         existingUser.update(
    //             { _id: 1 },
    //             {
    //               $push: {
    //                 quizzes: {
    //                    $each: [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ],
    //                    $sort: { score: -1 },
    //                    $slice: 3
    //                 }
    //               }
    //             }
    //          )
    //         existingUser.save();
    //     //    await existingUser.updateOne({"harsh":"harshhh"})
    //     //    existingUser.save();
    //        res.send(existingUser)

    //     }
    // })
    // schema.update({"title":"hello"},
    //     {
    //          "$push":{
    //              "quizzes":{
    //                     "hii":["pp"]
    //                 }}
    //     })
    //res.send(schema)
    
})
module.exports=srouter;