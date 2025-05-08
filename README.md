# 🧭 Huntro - Job Application Tracker

**Huntro** is a simple and efficient Job Board to help you track your job applications in one place.

You can easily save, manage, and monitor the progress of your job hunt. Built with Nuxt 3, Supabase, and Groq AI, Huntro provides a clean and fast experience for organizing your job search.

🧪 **Try it now** → [https://huntro.netlify.app/](https://huntro.netlify.app/)

---

## 🚀 Features

- Add a job application manually or by providing a job offer URL
- Automatic extraction of:
  - Job title
  - Company name
  - Location
- Manage application status (e.g., Sent, Interview, Declined, Offer)
- Edit and delete applications
- Notes field for each job
- Supabase as the backend database
- Groq API integration for extracting job information

---

## ⚙️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com)
- **Server**: [Supabase](https://supabase.com)
- **AI API**: [Groq AI API](https://groq.com)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Design**: [Nuxt UI](https://ui.nuxt.com) & [TailwindCSS](https://tailwindcss.com)
- **State Management**: [Pinia](https://pinia.vuejs.org)
- **Cheerio & ScraperAPI**: [ScraperAPI](https://www.scraperapi.com)
- **Deployment**: [Netlify](https://www.netlify.com)

---

## 🛠️ Run Locally

```bash
git clone https://github.com/0youri/huntro.git
cd huntro
npm install
```

Create a `.env` file and configure:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
SCRAPERAPI_KEY=your_scraperapi_key
```

Then start the dev server:

```bash
npm run dev
```
