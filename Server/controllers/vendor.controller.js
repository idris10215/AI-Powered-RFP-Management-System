import  Vendor  from "../models/Vendor.js";

export const getAllVendors = async (req, res) => {
    try {

        const vendors = await Vendor.find();
        return res.status(200).json({ vendors });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

