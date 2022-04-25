const mongoose = require('mongoose');
const URL = require('../secret/mongodbURL');

mongoose.connect(URL.mongodbURL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log(`Mongodb is Connected.Please have a great coding.`);
})
