AI-Powered RFP Management System
A full-stack intelligent procurement solution designed to automate the Request for Proposal (RFP) lifecycle. This system uses Generative AI to parse natural language requirements, manage vendor communications via real emails, and analyze incoming proposals to recommend the best vendor.

Submission for Aerchain SDE Assignment

📺 Demo Video
[Link to your Demo Video Here] (Please watch the video for a complete end-to-end walkthrough)

🚀 Features
AI-Driven RFP Creation: Converts unstructured text (e.g., "I need 20 MacBooks...") into structured JSON requirements.

Vendor Management: Select and invite vendors from a curated directory.

Automated Email Dispatch: Sends formatted RFP emails to vendors using Nodemailer.

Inbound Reply Parsing: Listens to real email inboxes via IMAP, matches replies to RFPs using Reference IDs, and extracts pricing/delivery data using AI.

Smart Analysis: Compares multiple vendor proposals and generates a ranked recommendation with reasoning.

🛠️ Tech Stack
Frontend: React, Tailwind CSS, Lucide React, Axios

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

AI Provider: Google Gemini (gemini-2.5-flash)

Email Services: nodemailer (SMTP), imap-simple & mailparser (IMAP)

⚙️ Project Setup
Prerequisites
Node.js (v18+)

MongoDB (Local or Atlas URI)

A Gmail account with App Password enabled (for IMAP/SMTP).

1. Environment Variables
Create a .env file in the server directory with the following credentials:

Code snippet

PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

# Email Configuration (Gmail App Password Required)
EMAIL_USER=your_test_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
2. Installation
Backend:

Bash

cd server
npm install
npm start
# Server runs on http://localhost:3000
Frontend:

Bash

cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
3. Seed Data (Optional)
To populate the database with dummy vendors:

Bash

cd server
node seed.js
📖 Usage Workflow
Create RFP: Go to "New RFP" and type a request (e.g., "I need 50 chairs for the new office, budget $5000").

Send to Vendors: Select vendors from the list and hit "Send". Check your Vendor Email Inbox to see the arrival.

Vendor Reply: From the Vendor Email, click Reply and type a quote (e.g., "We can provide these for $4500 in 5 days"). Do not change the Subject Line.

Parse Replies: Go to the Inbox page in the Dashboard and click "Refresh Inbox". The system will fetch the email and extract the data.

Analyze: Go to the RFP Details page and click "Analyze Proposals" to see the AI recommendation.

📡 API Documentation
RFP Endpoints
POST /api/rfp: Create a new RFP from natural language.

GET /api/rfp: Get all RFPs (Drafts & Sent).

POST /api/rfp/send: Send RFP emails to selected vendors.

GET /api/rfp/check-inbox: Trigger IMAP fetch to parse new email replies.

GET /api/rfp/:id/analysis: Compare proposals and get AI recommendation.

Vendor Endpoints
GET /api/vendors: List all available vendors.

🧠 Design Decisions & Assumptions
1. The "Ref ID" Architecture
Decision: I appended a unique Reference ID (Ref:6930...) to the email subject line when sending RFPs.

Reasoning: This is the most reliable way to link an unstructured inbound email back to a specific database record without forcing vendors to use a portal.

Assumption: Vendors will not modify the Subject line when replying.

2. AI Extraction Strategy
Decision: I used a two-step AI process. First, to structure the user's request. Second, to "clean" the vendor's messy email text into standardized JSON (Cost, Delivery Days).

Assumption: Vendors provide pricing and delivery terms in the email body.

3. Single-User Scope
Decision: As per the assignment guidelines, I focused on a single-user experience and did not implement multi-tenant authentication to prioritize the core procurement logic.

🤖 AI Tools Usage
Gemini Code Assist & ChatGPT: Used to scaffold the React frontend components (Tailwind layouts) and debug the IMAP connection logic.

Impact: Significantly accelerated the development of the UI and helped troubleshoot the complex MIME parsing required for reading raw emails.

Prompts: Used prompts like "Create a React sidebar component using Lucide icons" and "How to extract a specific regex pattern from an email subject line in Node.js".

Known Limitations
The system currently polls for emails only when "Refresh Inbox" is clicked (on-demand) rather than using webhooks.

It assumes the currency is USD unless specified otherwise.