import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true
    },
    images:[{
        type:String
    }],
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

const Product = mongoose.model('Product',productSchema);

export default Product;