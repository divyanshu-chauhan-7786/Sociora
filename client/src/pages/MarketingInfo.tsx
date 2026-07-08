import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
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
        ],
      },
      {
        title: "Hiring process",
        body:
          "Candidates can expect a short intro conversation, a practical work discussion, and a final team interview. For technical and design roles, the exercise is scoped to mirror real Sociora work rather than trivia.",
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
        meta: companyContact.email,
        description:
          "For login issues, connected account questions, scheduling help, billing concerns, and workspace troubleshooting.",
      },
      {
        title: "Sales and demos",
        meta: companyContact.phone,
        description:
          "For creators, agencies, and businesses that want a guided walkthrough or help choosing the right workflow.",
      },
      {
        title: "Partnerships",
        meta: companyContact.email,
        description:
          "For integration ideas, community collaborations, affiliate discussions, and co-marketing opportunities.",
      },
      {
        title: "Careers",
        meta: companyContact.location,
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
          `Address: ${companyContact.location}`,
        ],
      },
      {
        title: "What to include",
        body:
          "For the fastest answer, include your workspace email, the social platform involved, screenshots when relevant, and the action you were trying to complete. For sales or partnership requests, include your company name and expected team size.",
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
    <div className="grid gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-xl shadow-orange-100/50 sm:grid-cols-3">
      <a className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-orange-50" href={`mailto:${companyContact.email}`}>
        <Mail className="h-5 w-5 text-orange-500" />
        <span className="break-all text-sm font-bold text-slate-700">{companyContact.email}</span>
      </a>
      <a className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-orange-50" href="tel:+918960717110">
        <Phone className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-bold text-slate-700">{companyContact.phone}</span>
      </a>
      <div className="flex items-center gap-3 rounded-xl p-3">
        <MapPin className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-bold text-slate-700">{companyContact.location}</span>
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
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-orange-300" />
      <div>
        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        <div className="mt-1 text-sm font-bold leading-5 text-white">{value}</div>
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
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 opacity-[0.045]" aria-hidden="true">
            <div className="h-full w-full bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:44px_44px]" />
          </div>
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-600">
                  <Icon className="h-4 w-4" />
                  {content.badge}
                </div>
                <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  {content.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
                  {content.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] px-5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
                    to={content.ctaTo}
                  >
                    {content.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    {content.updated}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
                <div className="border-b border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black">Sociora Workspace</div>
                      <div className="text-xs font-bold text-slate-400">AI social media planning suite</div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 p-5">
                {content.stats.map((stat) => (
                  <div
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                    key={stat.label}
                  >
                    <div className="text-2xl font-black text-orange-300">{stat.value}</div>
                    <div className="mt-1 text-sm font-bold text-slate-300">{stat.label}</div>
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

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          {page === "contact" && <ContactStrip />}

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="sticky top-28">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-orange-300 shadow-lg shadow-slate-900/15">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
                  {content.cardsTitle}
                </h2>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
                  Sociora is focused on the real day-to-day work behind social media: drafting ideas, keeping content organized, managing accounts, and publishing with confidence.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.cards.map((card, index) => (
                <article
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
                  key={card.title}
                >
                  <div className="absolute right-4 top-4 text-4xl font-black text-slate-100 transition group-hover:text-orange-100">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {card.meta && (
                    <div className="relative mb-3 text-xs font-black uppercase tracking-widest text-orange-500">
                      {card.meta}
                    </div>
                  )}
                  <h3 className="relative max-w-[88%] text-lg font-black text-slate-950">{card.title}</h3>
                  <p className="relative mt-3 text-sm font-semibold leading-6 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-6 lg:px-8">
            {content.sections.map((section) => (
              <article
                className="grid gap-4 border-b border-slate-200 pb-6 last:border-b-0 last:pb-0 lg:grid-cols-[300px_1fr]"
                key={section.title}
              >
                <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
                <div>
                  <p className="text-base font-semibold leading-8 text-slate-600">
                    {section.body}
                  </p>
                  {section.bullets && (
                    <ul className="mt-4 grid gap-3">
                      {section.bullets.map((bullet) => (
                        <li className="flex gap-3 text-sm font-bold leading-6 text-slate-700" key={bullet}>
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-orange-500" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
