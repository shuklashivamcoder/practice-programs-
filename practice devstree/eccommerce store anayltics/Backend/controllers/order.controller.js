import { Orders } from "../models/Order.models.js";
import { Products } from "../models/Products.models.js";
import { Users } from "../models/users.models.js";

export async function Ordercreation(req, res) {
  try {
    const { productname, quantity } = req.body;

    
    const product = await Products.findOne({ productname });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    const user = await Users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdOrder = await Orders.create({
      user: user._id,
      products: [
        {
          productId: product._id,
          quantity: quantity || 1
        }
      ],
      totalPrice: Number(product.price) * (quantity || 1),
      address: user.address
    });

   if (user.orderid) {
  user.orderid.push(createdOrder._id); 
} else {
  user.orderid = [createdOrder._id]; 
}
await user.save();


    return res.status(201).json({
      message: "Order created successfully",
      order: createdOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while creating order",
      error: error.message
    });
  }
}
