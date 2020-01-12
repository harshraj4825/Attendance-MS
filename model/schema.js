const mongoose=require("mongoose");
// const schema=mongoose.Schema({
//     // _id:{type:Number,
//     // required:true},
//    title: {
//        type:String,
//        required:true
//     }
// })
// module.exports=mongoose.model("schemaaaa",schema);
var childSchemanext = mongoose.Schema([{ name: 'string' }]);

var childSchema = mongoose.Schema([{ name: 'string',
childSchemanext:[childSchemanext]

}]);

var parentSchema = mongoose.Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments. Caveat: single nested subdocs only work
  // in mongoose >= 4.2.0
  // child: childSchema
});
var Parent = mongoose.model('Parent', parentSchema);
module.exports=Parent;