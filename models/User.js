const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    checkin:{
        type: String,
    },
    checkout:{
        type: String,
    },
    timestamp:{
        type: String
    }
})
const User= mongoose.model('users', UserSchema);

module.exports={User};



