# Huntro - Job Application Tracker

<p align="center">
  <img src="https://0youri.com/backend/uploads/Screenshot_2025_04_28_at_3_41_37_PM_cc74683174.png" alt="Huntro Home" width="45%" />
  <img src="https://0youri.com/backend/uploads/Screenshot_2025_04_28_at_3_37_03_PM_8848f6099a.png" alt="Huntro Job Applications" width="45%" />
</p>

**Huntro** is a simple and efficient Job Board to help you track your job applications in one place.

You can easily save, manage, and monitor the progress of your job hunt. Built with Nuxt 3, Supabase, and Groq AI, Huntro provides a clean and fast experience for organizing your job search.

<p align="center">
  <img src="https://0youri.com/backend/uploads/Screenshot_2025_04_28_at_3_50_47_PM_103f77565f.png" alt="Huntro Job Add" width="45%" />
  <img src="https://0youri.com/backend/uploads/Screenshot_2025_04_28_at_3_51_13_PM_db938f35a3.png" alt="Huntro Job Add" width="45%" />
</p>

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

## 📚 Tech Stack

- **Nuxt 3** (Vue 3 Framework)
- **Pinia** for state management
- **Supabase** (PostgreSQL database and auth)
- **Groq API** (LLM-powered HTML parsing)
- **Nuxt UI & Tailwind CSS** for styling
- **Cheerio & ScraperAPI** for HTML extraction

---

## 🚧 Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/huntro.git
cd huntro
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file and configure:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
SCRAPERAPI_KEY=your_scraperapi_key
```

4. Run the app locally:

```bash
npm run dev
```

---

## 🌐 Deployment

**Deploy to Netlify:**

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Make sure your `nuxt.config.ts` includes:

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify'
  }
})
```

---

## 🛠️ API Routes

- `/api/extractRelevantHtml`: Scrapes and extracts the important HTML parts (title, meta, etc.)
- `/api/groq`: Sends a prompt to Groq API to extract structured job information

---

## 👤 Author

- [0youri](https://github.com/0youri)

Feel free to contribute, suggest improvements, or fork the project! 🚀

