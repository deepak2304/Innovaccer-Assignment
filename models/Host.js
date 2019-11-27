const mongoose= require('mongoose');

const HostSchema= new mongoose.Schema({
    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})
const Host= mongoose.model('host', HostSchema);

module.exports={Host};
