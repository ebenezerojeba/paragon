import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'
// Fucntion for add product
const addProduct = async (req, res) => {
    try {
        const {name,description,price,category,subCategory,sizes,bestSeller} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=> item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData ={
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? "true" : false,
            sizes: (() => {
                try {
                    return JSON.parse(sizes);
                } catch (error) {
                    console.error("Error parsing sizes JSON:", error);
                    return []; // Return a default value or handle the error as needed
                }
            })(),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        
        const product = new productModel (productData)
        await product.save()

        res.json({success:true, message: "Product Added"})

    } catch (error) {
        console.log(error);
        
        res.json({success:false,message:error.message})
    }
}

// Function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
// Function for removign product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Product Removed"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
// Function for single product info
 const singleProduct = async (req,res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }


 export {addProduct, listProduct, removeProduct, singleProduct}