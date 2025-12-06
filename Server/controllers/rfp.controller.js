import RFP from "../models/RFP.js";
import { generateJson, parseProposal, analyzeProposals } from "../services/ai.service.js";

import Vendor from "../models/Vendor.js";
import { sendEmail } from "../services/email.service.js";

import { recieveEmail } from "../services/imap.service.js";
import Proposal from "../models/Proposal.js";

export const createRFP = async (req, res) => {
  try {
    const { userRequest } = req.body;

    if (!userRequest) {
      return res.status(400).json({ message: "User request is required" });
    }

    const structuredData = await generateJson(userRequest);

    const newRFP = new RFP({
      userRequest: userRequest,
      jsonData: structuredData,
      status: "Draft",
    });

    await newRFP.save();
    return res
      .status(201)
      .json({ message: "RFP created successfully", rfp: newRFP });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllRFP = async (req, res) => {
  try {
    const rfp = await RFP.find({});
    return res.status(200).json({ rfp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRFPById = async (req, res) => {
  try {
    const { rfpId } = req.params;
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }
    const proposals = await Proposal.find({ rfp: rfpId }).populate('vendor');

    return res.status(200).json({ rfp, proposals });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendRFP = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0) {
      return res.status(404).json({ message: "No vendors found" });
    }

    console.log(
      `Sending RFP to vendors: ${vendors.map((v) => v.email).join(", ")}`
    );

    const emailPromises = vendors.map((vendor) => {
      const subject = `RFP Invitation - Ref:${rfp._id}`;
      const text = `Dear ${vendor.name},\n\nWe are looking to procure:\n\n${rfp.userRequest}\n\nPlease respond by ${rfp.jsonData.deadline}.\n\n(Please keep Ref:${rfp._id} in the subject line)\n\nBest regards,\nProcurement Team`;
      return sendEmail(vendor.email, subject, text);
    });

    await Promise.all(emailPromises);

    rfp.status = "Sent";
    rfp.vendorsSelected = vendorIds;
    await rfp.save();

    console.log(`RFP ${rfp._id} sent to vendors successfully.`);

    return res
      .status(200)
      .json({ message: "RFP sent to vendors successfully", rfp: rfp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkInbox = async (req, res) => {
  try {
    const emails = await recieveEmail();

    const newProposals = [];

    for (const email of emails) {

        const vendor = await Vendor.findOne({ email: email.vendorEmail });

        if (!vendor) {
            console.log(`No vendor found for email: ${email.vendorEmail}`);
            continue;
        }

        const parsedProposal = await parseProposal(email.text);

        if(parsedProposal) {
            const existingProposal = await Proposal.findOne({ 
                rfp: email.rfpId, 
                vendor: vendor._id 
            });

            if (existingProposal) {
                console.log(`Duplicate proposal skipped for Vendor: ${vendor.email}, RFP: ${email.rfpId}`);
                continue;
            }

            const newProposal = new Proposal({
                rfp: email.rfpId,
                vendor: vendor._id,
                rawText: email.text,
                parsedData : {
                    cost : parsedProposal.cost,
                    deliveryTime : parsedProposal.deliveryTime,
                    warranty : parsedProposal.warranty,
                    summary : parsedProposal.summary
                }
            });
            await newProposal.save();
            newProposals.push(newProposal);
        }
    }

    res.status(200).json({ 
        message: `Successfully processed ${newProposals.length} new proposals.`, 
        data: newProposals 
    });

  } catch (error) {
    console.log("Error in checkInbox:", error);
    res.status(500).json({ message: "Error checking inbox", error: error.message });
  }
};

export const getAllProposals = async (req, res) => {
    console.log("getAllProposals HIT");
    try {
        const proposals = await Proposal.find().populate('rfp vendor').sort({ createdAt: -1 });
        console.log(`Fetching all proposals: Found ${proposals.length}`);
        return res.status(200).json({ proposals });
    } catch (error) {
        console.error("Error fetching proposals:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const analyzeRFPProposals = async (req, res) => {

    try {

        const { rfpId } = req.params;

        const rfp = await RFP.findById(rfpId);

        if (!rfp) {
            return res.status(404).json({ message: "RFP not found" });
        }

        const proposals = await Proposal.find({ rfp: rfpId }).populate('vendor');

        if (proposals.length === 0) {
            return res.status(404).json({ message: "No proposals found for this RFP" });
        }

        const uniqueProposalsMap = new Map();
        proposals.forEach(p => {
             uniqueProposalsMap.set(p.vendor._id.toString(), p);
        });
        const uniqueProposals = Array.from(uniqueProposalsMap.values());

        const analysis = await analyzeProposals(rfp, uniqueProposals);

        rfp.analysis = analysis;
        rfp.analyzedProposalCount = uniqueProposals.length;
        await rfp.save();

        return res.status(200).json({  
            message: "Analysis complete", 
            analysis: analysis,
            proposalsCount: proposals.length,
            proposals: proposals
        });

        
    } catch (error) {
        console.log("Error in analyzeRFPProposals:", error);
    }

}