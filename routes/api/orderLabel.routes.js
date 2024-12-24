const express = require("express");
const router = express.Router();
const Order = require("../../models/orderLabel.models"); // Order model

router.post("/create-shipment", async (req, res, next) => {
  try {
    const { userId, formData } = req.body;

    // Add the API key from environment variable
    const api_key = process.env.EXPRESS_LABEL_API_KEY;

    // Send data to Label API using fetch

    const response = await fetch(
      "https://api.labelexpress.io/v1/ups/image/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key, // Add API key to the request body
          manifested: false,
          service_name: formData.service_name,
          sender: {
            sender_name: formData.sender.name,
            sender_phone: formData.sender.phone,
            sender_company: formData.sender.company,
            sender_address1: formData.sender.street,
            sender_address2: formData.sender.street2,
            sender_city: formData.sender.city,
            sender_state_province: formData.sender.state,
            sender_zip_postal: formData.sender.zip,
            sender_country: formData.sender.country,
          },
          receiver: {
            receiver_name: formData.receiver.name,
            receiver_phone: formData.receiver.phone,
            receiver_company: formData.receiver.company,
            receiver_address1: formData.receiver.street,
            receiver_address2: formData.receiver.street2,
            receiver_city: formData.receiver.city,
            receiver_state_province: formData.receiver.state,
            receiver_zip_postal: formData.receiver.zip,
            receiver_country: formData.receiver.country,
          },
          package: {
            package_length: formData.package.length,
            package_width: formData.package.width,
            package_height: formData.package.height,
            package_weight: formData.package.weight,
            package_weight_unit: formData.package.weight_unit,
            package_description: formData.package.description,
            package_reference1: formData.package.reference1,
            package_reference2: formData.package.reference2,
          },
        }),
      }
    );
    // const result = await res.json();

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // // Assuming the image is returned as a base64 string in the response data
    const order = new Order({
      userId,
      service_name: formData.service_name,
      image: Buffer.from(data.data.base64_encoded_image, "base64"), // Assuming API returns a base64 image
      tracking_number: data.data.tracking_number,
      sender: {
        sender_name: formData.sender.name,
        sender_phone: formData.sender.phone,
        sender_company: formData.sender.company,
        sender_address1: formData.sender.street,
        sender_address2: formData.sender.street2,
        sender_city: formData.sender.city,
        sender_state_province: formData.sender.state,
        sender_zip_postal: formData.sender.zip,
        sender_country: formData.sender.country,
      },
      receiver: {
        receiver_name: formData.receiver.name,
        receiver_phone: formData.receiver.phone,
        receiver_company: formData.receiver.company,
        receiver_address1: formData.receiver.street,
        receiver_address2: formData.receiver.street2,
        receiver_city: formData.receiver.city,
        receiver_state_province: formData.receiver.state,
        receiver_zip_postal: formData.receiver.zip,
        receiver_country: formData.receiver.country,
      },
      package: {
        package_length: formData.package.length,
        package_width: formData.package.width,
        package_height: formData.package.height,
        package_weight: formData.package.weight,
        package_weight_unit: formData.package.weight_unit,
        package_description: formData.package.description,
        package_reference1: formData.package.reference1,
        package_reference2: formData.package.reference2,
      },
    });

    await order.save();

    // Send response to frontend
    res.status(201).json({
      message: "Shipment created successfully",
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
});

// Route to fetch shipment services
router.get("/shipment-services", async (req, res, next) => {
  try {
    // Add the API key from environment variable
    const api_Key = process.env.EXPRESS_LABEL_API_KEY;
    // Call external API to fetch services
    const response = await fetch(
      `https://api.labelexpress.io/v1/ups/services?apiKey=${api_Key}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch shipment services: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Send the services as response
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
