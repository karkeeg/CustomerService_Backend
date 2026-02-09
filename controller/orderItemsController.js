const OrderItemsModel = require("../models/orderItemsModel");
const OrderModel = require("../models/orderModel");

exports.placeOrder = async (req, res) => {
  //order Items : [{product:.... , quantity: ...., },{product:.... , quantity: ...., }]
  let orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let orderItemToAdd = await OrderItemsModel.create({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      if (!orderItemToAdd) {
        return res.status(400).json({ error: "Something went wrong" });
      }
      return orderItemToAdd._id;
    })
  );

  let individualTotals = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      let orderItem = await OrderItemsModel.findById(orderItemId).populate(
        "product"
      );
      return orderItem.product.product_price * orderItem.quantity;
    })
  );

  let total = individualTotals.reduce((acc, cur) => acc + cur);

  let orderToPlace = await OrderModel.create({
    orderItems: orderItemsIds,
    user: req.body.user,
    total: total,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    phone: req.body.phone,
  });
  if (!orderToPlace) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send({ orderToPlace });
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: {
            path: "category",
            select: "name",
          },
          select: "name price image",
        },
      })
      .populate({
        path: "user",
        select: "username email",
      });

    if (!orders) {
      return res.status(400).json({ error: "Something went wrong!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getSingleOrder = async (req, res) => {
  let order = await OrderModel.findById(req.params.id)
    .populate({
      path: "orderItems",
      populate: "product",
    })
    .populate({
      path: "user",
    });
  if (!order) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  res.send(order);
};

exports.getAllOrderByUser = async (req, res) => {
  let orders = await OrderModel.find({ user: req.params.id }).populate({
    path: "orderItems",
    populate: { path: "product", populate: "category" },
  });
  if (!orders) {
    return res.status(400).json({ error: "Something went Wrong!!" });
  }
  res.send(orders);
};

exports.deleteOrders = async (req, res) => {
  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(400).json({ error: "Order not found" });
    }

    // Delete all associated orderItems
    for (const orderItemId of deletedOrder.orderItems) {
      const deletedItem = await OrderItemsModel.findByIdAndDelete(orderItemId);
      // If you want to handle missing order items, do it here
    }

    // Send response only once, after all deletions
    return res
      .status(200)
      .json({ message: "Order and its items deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  if (!["pending", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

//update order details
exports.updateOrderById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add new order
exports.addOrder = async (req, res) => {
  try {
    const newOrder = new OrderModel(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
