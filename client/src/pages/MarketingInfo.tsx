import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Cpu,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useEffect, type ComponentType } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Home/Footer";
import Navbar from "../components/Home/Navbar";

export type MarketingPageKey =
  | "about"
  | "blog"
  | "careers"
  | "contact"
  | "privacy"
  | "terms"
  | "security"
  | "cookies";

type Stat = {
  label: string;
  value: string;
};

type ContentCard = {
  title: string;
  description: string;
  meta?: string;
};

type ContentSection = {
  title: string;
  body: string;
  bullets?: string[];
};

type PageContent = {
  badge: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  updated: string;
  stats: Stat[];
  cardsTitle: string;
  cards: ContentCard[];
  sections: ContentSection[];
  ctaLabel: string;
  ctaTo: string;
};

const companyContact = {
  email: "team.profilex7786@gmail.com",
  phone: "+91 8960717110",
  location: "Noida Sector 5, Uttar Pradesh, India",
};

const sidebarChecklists: Record<MarketingPageKey, { title: string; items: string[] }> = {
  about: {
    title: "Core Platform Capabilities",
    items: [
      "AI Captions & Tone Customization",
      "Unified Multi-Channel Calendar",
      "Real-Time Account Health Monitoring",
      "Automated Post Scheduling & Drafts",
    ],
  },
  blog: {
    title: "Editorial & Publishing Standards",
    items: [
      "Tested Campaign Strategy Guides",
      "Practical AI Prompt Engineering",
      "Actionable Operational Checklists",
      "Weekly Fresh Content & Case Studies",
    ],
  },
  careers: {
    title: "Why Work at Sociora",
    items: [
      "Remote-First & Async Culture",
      "Competitive Growth & Perks",
      "Modern React, Node & AI Stack",
      "High Autonomy & Direct Impact",
    ],
  },
  contact: {
    title: "Support & Engagement SLA",
    items: [
      "24-Hour Response Guarantee",
      "Dedicated Support Engineering",
      "Guided Sales Walkthroughs",
      "Community & Partner Program",
    ],
  },
  privacy: {
    title: "Privacy & Data Protection",
    items: [
      "Strict User-First Data Handling",
      "Encrypted Sensitive Transport",
      "No Sale of Customer Information",
      "Easy Account & Data Export",
    ],
  },
  terms: {
    title: "Service & Account Guarantees",
    items: [
      "User Ownership of Created Content",
      "Fair & Transparent Usage Policies",
      "High Platform Uptime Commitment",
      "Proactive Customer Support",
    ],
  },
  security: {
    title: "Security & Infrastructure",
    items: [
      "TLS Encryption in Transit",
      "Scoped Integration Tokens",
      "Continuous Automated Audits",
      "Strict Access Control Policies",
    ],
  },
  cookies: {
    title: "Cookie Control Principles",
    items: [
      "Essential Login Session Support",
      "Optional Product Analytics Choices",
      "Browser Level Granular Control",
      "No Invasive Cross-Site Tracking",
    ],
  },
};

const sectionDescriptions: Record<MarketingPageKey, string> = {
  about:
    "Sociora is built to simplify the complex realities of modern multi-channel social media management. From strategic campaign drafting to automated publishing, unified calendar views, and real-time account health monitoring, our platform gives creator teams and growing agencies total clarity, control, and consistency over their online presence.",
  blog:
    "Explore practical strategy blueprints, deep-dive AI prompt frameworks, channel-specific publishing guides, and operational workflows written by social creators for social creators. Our articles break down repeatable habits to help you plan campaigns faster without sacrificing authenticity or brand voice.",
  careers:
    "Join a passionate, remote-first team dedicated to building software that makes social media planning calm, intelligent, and delightfully efficient. We value high autonomy, thoughtful design, clean architecture, and continuous learning as we craft the next generation of social creator tools.",
  contact:
    "Whether you have product questions, need a guided demo for your agency, want to explore integration partnerships, or require technical workspace support, the Sociora team is here to assist. Reach out through any of our channels below for responsive, expert guidance.",
  privacy:
    "Your data privacy, account security, and content ownership are central to how we design Sociora. Learn how we handle your information, safeguard social platform OAuth tokens, maintain encrypted storage, and uphold strict user-first privacy standards across all our services.",
  terms:
    "Review the terms, acceptable use standards, content ownership policies, and service guarantees that govern your use of the Sociora workspace. We are committed to fair, transparent policies that protect your creative work and ensure reliable platform performance.",
  security:
    "Discover our multi-layered infrastructure security, encrypted token management, automated compliance checks, and secure multi-account authorization protocols designed to keep your social channels and team credentials safe at all times.",
  cookies:
    "Understand how Sociora uses essential session cookies and optional interface preferences to deliver a seamless, secure user experience. We give you transparent control over your browser data without invasive tracking or third-party data selling.",
};

const headerHighlights: Record<
  MarketingPageKey,
  Array<{ title: string; desc: string; theme: "orange" | "teal" | "amber" }>
> = {
  about: [
    { title: "🎯 Built for Creators", desc: "Tailored for multi-channel social teams and growing agencies", theme: "orange" },
    { title: "🤖 Responsible AI", desc: "Enhances your voice with AI caption drafting & tone control", theme: "teal" },
    { title: "⚡ Unified Command", desc: "All channels, calendars, and drafts in one sleek workspace", theme: "amber" },
  ],
  blog: [
    { title: "📚 Tested Frameworks", desc: "Real-world campaign strategies proven across active brands", theme: "orange" },
    { title: "💡 AI Prompting Guides", desc: "Actionable prompts for captions, hooks, and content ideas", theme: "teal" },
    { title: "📈 Weekly Insights", desc: "Fresh breakdown of social algorithms and publishing ops", theme: "amber" },
  ],
  careers: [
    { title: "🌍 Remote-First", desc: "Work asynchronously with high trust and flexible schedule", theme: "orange" },
    { title: "🚀 High Impact", desc: "Direct ownership of core AI features used by thousands", theme: "teal" },
    { title: "🌱 Growth & Equity", desc: "Competitive compensation, learning stipends, and perks", theme: "amber" },
  ],
  contact: [
    { title: "💬 Fast SLA Response", desc: "Dedicated email & phone support within 24 business hours", theme: "orange" },
    { title: "🤝 Guided Demos", desc: "1-on-1 walkthroughs tailored for agencies & business teams", theme: "teal" },
    { title: "🛠️ Support Engineers", desc: "Direct access to our technical team for workspace setup", theme: "amber" },
  ],
  privacy: [
    { title: "🔒 Zero Data Sale", desc: "We never sell or monetize your personal or workspace data", theme: "orange" },
    { title: "🔑 OAuth Security", desc: "Social tokens stored with bank-grade AES-256 encryption", theme: "teal" },
    { title: "📋 Full Data Control", desc: "Export or purge your content and account details anytime", theme: "amber" },
  ],
  terms: [
    { title: "🎨 100% User Owned", desc: "You retain full legal ownership of all created content", theme: "orange" },
    { title: "⚖️ Fair Use Standard", desc: "Transparent usage limits designed for creators & teams", theme: "teal" },
    { title: "⏱️ High Uptime SLA", desc: "Reliable platform infrastructure & active uptime monitoring", theme: "amber" },
  ],
  security: [
    { title: "🔐 TLS 1.3 Transport", desc: "End-to-end encryption for all API & workspace traffic", theme: "orange" },
    { title: "🛡️ Scoped Access", desc: "Least-privilege OAuth tokens for social platform safety", theme: "teal" },
    { title: "🤖 Automated Audits", desc: "Continuous vulnerability scanning and patch management", theme: "amber" },
  ],
  cookies: [
    { title: "🔑 Essential Session", desc: "Required only for secure authentication & app navigation", theme: "orange" },
    { title: "🎛️ Granular Control", desc: "Easily toggle optional preference & analytics cookies", theme: "teal" },
    { title: "🚫 No Invasive Tracking", desc: "Zero cross-site ad networks or invasive tracking scripts", theme: "amber" },
  ],
};

const pages: Record<MarketingPageKey, PageContent> = {
  about: {
    badge: "Company",
    title: "Sociora is built to make social media work feel organized, fast, and real.",
    description:
      "Sociora helps creators, small businesses, agencies, and startup teams plan campaigns, generate AI-assisted captions, manage connected accounts, and schedule posts from one clean workspace.",
    icon: Users,
    updated: "Company profile updated July 2026",
    stats: [
      { value: "2026", label: "Product launch year" },
      { value: "Noida", label: "Product operations base" },
      { value: "AI + calendar", label: "Core product focus" },
    ],
    cardsTitle: "What Sociora is built around",
    cards: [
      {
        title: "AI content generation",
        description:
          "Turn one campaign idea into captions, hooks, rewrite options, and platform-ready post drafts while keeping the final creative control with your team.",
      },
      {
        title: "Scheduling and planning",
        description:
          "Plan posts by date, platform, status, and media so your content calendar is visible before anything goes live.",
      },
      {
        title: "Account clarity",
        description:
          "Keep connected social profiles, scheduled posts, generated drafts, and workspace activity in one place instead of jumping between tools.",
      },
      {
        title: "Multi-platform sync",
        description:
          "Manage Instagram, LinkedIn, Facebook, and X content from one central command center with live status and account health checks.",
      },
    ],
    sections: [
      {
        title: "Our mission",
        body:
          "Modern creators and businesses need consistent social content, but the work often gets scattered across notes, WhatsApp messages, design folders, spreadsheets, and platform tabs. Sociora exists to make that daily workflow simpler. The product brings planning, AI drafting, account management, and scheduling into one responsive application so even a small team can operate with professional discipline.",
      },
      {
        title: "How we think about AI",
        body:
          "Sociora treats AI as a creative assistant, not a replacement for judgment. The product is designed to help teams get from blank page to strong first draft faster, then review, refine, and publish with context. Brand voice, timing, and final approval stay with the user.",
        bullets: [
          "Generate multiple post directions from one campaign idea.",
          "Adapt copy for LinkedIn, Instagram, X, Facebook, and other channels.",
          "Keep scheduling and publishing decisions visible to the team.",
          "Maintain brand voice consistency and human approval before publishing.",
        ],
      },
      {
        title: "Who we serve",
        body:
          "Sociora is built for solo creators who need consistency, local businesses that want a reliable posting routine, startups that need repeatable marketing execution, and agencies that manage multiple client voices. The experience is intentionally direct: fewer moving parts, clearer publishing status, and enough structure to keep campaigns moving.",
      },
    ],
    ctaLabel: "Start using Sociora",
    ctaTo: "/login",
  },
  blog: {
    badge: "Blog",
    title: "Ideas for smarter social planning, AI drafting, and publishing.",
    description:
      "Read practical notes from the Sociora team on campaign planning, creative workflows, social operations, and the way AI is changing content teams.",
    icon: Newspaper,
    updated: "Latest editorial update July 2026",
    stats: [
      { value: "4", label: "Featured articles" },
      { value: "10 min", label: "Average read time" },
      { value: "Weekly", label: "Publishing rhythm" },
    ],
    cardsTitle: "Featured posts",
    cards: [
      {
        title: "How to plan a month of content without making it feel repetitive",
        meta: "Strategy - 8 min read",
        description:
          "A practical framework for turning one campaign theme into educational, promotional, community, and behind-the-scenes posts across multiple channels.",
      },
      {
        title: "Using AI drafts without losing your brand voice",
        meta: "AI workflow - 6 min read",
        description:
          "How to write better briefs, review generated captions, and build a repeatable editing pass that keeps content recognizably yours.",
      },
      {
        title: "The publishing queue every small team should maintain",
        meta: "Operations - 9 min read",
        description:
          "A breakdown of draft, review, scheduled, published, and archived states, plus the handoff signals that prevent missed posts.",
      },
      {
        title: "What to measure after a campaign goes live",
        meta: "Analytics - 7 min read",
        description:
          "A simple approach to reading engagement, reach, timing, comments, and qualitative feedback after your posts are published.",
      },
    ],
    sections: [
      {
        title: "Editorial focus",
        body:
          "The Sociora blog is written for people who actually ship content. Instead of abstract marketing theory, the focus is on planning rituals, creative prompts, review systems, and small operational habits that help teams publish consistently.",
        bullets: [
          "Practical campaign frameworks over theoretical guides.",
          "Step-by-step AI prompt engineering for social copy.",
          "Operational rituals for high-velocity content teams.",
          "Data-driven insights after posts go live.",
        ],
      },
      {
        title: "Topics we cover",
        body:
          "Our writing follows the same problems Sociora solves inside the product: moving from idea to draft, from draft to approved post, and from approved post to a visible publishing calendar.",
        bullets: [
          "Campaign planning and content calendars.",
          "Responsible AI-assisted writing workflows.",
          "Platform-specific copy, timing, and review habits.",
          "Team collaboration for agencies and startups.",
        ],
      },
    ],
    ctaLabel: "Create your first campaign",
    ctaTo: "/login",
  },
  careers: {
    badge: "Careers",
    title: "Build the workspace that makes social teams faster and calmer.",
    description:
      "Sociora is growing a product-minded team around design, engineering, AI workflows, and customer success. We care about useful software, clear communication, and ownership.",
    icon: BriefcaseBusiness,
    updated: "Open roles updated July 2026",
    stats: [
      { value: "Remote", label: "Team operating style" },
      { value: "4", label: "Example open roles" },
      { value: "Async", label: "Default collaboration" },
    ],
    cardsTitle: "Open roles",
    cards: [
      {
        title: "Frontend Engineer",
        meta: "Product Engineering - Full time",
        description:
          "Build fast, polished React experiences for scheduling, AI drafting, account management, and campaign reporting.",
      },
      {
        title: "AI Product Designer",
        meta: "Design - Full time",
        description:
          "Shape the interaction patterns that make AI-generated content easy to guide, review, compare, and publish.",
      },
      {
        title: "Customer Success Specialist",
        meta: "Go-to-market - Full time",
        description:
          "Help creators, agencies, and startup teams set up workspaces, connect accounts, and build repeatable publishing routines.",
      },
      {
        title: "Content Marketing Lead",
        meta: "Marketing - Contract or full time",
        description:
          "Own Sociora's editorial calendar, product education, launch content, and practical resources for social media teams.",
      },
    ],
    sections: [
      {
        title: "How we work",
        body:
          "Sociora values people who can move from ambiguity to a shipped improvement. We keep meetings purposeful, write decisions down, and prefer small, finished product increments over long internal presentations.",
        bullets: [
          "Remote-friendly collaboration with clear ownership.",
          "Respect for focused work and thoughtful review.",
          "High standards for user experience and product reliability.",
          "Competitive growth, autonomy, and modern tooling.",
        ],
      },
      {
        title: "Hiring process",
        body:
          "Candidates can expect a short intro conversation, a practical work discussion, and a final team interview. For technical and design roles, the exercise is scoped to mirror real Sociora work rather than trivia.",
        bullets: [
          "Initial intro conversation & role alignment (20 mins).",
          "Practical work discussion based on real scenarios.",
          "Technical or design exercise scoped to actual product tasks.",
          "Final team interview & competitive offer proposal.",
        ],
      },
    ],
    ctaLabel: "Contact hiring team",
    ctaTo: "/contact",
  },
  contact: {
    badge: "Contact",
    title: "Talk to Sociora about support, sales, partnerships, or hiring.",
    description:
      "Reach the Sociora team for product questions, account help, sales conversations, partnerships, hiring, or general support. We aim to respond to most messages within one business day.",
    icon: Mail,
    updated: "Contact details updated July 2026",
    stats: [
      { value: "24 hrs", label: "Typical first response" },
      { value: "Mon-Fri", label: "Support coverage" },
      { value: "IST", label: "Primary team timezone" },
    ],
    cardsTitle: "Contact channels",
    cards: [
      {
        title: "Product support",
        meta: "Support Channel",
        description:
          "For login issues, connected account questions, scheduling help, billing concerns, and workspace troubleshooting.",
      },
      {
        title: "Sales and demos",
        meta: "Sales & Growth",
        description:
          "For creators, agencies, and businesses that want a guided walkthrough or help choosing the right workflow.",
      },
      {
        title: "Partnerships",
        meta: "Partnerships & Press",
        description:
          "For integration ideas, community collaborations, affiliate discussions, and co-marketing opportunities.",
      },
      {
        title: "Careers",
        meta: "Hiring & Talent",
        description:
          "For open roles, speculative applications, internships, and recruiting conversations.",
      },
    ],
    sections: [
      {
        title: "Office and correspondence",
        body:
          "Sociora operates as a remote-friendly software product team with product and support coverage centered around India Standard Time. Business correspondence and hiring conversations can be addressed to the Sociora team in Noida Sector 5, Uttar Pradesh, India.",
        bullets: [
          `Email: ${companyContact.email}`,
          `Phone: ${companyContact.phone}`,
          `Location: ${companyContact.location}`,
          `Hours: Mon - Fri (9:00 AM - 6:00 PM IST)`,
        ],
      },
      {
        title: "What to include",
        body:
          "For the fastest answer, include your workspace email, the social platform involved, screenshots when relevant, and the action you were trying to complete. For sales or partnership requests, include your company name and expected team size.",
        bullets: [
          "Your active workspace email & connected social account name.",
          "Specific platform involved (Instagram, LinkedIn, X, Facebook).",
          "Relevant screenshots or error codes if troubleshooting.",
          "Company name & expected team size for sales or demos.",
        ],
      },
    ],
    ctaLabel: "Open the app",
    ctaTo: "/login",
  },
  privacy: {
    badge: "Legal",
    title: "Privacy Policy",
    description:
      "This policy explains what Sociora collects, why we collect it, how we use it, and the choices available to people who use the product.",
    icon: FileText,
    updated: "Effective July , 2026",
    stats: [
      { value: "User-first", label: "Data handling principle" },
      { value: "Encrypted", label: "Sensitive transport" },
      { value: "Exportable", label: "Account data approach" },
    ],
    cardsTitle: "Privacy commitments",
    cards: [
      {
        title: "We collect what the product needs",
        description:
          "Sociora uses account, workspace, post, scheduling, and connected-platform data to provide the service and improve reliability.",
      },
      {
        title: "You control connected accounts",
        description:
          "Users can connect or disconnect social channels. Platform tokens are used only to perform requested actions like scheduling or publishing.",
      },
      {
        title: "We do not sell personal data",
        description:
          "Sociora does not sell customer personal information. Limited service providers may process data only to operate the product.",
      },
      {
        title: "Transparent data retention",
        description:
          "Workspace content and account tokens are retained only as long as active, with easy deletion options when you close your account.",
      },
    ],
    sections: [
      {
        title: "Information we collect",
        body:
          "We collect information you provide directly, such as name, email address, workspace settings, content drafts, scheduled posts, and support messages. We also collect technical information such as browser type, device information, IP address, log events, and product usage signals that help us keep the service reliable.",
      },
      {
        title: "How we use information",
        body:
          "Sociora uses information to authenticate users, operate workspaces, generate content when requested, schedule posts, provide support, prevent abuse, improve product quality, and communicate important service updates.",
      },
      {
        title: "Sharing and retention",
        body:
          "We share data with infrastructure, analytics, communication, AI, and platform integration providers only as needed to operate Sociora. Workspace content is retained while an account is active unless a user deletes it or requests deletion, subject to legal, security, and backup requirements.",
      },
      {
        title: "Your choices",
        body:
          "Users may update profile information, disconnect social accounts, delete drafts, request account deletion, and contact Sociora about data access or correction. Some records may be retained where required for security, billing, or legal compliance.",
      },
    ],
    ctaLabel: "Contact privacy team",
    ctaTo: "/contact",
  },
  terms: {
    badge: "Legal",
    title: "Terms of Service",
    description:
      "These terms describe the rules for using Sociora, including account responsibilities, acceptable use, subscriptions, and platform integrations.",
    icon: CheckCircle2,
    updated: "Effective July , 2026",
    stats: [
      { value: "18+", label: "Minimum user age" },
      { value: "Fair use", label: "Service standard" },
      { value: "User owned", label: "Customer content" },
    ],
    cardsTitle: "Key terms",
    cards: [
      {
        title: "You own your content",
        description:
          "Drafts, campaigns, media, and scheduled posts remain yours. Sociora needs permission to process them only to provide the service.",
      },
      {
        title: "Use the product responsibly",
        description:
          "Users must not misuse integrations, attempt unauthorized access, post unlawful material, or use the service to spam platforms.",
      },
      {
        title: "Plans may change",
        description:
          "Subscription features, usage limits, and pricing may evolve. We provide notice for material changes that affect active customers.",
      },
      {
        title: "Accountability & support",
        description:
          "We strive for high uptime and platform reliability, offering responsive customer support to help resolve workspace issues.",
      },
    ],
    sections: [
      {
        title: "Accounts and access",
        body:
          "You are responsible for keeping login credentials secure and for activity that happens in your workspace. If you invite team members, you are responsible for assigning access appropriate to their role.",
      },
      {
        title: "Acceptable use",
        body:
          "Sociora may not be used to create or distribute illegal content, impersonate others, violate platform rules, scrape services without permission, interfere with the product, or send spam. We may suspend accounts that create risk for users, platforms, or the service.",
      },
      {
        title: "AI-generated content",
        body:
          "AI output should be reviewed before publishing. You are responsible for checking accuracy, claims, compliance, rights, and suitability for your audience. Sociora provides drafting assistance but does not guarantee that generated content is error-free.",
      },
      {
        title: "Availability and changes",
        body:
          "We work to keep Sociora reliable, but the service may change, pause, or experience interruptions. Features that depend on third-party social platforms may be affected by their policies, outages, or API limitations.",
      },
    ],
    ctaLabel: "Open Sociora",
    ctaTo: "/login",
  },
  security: {
    badge: "Legal",
    title: "Security at Sociora",
    description:
      "Security is part of how Sociora handles workspaces, social account connections, scheduling data, and AI-assisted content workflows.",
    icon: ShieldCheck,
    updated: "Security overview updated July 2026",
    stats: [
      { value: "TLS", label: "Data in transit" },
      { value: "Scoped", label: "Integration access" },
      { value: "Monitored", label: "Operational checks" },
    ],
    cardsTitle: "Security practices",
    cards: [
      {
        title: "Protected transport",
        description:
          "Sociora uses encrypted connections for application traffic and follows modern browser security practices.",
      },
      {
        title: "Token handling",
        description:
          "Social account tokens are stored and used for the connected actions users authorize, such as account sync and scheduled publishing.",
      },
      {
        title: "Operational review",
        description:
          "The team monitors application behavior, investigates suspicious activity, and prioritizes fixes for security-relevant issues.",
      },
      {
        title: "Continuous monitoring",
        description:
          "Automated checks, regular dependency updates, and access controls ensure workspace data stays safe against unauthorized access.",
      },
    ],
    sections: [
      {
        title: "Application security",
        body:
          "Sociora applies secure development practices across authentication, API design, authorization checks, and data handling. Product changes that touch accounts, publishing, or workspace access are reviewed carefully because those areas carry the highest user impact.",
      },
      {
        title: "Infrastructure and access",
        body:
          "Access to production systems is limited to authorized personnel. Credentials are kept out of source control, and sensitive configuration is managed through environment variables or provider-managed secrets.",
      },
      {
        title: "Responsible disclosure",
        body:
          `If you believe you have found a vulnerability, contact ${companyContact.email} with reproduction steps, affected URLs, and potential impact. Please avoid accessing or modifying other users' data while investigating.`,
      },
      {
        title: "Customer responsibilities",
        body:
          "Use strong passwords, keep email accounts secure, remove team members who no longer need access, and review connected social accounts regularly. Security is strongest when product safeguards and account hygiene work together.",
      },
    ],
    ctaLabel: "Report a concern",
    ctaTo: "/contact",
  },
  cookies: {
    badge: "Legal",
    title: "Cookie Policy",
    description:
      "This policy explains how Sociora uses cookies and similar technologies to keep users signed in, remember preferences, and understand product performance.",
    icon: LockKeyhole,
    updated: "Effective July 2, 2026",
    stats: [
      { value: "Essential", label: "Login cookies" },
      { value: "Optional", label: "Analytics choices" },
      { value: "Browser", label: "Control location" },
    ],
    cardsTitle: "Cookie categories",
    cards: [
      {
        title: "Essential cookies",
        description:
          "Required for authentication, session security, routing, and core product behavior. The app cannot function correctly without them.",
      },
      {
        title: "Preference cookies",
        description:
          "Used to remember choices such as theme, workspace settings, and interface preferences where applicable.",
      },
      {
        title: "Analytics cookies",
        description:
          "Help us understand product usage, page performance, and feature adoption so we can improve Sociora responsibly.",
      },
      {
        title: "Your privacy choices",
        description:
          "You can manage browser cookie settings at any time without compromising basic features that don't require non-essential tracking.",
      },
    ],
    sections: [
      {
        title: "Why cookies are used",
        body:
          "Cookies help Sociora recognize a signed-in browser, protect sessions, preserve preferences, and measure whether important product flows are working. Similar local storage technologies may be used for lightweight interface state.",
      },
      {
        title: "Third-party technologies",
        body:
          "Some cookies or similar identifiers may come from trusted providers used for hosting, analytics, authentication, payments, support, or social platform integrations. These providers process information according to their own policies and our agreements with them.",
      },
      {
        title: "Managing cookies",
        body:
          "Most browsers allow you to block, delete, or limit cookies. Blocking essential cookies may prevent login, connected account actions, or scheduling workflows from working correctly.",
      },
    ],
    ctaLabel: "Ask about cookies",
    ctaTo: "/contact",
  },
};

function ContactStrip() {
  return (
    <div className="mb-10 grid gap-3 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl sm:grid-cols-3">
      <a className="flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 hover:bg-orange-500/10 border border-slate-100 dark:border-white/5 hover:border-orange-500/30" href={`mailto:${companyContact.email}`}>
        <div className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Mail className="h-4.5 w-4.5" />
        </div>
        <span className="break-all text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{companyContact.email}</span>
      </a>
      <a className="flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 hover:bg-orange-500/10 border border-slate-100 dark:border-white/5 hover:border-orange-500/30" href="tel:+918960717110">
        <div className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Phone className="h-4.5 w-4.5" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{companyContact.phone}</span>
      </a>
      <div className="flex items-center gap-3 rounded-2xl p-3.5 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <MapPin className="h-4.5 w-4.5" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{companyContact.location}</span>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-3.5 transition-all duration-300 hover:border-orange-500/40">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-orange-500 dark:text-orange-400" />
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">{label}</div>
        <div className="mt-0.5 text-xs font-bold leading-5 text-slate-800 dark:text-white break-all">{value}</div>
      </div>
    </div>
  );
}

export default function MarketingInfo({ page }: { page: MarketingPageKey }) {
  const content = pages[page];
  const Icon = content.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-slate-900 dark:text-white overflow-hidden">
      {/* Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-marketing" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-marketing)" />
        </svg>

        {/* Glowing Orbs */}
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 rounded-full"
          style={{
            width: "900px",
            height: "600px",
            background: "radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, rgba(249,115,22,0.10) 35%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute right-0 top-1/3 rounded-full"
          style={{
            width: "600px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(20,184,166,0.10) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -left-40 bottom-1/4 rounded-full"
          style={{
            width: "600px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 pt-28 pb-20">
        {/* Header Hero Section */}
        <section className="relative pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-center">
              <div>
                {/* Section Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 backdrop-blur-md dark:border-teal-400/30 dark:text-teal-300">
                  <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>{content.badge}</span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                  {content.title}
                </h1>

                <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {content.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-6 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/35 active:translate-y-0"
                    to={content.ctaTo}
                  >
                    <span>{content.ctaLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 backdrop-blur-md">
                    <CalendarDays className="h-4 w-4 text-orange-500" />
                    {content.updated}
                  </span>
                </div>

                {/* Header Feature Highlights Bar to match right panel height */}
                <div className="mt-8 grid gap-3.5 sm:grid-cols-3 max-w-3xl">
                  {headerHighlights[page].map((highlight) => (
                    <div
                      key={highlight.title}
                      className={`rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 p-4 backdrop-blur-md transition-all duration-300 ${
                        highlight.theme === "orange"
                          ? "hover:border-orange-500/40 hover:bg-orange-500/5"
                          : highlight.theme === "teal"
                          ? "hover:border-teal-500/40 hover:bg-teal-500/5"
                          : "hover:border-amber-500/40 hover:bg-amber-500/5"
                      }`}
                    >
                      <div
                        className={`text-xs font-black uppercase tracking-wider ${
                          highlight.theme === "orange"
                            ? "text-orange-600 dark:text-orange-400"
                            : highlight.theme === "teal"
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {highlight.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {highlight.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel / Stats Card */}
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-orange-500/30">
                <div className="border-b border-slate-200/70 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-5 rounded-t-[1.4rem]">
                  <div className="flex items-center gap-3.5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md shadow-orange-500/20">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-950 dark:text-white">Sociora Workspace</div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">AI social media planning suite</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-4">
                  {content.stats.map((stat) => (
                    <div
                      className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4 transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/5"
                      key={stat.label}
                    >
                      <div className="text-2xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{stat.label}</div>
                    </div>
                  ))}
                  <DetailRow icon={Mail} label="Email" value={companyContact.email} />
                  <DetailRow icon={Phone} label="Phone" value={companyContact.phone} />
                  <DetailRow icon={MapPin} label="Location" value={companyContact.location} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Cards Section */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          {page === "contact" && <ContactStrip />}

          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="sticky top-28 space-y-5">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    {content.cardsTitle}
                  </h2>
                  <p className="mt-4 text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {sectionDescriptions[page]}
                  </p>
                </div>

                {/* Page-Specific Checklist */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-5 backdrop-blur-md">
                  <div className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3.5">
                    {sidebarChecklists[page].title}
                  </div>
                  <ul className="grid gap-2.5">
                    {sidebarChecklists[page].items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-none" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fill Card to Match 2x2 Height Perfectly on All Pages */}
                {page === "contact" ? (
                  <div className="rounded-2xl border border-teal-500/30 bg-[linear-gradient(135deg,rgba(13,148,136,0.06)_0%,rgba(20,184,166,0.06)_100%)] dark:bg-[linear-gradient(135deg,rgba(13,148,136,0.12)_0%,rgba(20,184,166,0.12)_100%)] p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-teal-500/50">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-950 dark:text-white">Direct Support Assistance</div>
                        <div className="text-xs font-bold text-teal-600 dark:text-teal-400">Guaranteed response within 24 hours</div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      Need help connecting an account or setting up AI drafts? Send us an email or phone query for step-by-step guidance.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-teal-500/20 pt-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">⚡ Mon - Fri Support Active</span>
                      <a href={`mailto:${companyContact.email}`} className="inline-flex items-center gap-1.5 text-xs font-black text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors">
                        <span>Send Email</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-orange-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.06)_0%,rgba(249,115,22,0.06)_100%)] dark:bg-[linear-gradient(135deg,rgba(239,68,68,0.12)_0%,rgba(249,115,22,0.12)_100%)] p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-orange-500/50">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white shadow-md">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-950 dark:text-white">Elevate your social workflow</div>
                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400">Join creators & teams on Sociora</div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      Schedule posts, generate AI captions, and keep your entire publishing calendar organized.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-orange-500/20 pt-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">🚀 Free Launch Active</span>
                      <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors">
                        <span>Get Started</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {content.cards.map((card, index) => (
                <article
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10"
                  key={card.title}
                >
                  <div className="absolute right-5 top-5 text-4xl font-black text-slate-200/80 dark:text-slate-800 transition-colors duration-300 group-hover:text-orange-500/20">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {card.meta && (
                    <div className="relative mb-3 text-xs font-black uppercase tracking-widest text-orange-500">
                      {card.meta}
                    </div>
                  )}
                  <h3 className="relative max-w-[88%] text-lg font-black text-slate-950 dark:text-white">{card.title}</h3>
                  <p className="relative mt-3 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Sections Block - Next-Gen Bento Style */}
        <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {content.sections.map((section, idx) => {
              const accents = [
                {
                  badgeBg: "bg-[linear-gradient(135deg,#ef4444,#f97316)]",
                  orbBg: "bg-orange-500",
                  borderColor: "hover:border-orange-500/40",
                  shadowGlow: "hover:shadow-orange-500/10",
                  icon: Target,
                  number: "01",
                },
                {
                  badgeBg: "bg-[linear-gradient(135deg,#0d9488,#14b8a6)]",
                  orbBg: "bg-teal-500",
                  borderColor: "hover:border-teal-500/40",
                  shadowGlow: "hover:shadow-teal-500/10",
                  icon: Cpu,
                  number: "02",
                },
                {
                  badgeBg: "bg-[linear-gradient(135deg,#8b5cf6,#d97706)]",
                  orbBg: "bg-amber-500",
                  borderColor: "hover:border-amber-500/40",
                  shadowGlow: "hover:shadow-amber-500/10",
                  icon: Globe2,
                  number: "03",
                },
              ];

              const style = accents[idx % accents.length];
              const SectionIcon = style.icon;

              return (
                <article
                  key={section.title}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 sm:p-12 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${style.borderColor} ${style.shadowGlow}`}
                >
                  {/* Glowing background orb */}
                  <div
                    className={`absolute -right-20 -bottom-20 h-72 w-72 rounded-full ${style.orbBg} opacity-10 blur-3xl transition-all duration-700 group-hover:opacity-25 group-hover:scale-125`}
                  />

                  {/* Watermark Index Number */}
                  <div className="absolute right-8 top-6 select-none font-black text-6xl text-slate-200/50 dark:text-slate-800/40 transition-colors duration-500 group-hover:text-orange-500/15">
                    {style.number}
                  </div>

                  <div className="relative z-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
                    {/* Left Header */}
                    <div>
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${style.badgeBg} text-white shadow-lg shadow-black/10`}>
                        <SectionIcon className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                        {section.title}
                      </h2>
                    </div>

                    {/* Right Body Content */}
                    <div>
                      <p className="text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-relaxed">
                        {section.body}
                      </p>

                      {section.bullets && (
                        <div className="mt-6 grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                          {section.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="group/bullet flex items-center gap-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-teal-500/40 hover:bg-teal-500/5 hover:translate-x-1"
                            >
                              <div className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
