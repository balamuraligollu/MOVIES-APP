import {Schema,model} from "mongoose"

const adminSchema = new Schema({
    contentName:{type:String,required:true},
    image:{type:String,}
})

const Admin = model('Admin',adminSchema)

export default Admin