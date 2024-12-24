const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // Ensure userId is provided
    },
    service_name: {
      type: String,
      required: [true, "Service name is required"], // Ensure serviceName is provided
      trim: true, // Trim any leading/trailing spaces
    },
    tracking_number: {
      type: String,
      required: [true, "tracking number is required"],
    },
    sender: {
      sender_name: {
        type: String,
        required: [true, "Sender name is required"],
        trim: true, // Trim leading/trailing spaces
      },
      sender_phone: {
        type: String,
        required: [true, "Sender phone is required"],
        trim: true,
      },
      sender_company: {
        type: String,
        trim: true,
      },
      sender_address1: {
        type: String,
        required: [true, "Sender address1 is required"],
        trim: true,
      },

      sender_address2: {
        type: String,
        trim: true,
      },
      sender_city: {
        type: String,
        required: [true, "Sender city is required"],
        trim: true,
      },
      sender_state_province: {
        type: String,
        required: [true, "Sender state/province is required"],
        trim: true,
      },
      sender_zip_postal: {
        type: String,
        required: [true, "Sender zip/postal code is required"],
        trim: true,
      },
      sender_country: {
        type: String,
        required: [true, "Sender country is required"],
        trim: true,
      },
    },
    receiver: {
      receiver_name: {
        type: String,
        required: [true, "Receiver name is required"],
        trim: true,
      },
      receiver_phone: {
        type: String,
        required: [true, "Receiver phone is required"],
        trim: true,
      },
      receiver_company: {
        type: String,
        trim: true,
      },
      receiver_address1: {
        type: String,
        required: [true, "Receiver address1 is required"],
        trim: true,
      },
      receiver_address2: {
        type: String,
        trim: true,
      },
      receiver_city: {
        type: String,
        required: [true, "Receiver city is required"],
        trim: true,
      },
      receiver_state_province: {
        type: String,
        required: [true, "Receiver state/province is required"],
        trim: true,
      },
      receiver_zip_postal: {
        type: String,
        required: [true, "Receiver zip/postal code is required"],
        trim: true,
      },
      receiver_country: {
        type: String,
        required: [true, "Receiver country is required"],
        trim: true,
      },
    },
    package: {
      package_length: {
        type: String,
        required: [true, "Package length is required"],
        trim: true,
      },
      package_width: {
        type: String,
        required: [true, "Package width is required"],
        trim: true,
      },
      package_height: {
        type: String,
        required: [true, "Package height is required"],
        trim: true,
      },
      package_weight: {
        type: String,
        required: [true, "Package weight is required"],
        trim: true,
      },
      package_weight_unit: {
        type: String,
        required: [true, "Package weight unit is required"],
        trim: true,
      },
      package_description: {
        type: String,
        required: [true, "Package description is required"],
        trim: true,
      },
      package_reference1: {
        type: String,
        trim: true,
      },
      package_reference2: {
        type: String,
        trim: true,
      },
    },
    image: {
      type: Buffer,
      required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
