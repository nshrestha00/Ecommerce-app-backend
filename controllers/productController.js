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

// function for editing a product
const editProduct = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Handle 'Bearer' token format
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token is missing" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const { price, name, description, category, subCategory, sizes, bestseller } = req.body;
        const updatedProductData = {};

        // Handle basic fields
        if (price) updatedProductData.price = Number(price);
        if (name) updatedProductData.name = name;
        if (description) updatedProductData.description = description;
        if (category) updatedProductData.category = category;
        if (subCategory) updatedProductData.subCategory = subCategory;
        
        if (sizes) {
            try {
                updatedProductData.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid sizes format" });
            }
        }
        
        if (bestseller !== undefined) updatedProductData.bestseller = Boolean(bestseller);

        if (req.files) {
            const imageFields = ['image1', 'image2', 'image3', 'image4'];
            const images = imageFields
                .map(field => req.files[field]?.[0])
                .filter(item => item !== undefined);

            if (images.length > 0) {
                try {
                    const imagesUrl = await Promise.all(
                        images.map(async (item) => {
                            const result = await cloudinary.uploader.upload(item.path, { 
                                resource_type: "image",
                                folder: "products" // Optional: organize uploads in a folder
                            });
                            return result.secure_url;
                        })
                    );
                    updatedProductData.image = imagesUrl;
                } catch (error) {
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error uploading images to Cloudinary" 
                    });
                }
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updatedProductData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Product Updated Successfully", 
            product: updatedProduct 
        });

    } catch (error) {
        console.error('Edit Product Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export {addProduct,listProducts,removeProduct,singleProduct,editProduct}


