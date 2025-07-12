import mongoose from "mongoose";

const messageSchema = mongoose.Schema( {

    from : String,
    to : String,
    messages : [ {
        content : String,
        by : String
    } ]
} )

const Message = mongoose.model("Message", messageSchema);
export default Message;