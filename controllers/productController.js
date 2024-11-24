import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel';

//fucntion for add product
const addProduct= async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}= req.body

        const image1= req.files.image1 && req.files.image1[0]
        const image2= req.files.image2 && req.files.image2[0]
        const image3= req.files.image3 && req.files.image3[0]
        const image4= req.files.image4 && req.files.image4[0]

        const images= [image1,image2,image3,image4].filter(()=>item !== undefined)

        let imagesUrl= await Promise.all(
            images.map(async (item) => {
                let result= await cloudinary.uploader.upload(item.path,{resource_type:"image"});
                return result.secure_url
            })
        )

      const productData={
        name,
        description,
        category,
        price:Number(price),
        subCategory,
        bestseller:bestseller === 'on' ? true : false,
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
    
}

//fucntion for removing product
const removeProduct= async(req,res)=>{
    
}

//fucntion for single product info
const singleProduct= async(req,res)=>{
    
}

export {addProduct,listProducts,removeProduct,singleProduct}


