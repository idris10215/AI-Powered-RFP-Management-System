import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema( {

    rfp : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RFP",
        required : true
    },
    
    vendor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Vendor",
        required : true
    },
    
    rawText : {
        type : String,
        required : true
    },

    parsedData : {
        cost : Number,
        deliveryTime : String,
        warranty : String,
        summary : String
    },

    messageId: {
        type: String, 
        unique: true
    },

    createdAt : {
        type : Date,
        default : Date.now
    }

});

export default mongoose.model('Proposal', proposalSchema);