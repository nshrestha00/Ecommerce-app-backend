import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import jwt from 'jsonwebtoken';

//fucntion for add product
const addProduct= async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}= req.body

        console.log("add request body: ", req.body)

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

    console.log('update value of req body: ', req.body)

    // First get the existing product to handle images properly
    const existingProduct = await productModel.findById(productId);

    console.log("existing product: ", existingProduct)
    
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle images (if new ones are uploaded)
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    console.log('value of images: ', images)

    // Upload new images to Cloudinary (if any)
    let imagesUrl = existingProduct.image; // Start with existing images
    if (images.length > 0) {
      const newImagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
      imagesUrl = newImagesUrl; // Replace with new images
    }

    console.log("above updated product data: ")
    console.log("value of sizes: ", (sizes))

    // Prepare updated product data
    const updatedProductData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: Boolean(bestseller) ?? false,
      sizes: JSON.parse(sizes),
    };

    console.log('updated product data: ', updatedProductData)
    
    // Only update images field if new images were uploaded
    if (images.length > 0) {
      updatedProductData.image = imagesUrl;
    }

    // Update the product in the database
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId, 
      updatedProductData, 
      { new: true }
    );

    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
  
export {addProduct,listProducts,removeProduct,singleProduct,updateProduct}


