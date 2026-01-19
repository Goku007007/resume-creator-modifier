// Resume JSON Schema Types

export interface ProfileMeta {
  profileName: string;
  resumeName: string;
  updatedAt: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface Basics {
  name: string;
  email: string;
  phone: string;
  links: Link[];
  locationLine?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SkillsSection {
  heading: string;
  groups: SkillGroup[];
}

export interface Experience {
  company: string;
  location: string;
  title: string;
  start: string;
  end: string | null;
  description?: string;
  bullets: string[];
  tech?: string[];
}

export interface Project {
  name: string;
  link?: string;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  dates?: string;
}

export interface SummarySection {
  visible: boolean;
  content: string;
  heading?: string;
}

export interface Sections {
  summary?: SummarySection;
  skills: SkillsSection;
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

export interface RenderingConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  monoFontFamily: string;
  pageSize: 'LETTER' | 'A4';
  density: 'COMPACT' | 'NORMAL' | 'SPACIOUS';
  format?: 'classic' | 'russell';
}

export interface ResumeJSON {
  profileMeta: ProfileMeta;
  basics: Basics;
  sections: Sections;
  rendering: RenderingConfig;
}

// Default resume data
export const DEFAULT_RESUME: ResumeJSON = {
  profileMeta: {
    profileName: "Full-Stack",
    resumeName: "Gokul_Nandakumar_Resume_FullStack",
    updatedAt: new Date().toISOString(),
  },
  basics: {
    name: "Gokul Nandakumar",
    email: "goku.careers@gmail.com",
    phone: "+1 (773) 930 2964",
    links: [
      { label: "Portfolio", url: "https://gokuldata.vercel.app/" },
      { label: "GitHub", url: "https://github.com/Goku007007" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/gokul-nandakumar/" },
    ],
    locationLine: "",
  },
  sections: {
    summary: {
      visible: true,
      content: "Founding-minded Full-Stack Engineer focused on data pipelines, AI-driven systems, and high-stakes user workflows; experienced owning ambiguous, production-critical platforms end-to-end."
    },
    skills: {
      heading: "Skills",
      groups: [
        { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3"] },
        { label: "Frontend", items: ["React", "Next.js", "Angular", "Recharts", "Chart.js", "Tailwind CSS"] },
        { label: "Backend", items: ["Python (Django, FastAPI, Flask)", "Node.js (Express)", "RESTful APIs", "Microservices"] },
        { label: "Db", items: ["PostgreSQL", "Redis", "MySQL", "MongoDB", "Query Optimization", "Schema Design"] },
        { label: "Cloud & DevOps", items: ["Azure", "AWS", "Docker", "CI/CD", "GitHub Actions"] },
        { label: "Tools", items: ["Git", "pytest", "Jest", "Selenium", "Webhooks", "OAuth"] },
        { label: "Cert", items: ["AWS Certified Solutions Architect - Associate"] },
        { label: "AI - Assisted Dev & API", items: ["Cursor", "Claude Code", "ChatGPT-Cli-or-Codex", "Antigravity", "LLM and Vid Gen APIs"] },
      ],
    },
    experience: [
      {
        company: "ChiEAC",
        location: "Chicago, IL (Remote)",
        title: "Software Engineer",
        start: "Jun 2025",
        end: null,
        bullets: [
          "Built AI document processing features using React, Python (FastAPI), and Claude API, reducing manual data entry time by 66% (6h → 2h) by automating transit report classification and extraction for 3 city departments",
          "Developed analytics dashboard with React and TypeScript displaying real-time KPIs from Azure Synapse and PostgreSQL to standardize 12 metrics used by executive leadership and reduce query times by 40%",
          "Implemented RESTful API endpoints using FastAPI and deployed with Docker on Azure, eliminating weekly manual report generation for operations team while maintaining 99.5% uptime through error handling and retry logic",
          "Designed ETL pipelines using Airflow and Delta Lake to process daily transit data feeds, working with senior engineer to establish CI/CD workflows via GitHub Actions that cut deployment time from 2 hours to 30 minutes",
        ],
        tech: ["Python", "FastAPI", "React", "TypeScript", "Azure", "Docker", "Airflow"],
      },
      {
        company: "ISQL Global",
        location: "Remote",
        title: "Software Engineer",
        start: "Oct 2022",
        end: "Jul 2023",
        bullets: [
          "Built CRM features for roofing contractors using Angular frontend and Django REST backend, reducing customer quote generation time by streamlining workflow forms and optimizing PostgreSQL queries for 2,000+ monthly quotes",
          "Implemented automated testing and CI/CD pipelines using GitHub Actions and Docker, ensuring 99.9% data quality reliability and enabling rapid deployment of schema changes across microservices architecture",
          "Integrated Google Maps Geocoding API for address validation, Stripe for payment processing, and Twilio for SMS notifications, reducing manual address corrections and payment follow ups by 15 hours/week",
          "Optimized slow running database queries by adding indexes and implementing Redis caching for session data, improving page load times by 35% and reducing AWS RDS costs by 15% through connection pooling",
        ],
        tech: ["Angular", "Django", "PostgreSQL", "Redis", "Docker", "GitHub Actions"],
      },
      {
        company: "Out In Dreams",
        location: "Remote",
        title: "Software Engineer",
        start: "Sep 2021",
        end: "Oct 2022",
        bullets: [
          "Built payment automation system using Python and Stripe Connect API, eliminating manual spreadsheet based payments for influencers and reducing finance team workload by 20 hours/week through automated payout and it helps reducing payment errors for $87K+ annual payouts",
          "Created analytics dashboard using Next.js and Chart.js that pulled data from Google Ads and Instagram APIs, giving marketing team unified view of campaign performance and reducing manual report",
          "Optimized PostgreSQL queries and analyzed creator engagement data to identify retention opportunities, resulting in 18% improvement in quarter-over-quarter retention through data driven feature prioritization",
        ],
        tech: ["Python", "Next.js", "Chart.js", "PostgreSQL", "Stripe"],
      },
    ],
    projects: [
      {
        name: "National EV Charging Infrastructure Analytics",
        link: "https://github.com/Goku007007/ev-charger-uptime-snapshot",
        bullets: [
          "Developed a data ingestion and analytics platform for 83k+ EV charging station records, utilizing (GCS) and BigQuery",
          "Deployed an interactive dashboard to visualize network coverage gaps, processing large scale geospatial data to identify underserved regions.",
        ],
      },
      {
        name: "GPU Cluster Telemetry & Observability System",
        link: "https://github.com/Goku007007/gpu-telemetry-lakehouse",
        bullets: [
          "Built a scalable observability platform using Python and DuckDB to monitor GPU cluster performance, ingesting 10M+ trace rows for granular utilization tracking.",
          "Implemented an IsolationForest machine learning model to detect abnormal cluster behavior, reducing false alerts",
        ],
      },
    ],
    education: [
      { school: "Illinois Institute of Technology", degree: "Master of Information Technology" },
      { school: "SREC", degree: "Bachelor of Computer Science and Engineering" },
    ],
  },
  rendering: {
    fontFamily: "Calibri",
    fontSize: 10,
    lineHeight: 1.3,
    monoFontFamily: "Geist Mono, Andale Mono, monospace",
    pageSize: "LETTER",
    density: "COMPACT",
    format: "russell",
  },
};
