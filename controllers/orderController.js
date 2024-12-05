import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing orders using COD method
const placeOrder= async(req,res)=>{
    try {
        const {userId,items, amount, address}= req.body;

        const orderData= {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            data:Data.now(),
        }

        const newOrder= new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}});

        res.json({success:true, message:"Order Placed"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// placing orders using stripe method
const placeOrderStripe= async(req,res)=>{

}

// placing orders using Raxorpay method
const placeOrderRazorpay= async(req,res)=>{

}

// all orders data for admin panel
const allOrders= async(req,res)=>{

}

// user order data for frontend
const userOrders= async(req,res)=>{

}

//update order status from admin panel
const updateStatus= async(req,res)=>{

}

export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus}