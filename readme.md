# AI-Powered RFP Management System

A full-stack intelligent procurement platform designed to **automate the entire Request for Proposal (RFP) lifecycle**.  
This system leverages **Generative AI** to convert natural-language requirements into structured data, manage vendor communications via real email channels, and analyze proposals to recommend the best vendor.

## Submission for Aerchain SDE Assignment

## 🚀 Features

### **1. AI-Driven RFP Creation**
- Converts unstructured text  
  *Example:* “I need 20 MacBooks...”  
- Into structured JSON with specifications, quantities, and constraints.

### **2. Vendor Management**
- Browse through a curated vendor directory.
- Select vendors to invite for the RFP.

### **3. Automated Email Dispatch**
- Sends professional RFP emails via **Nodemailer (SMTP)**.
- Each outgoing mail contains a unique Reference ID for tracking.

### **4. Inbound Reply Parsing**
- Reads a real email inbox using **IMAP (imap-simple)**.
- Matches replies using **subject-line Ref IDs**.
- Extracts pricing/delivery terms using AI models.

### **5. Smart Proposal Analysis**
- Compares vendor proposals.
- Generates a **ranked vendor recommendation** with reasoning.

---

## 🛠️ Tech Stack

### **Frontend**
- React  
- Tailwind CSS  
- Lucide React  
- Axios  

### **Backend**
- Node.js  
- Express.js  

### **Database**
- MongoDB (Mongoose)

### **AI Provider**
- Google Gemini (`gemini-2.5-flash`)

### **Email Services**
- Nodemailer (SMTP)  
- imap-simple + mailparser (IMAP)

---

## ⚙️ Project Setup

### **Prerequisites**
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Gmail account with **App Password** enabled (for SMTP/IMAP)

---

## 1. Environment Variables

Create a `.env` file under `/server`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

EMAIL_USER=your_test_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

## 2. Installation
```bash
cd server
npm install
npm start
```
### Server runs on http://localhost:3000
Frontend

```bash
cd client
npm install
npm run dev
```
### Frontend runs on http://localhost:5173
Seed Dummy Vendor Data (Optional)

```bash
cd server
node seed.js
```

## 📖 Usage Workflow
### 1. Create RFP
- Navigate to New RFP and type a natural language request:

- “I need 50 chairs for the new office, budget $5000.”

- AI converts it into structured JSON.

### 2. Send to Vendors
- Select vendors from the list.

- Click Send.

- Vendors receive a professional RFP email.

### 3. Vendor Reply
- Vendors reply by email with a quote:

- “We can provide these for $4500 in 5 days.”

- ⚠️ They must not change the subject line (contains Ref ID).

### 4. Parse Replies
In Dashboard → Inbox, click:

- Refresh Inbox

- The system: Connects via IMAP

- Fetches new emails

- Matches using Ref ID

- Extracts pricing/delivery using AI

### 5. Analyze Proposals
- On the RFP Details page → click: Analyze Proposals

- AI compares proposals and generates:

- Ranked vendors

- Score reasoning

- Recommended choice


## 🧠 Design Decisions & Assumptions
### 1. Reference ID in Subject Line
- Decision: Add unique Ref:6930... in subject line for tracking.
- Reason: Most reliable way to match inbound replies without a vendor portal.
- Assumption: Vendor won’t modify subject line.

### 2. AI Extraction Strategy
- Decision: Two-step AI processing:

- Structure user's natural text

- Normalize vendor replies into JSON (Cost, Delivery Days)

- Assumption: Vendors mention price + delivery in email body.

### 3. Single-User Scope
- Decision: No multi-tenant auth, focusing on core procurement logic.
- Reason: Matches assignment requirements.



## ⚠️ Known Limitations
- Inbox works on-demand (Refresh Inbox) — no webhook-based real-time sync yet.

- Currency defaults to USD unless otherwise stated.