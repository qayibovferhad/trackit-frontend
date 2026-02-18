
export const STEP_CONFIG = {
  personal: [
    { key: "accountType", title: "What type of account?", subtitle: "Choose the option that best describes you" },
    { key: "skills", title: "What is your job title?", subtitle: "Select options to customize your dashboard" },
    { key: "experience", title: "What's your experience level?", subtitle: "Help us tailor your workspace" },
  ],
  company: [
    { key: "accountType", title: "What type of account?", subtitle: "Choose the option that best describes you" },
    { key: "company", title: "Tell us about your company", subtitle: "Help us personalize your experience" },
    { key: "experience", title: "What's your experience level?", subtitle: "Help us tailor your workspace" },
  ],
};



export const ACCOUNT_TYPES = [
  { id: "personal", emoji: "👤", title: "Personal", subtitle: "For freelancers & individuals" },
  { id: "company", emoji: "🏢", title: "Company", subtitle: "For teams & organizations" },
];

export const PERSONAL_SKILLS = [
  "UI/UX Designer", "Developer", "Influencer", "Manager",
  "Marketer", "Founder", "Product Manager", "Data Analyst",
  "Content Creator", "Consultant",
];

export const COMPANY_SECTORS = [
  "Technology", "Finance", "Healthcare", "Education",
  "E-commerce", "Media", "Manufacturing", "Logistics", "Real Estate", "Other",
];

export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

export const EXPERIENCE_LEVELS = [
  { id: "junior", emoji: "👶", title: "Junior", subtitle: "0–2 years of experience" },
  { id: "mid", emoji: "🧑‍💻", title: "Mid-level", subtitle: "2–5 years of experience" },
  { id: "senior", emoji: "🧠", title: "Senior", subtitle: "5+ years of experience" },
  { id: "lead", emoji: "👑", title: "Lead / Director", subtitle: "Managing teams & strategy" },
];