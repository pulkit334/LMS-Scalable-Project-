const Cart = require("../models/cart"); //  Single import, capital C

exports.saveCartItems = async (req, res) => {
  try {
    const { userId, items, totalPrice, itemCount } = req.body;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Empty cart - delete it
    if (!items || items.length === 0) {
      await Cart.findOneAndDelete({ user: userId }); // 
      return res.status(200).json({
        success: true,
        message: "Cart cleared from database",
      });
    }

    // Format items
    const formattedItems = items.map((item) => ({
      course: item._id,
      price: item.price,
      title: item.title,
      thumbnail: item.thumbnail,
    }));

    // Find THIS user's cart
    let cart = await Cart.findOne({ user: userId }); //

    if (!cart) {
      // Create new cart for THIS user
      cart = await Cart.create({
        user: userId, // 
        items: formattedItems,
        totalPrice: totalPrice,
        itemCount: itemCount,
        createdAt: new Date(),
        reminderSent: false,
      });

      return res.status(201).json({
        success: true,
        message: "Cart created successfully",
        cart: cart,
      });
    } else {
      // Update existing cart
      cart.items = formattedItems;
      cart.totalPrice = totalPrice;
      cart.itemCount = itemCount;
      cart.reminderSent = false; // Reset reminder when cart changes

      await cart.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: cart,
      });
    }
  } catch (err) {
    console.error("Error in saveCartItems:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getcartitems = async (req, res) => {
  try {
    //jwt Authentication
    const userId = req.user.id;

    // Find THIS user's cart
    const response = await Cart.find({ user: userId }).lean(); //

    return res.status(200).json({
      //
      success: true,
      message: "Cart retrieved successfully",
      data: response,
    });
  } catch (err) {
    //
    console.error("Error in getcartitems:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
