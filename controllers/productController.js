//fucntion for add product
const addProduct= async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}= req.body

        const image1= req.files.image1 && req.files.image1[0]
        const image2= req.files.image2 && req.files.image2[0]
        const image3= req.files.image3 && req.files.image3[0]
        const image4= req.files.image4 && req.files.image4[0]

        console.log(name,description,price,category,subCategory,sizes,bestseller);
        console.log(image1,image2,image3,image4);

        res.json({})
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


