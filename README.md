# AI Meeting Summarizer

A full-stack application that uses AI to summarize meeting transcripts and share them via email.

## Features

- **Transcript Upload**: Upload text files or paste meeting transcripts
- **AI Summarization**: Generate structured summaries using Groq Llama API
- **Custom Prompts**: Specify how you want the summary formatted
- **Editable Summaries**: Edit AI-generated summaries before sharing
- **Email Sharing**: Send summaries to multiple recipients
- **Data Persistence**: Store summaries in MongoDB

## Tech Stack

- **Frontend**: Next.js with App Router, React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **AI API**: Groq Llama 3 8B model
- **Database**: MongoDB
- **Email**: Nodemailer with Gmail SMTP

## Usage

1. **Upload Transcript**: Upload a .txt file or paste meeting notes
2. **Set Instructions**: Choose a template or write custom prompt
3. **Generate Summary**: Click "Generate Summary" to get AI summary
4. **Edit (Optional)**: Modify the summary as needed
5. **Share**: Add email recipients and send the summary

---
## Upload Transcript

<img width="1262" height="935" alt="image" src="https://github.com/user-attachments/assets/a29afa9f-2f74-4e49-80f0-7658e7ba4217" />

---
## Set Instructions & Generate Summary

<img width="1258" height="467" alt="image" src="https://github.com/user-attachments/assets/5db3ecac-62ea-4bb0-9b1f-ba27321786cb" />

---
## Edit 

<img width="1222" height="842" alt="image" src="https://github.com/user-attachments/assets/bfdd14a3-b83d-4376-9c10-c93dea1d8f6d" />

---
## Email Sharing

<img width="1278" height="531" alt="image" src="https://github.com/user-attachments/assets/da3abd98-0d33-431d-996b-d0effc2d61a4" />

---

<img width="817" height="371" alt="image" src="https://github.com/user-attachments/assets/2b9944ba-fe7f-4e5c-ae40-d76e6ea87962" />

---

<img width="1723" height="47" alt="image" src="https://github.com/user-attachments/assets/383fc144-a5ca-4eda-b94b-02622f943d92" />

---

<img width="1716" height="760" alt="image" src="https://github.com/user-attachments/assets/f3b2d4ae-e74e-44c7-967d-97ab46f88a64" />

---

## Saving to MongoDB

---

<img width="1221" height="302" alt="image" src="https://github.com/user-attachments/assets/c4cb1f93-9fb3-4b50-b107-2cf4773ad709" />

---

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.local.example` to `.env.local` and fill in:
   
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   MONGODB_URI=your_mongodb_connection_string_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   ```

3. **Get Required API Keys**
   
   **Groq API Key:**
   - Go to [console.groq.com](https://console.groq.com)
   - Create account and generate API key
   - Add to `GROQ_API_KEY` in `.env.local`
   
   **MongoDB:**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster and get connection string
   - Add to `MONGODB_URI` in `.env.local`
   
   **Email (Gmail):**
   - Use your Gmail address for `EMAIL_USER`
   - Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Add App Password to `EMAIL_PASSWORD` in `.env.local`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/generate-summary` - Generate AI summary from transcript
- `POST /api/save-summary` - Save summary to database
- `PUT /api/save-summary` - Update existing summary
- `POST /api/send-email` - Send summary via email

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main application
├── components/        # React components
│   ├── TranscriptUpload.tsx
│   ├── SummaryGenerator.tsx
│   ├── SummaryEditor.tsx
│   └── EmailSharer.tsx
├── lib/               # Utility libraries
│   ├── mongodb.ts     # Database connection
│   ├── groq.ts        # AI API client
│   └── email.ts       # Email service
└── components/ui/     # shadcn/ui components
```

## Deployment

Deployable on Vercel (frontend + API routes) with MongoDB Atlas and Gmail SMTP.
