import mongoose from "mongoose";

const userSchema = mongoose.Schema( {

    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    },
    socketid : String,
    friends : [ String ]
} )

const User = mongoose.model("User", userSchema);
export default User;