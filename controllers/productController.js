import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import jwt from 'jsonwebtoken';

//fucntion for add product
const addProduct= async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}= req.body

        const image1= req.files.image1 && req.files.image1[0]
        const image2= req.files.image2 && req.files.image2[0]
        const image3= req.files.image3 && req.files.image3[0]
        const image4= req.files.image4 && req.files.image4[0]

        const images= [image1,image2,image3,image4].filter(item=>item !== undefined)

        let imagesUrl= await Promise.all(
            images.map(async (item) => {
                let result= await cloudinary.uploader.upload(item.path,{resource_type:"image"});
                return result.secure_url
            })
        )
        console.log("Type of bestseller: ", typeof bestseller)
      const productData={
        name,
        description,
        category,
        price:Number(price),
        subCategory,
        bestseller:Boolean(bestseller),
        sizes:JSON.parse(sizes),
        image:imagesUrl,
        date:Date.now()
      }

      console.log(productData)

      const product= new productModel(productData);
      await product.save()

        res.json({success:true,message:"Product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//fucntion for list product
const listProducts= async(req,res)=>{
    try {
        const products= await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//fucntion for removing product
const removeProduct= async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"ProductRremoved"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//fucntion for single product info
const singleProduct= async(req,res)=>{
    try {
        const {productId}= req.body;
        const product= await productModel.findById(productId);
        res.json({success:true,product})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// function for updating a product
const updateProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
  
      // Handle images (if new ones are uploaded)
      const image1 = req.files?.image1 && req.files.image1[0];
      const image2 = req.files?.image2 && req.files.image2[0];
      const image3 = req.files?.image3 && req.files.image3[0];
      const image4 = req.files?.image4 && req.files.image4[0];
  
      const images = [image1, image2, image3, image4].filter(item => item !== undefined);
  
      // Upload new images to Cloudinary (if any)
      let imagesUrl = [];
      if (images.length > 0) {
        imagesUrl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
            return result.secure_url;
          })
        );
      }
  
      // Prepare updated product data
      const updatedProductData = {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        bestseller: Boolean(bestseller),
        sizes: JSON.parse(sizes),
        image: imagesUrl.length > 0 ? imagesUrl : undefined, // Only update images if new ones are provided
      };
  
      // Update the product in the database
      const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedProductData, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
export {addProduct,listProducts,removeProduct,singleProduct,updateProduct}


