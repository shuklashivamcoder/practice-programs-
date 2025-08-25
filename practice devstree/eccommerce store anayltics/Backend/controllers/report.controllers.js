import { Orders } from "../models/Order.models.js";
import { Users } from "../models/users.models.js";

export async function totalsalespermonth(req, res) {
  try {
    const totalRevenue = await Orders.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" }
        }
      }
    ]);
    return res.json({
      message: totalRevenue
    })


  } catch (error) {
    return res.json({
      message: "catch errror from totalsalespermonth controller"
    })
  }
}




export async function numberoforderpercustomer(req, res) {
  try {
    const result = await Users.aggregate([
      {

        $group: {
          _id: "$orderid",
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          order_id: "$_id",
          totalOrders: 1
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for customers" });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Order count per customer found successfully"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export async function topsellingproducts(req, res) {
  try {
    const products = await Orders.aggregate([

      { $unwind: "$products" },


      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" }
        }
      },

      { $sort: { totalSold: -1 } },


      { $limit: 5 },


      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },


      { $unwind: "$productDetails" },


      {
        $project: {
          _id: 0,
          productId: "$productDetails._id",
          name: "$productDetails.productname",
          totalSold: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      topProducts: products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch top selling products"
    });
  }
};





export const averageOrderValue = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      {
        $group: {
          _id: null,
          avgOrderValue: { $avg: "$totalPrice" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      averageOrderValue: result.length > 0 ? result[0].avgOrderValue : 0
    });

  } catch (error) {
    console.error("Error calculating average order value:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to calculate average order value"
    });
  }
};
