import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema( {

    userRequest : {
        type : String,
        required : true
    },

    jsonData : {
        title: String,
        budget: Number,
        currency: String,
        items :[{
            name : String,
            quantity : Number,
            specs : String
        }],
        deadline : String
    },

    analysis: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    analyzedProposalCount: {
        type: Number,
        default: 0
    },

    status : {
        type : String,
        enum : ["Draft", "Sent", "Closed"],
        default : "Draft"
    },

    vendorsSelected : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Vendor"
    }],

    createdAt : {
        type : Date,
        default : Date.now
    }

});


export default mongoose.model('RFP', rfpSchema);