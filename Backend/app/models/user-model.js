import {Schema,model} from "mongoose"

const userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:'user'
    },
    image: {
        type: String,
        default: "", 
    },
    searchHistory:Array,
})

const User = model('User',userSchema)

export default User