import { default as orderModel } from '../models/orderModel.js';
import { default as productModel } from '../models/productModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await productModel.countDocuments();
    
    // Get orders statistics
    const orders = await orderModel.find();
    const totalOrders = orders.length;
    

    return res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};
