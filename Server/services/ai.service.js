import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateJson = async (userText) => {
  try {
    const prompt = `
            You are a procurement AI assistant. 
      Analyze the user's request and extract structured data.
      
      User Request: "${userText}"

      Output this exact JSON structure:
      {
        "title": "Short summary of the request",
        "budget": Number (or 0 if not specified),
        "currency": "String (Detect from symbol: '$' -> 'USD', '₹' -> 'INR', '€' -> 'EUR'. Default to 'USD' if unsure)",
        "deadline": "String (ISO date or duration)",
        "items": [
          {
            "name": "Item name",
            "quantity": Number,
            "specs": "Any specific details (RAM, Color, etc.)"
          }
        ]
      }`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
};

export const parseProposal = async (emailText) => {
  try {
    const prompt = `
        You are a procurement assistant. Extract structured data from this vendor email.
      
      Email Content: "${emailText}"
      
      Return ONLY valid JSON with these exact keys:
      {
        "cost": Number (Total cost. Example: 24000),
        "deliveryTime": "String (e.g. '7 days' or '2 weeks')",
        "warranty": "String (e.g. '1 year')",
        "summary": "String (Short 10-word summary)"
      }`;

    const respose = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = respose.text;
    return JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
};

export const analyzeProposals = async (rfpData, proposalData) => {
  try {

    const proposalSummaries = proposalData
      .map((p, index) => {
        return `Vendor ${index + 1} (${p.vendor.name}): Cost $${
          p.parsedData.cost
        }, Delivery ${p.parsedData.deliveryTime}, Warranty ${
          p.parsedData.warranty
        }. (ID: ${p.vendor._id})`;
      })
      .join("\n");

    const prompt = `
        You are a Procurement Manager. Evaluate these proposals based on my requirements.

      MY REQUIREMENTS:
      "${rfpData.userRequest}"
      Budget: ${rfpData.jsonData.budget}
      Deadline: ${rfpData.jsonData.deadline}

      VENDOR PROPOSALS:
      ${proposalSummaries}

      TASK:
      Compare them. Pick the best vendor.
      
      OUTPUT JSON ONLY:
      {
        "recommendedVendorId": "The ID of the best vendor from the list above",
        "reasoning": "A clear 2-sentence explanation why they won (e.g. 'Best price and meets deadline').",
        "rankings": [
           { "vendorName": "Name", "score": "Number 1-10", "note": "Short note" }
        ]
      }`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    return JSON.parse(text);

  } catch (error) {
    console.log(error);
  }
};
