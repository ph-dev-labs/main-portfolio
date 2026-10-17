import czuchiImg from "../Assets/Projects/czuchi.webp";
import novaImg from "../Assets/Projects/novacrust.webp";
import novaBusinessImg from "../Assets/Projects/business-nova.webp";
import wuraParentImg from "../Assets/Projects/grandma-wura-parent.webp";
import wuraChildImg from "../Assets/Projects/grandma-wura-child.webp";
import frexiqImg from "../Assets/Projects/frexiq.webp";
import fruitionImg from "../Assets/Projects/fruition.webp";
import floodImg from "../Assets/Projects/flood.webp";
import cryptoImg from "../Assets/Projects/crypto.webp";
import youfanlyImg from "../Assets/Projects/youfanly.webp";

// Order = display order. `featured` projects get full case-study rows;
// the rest go in the compact index list.
// `tint` is the brand colour used for the card backdrop + hover accents.
// Fill in `role`, `year` and `stack` where you can — they render when present.
export const projects = [
  {
    slug: "c-zuchi",
    title: "C-Zuchi",
    sector: "Logistics · Commerce",
    tagline: "Your trusted shipping container plug.",
    summary:
      "Online storefront for a Lagos container dealer — buyers browse verified 20ft & 40ft units across the Apapa and Port Harcourt terminals, book an inspection, and pay online.",
    highlights: [
      "Searchable listings filtered by size, condition & terminal",
      "Inspection booking and bulk-quote request flows",
      "Paystack checkout with Naira pricing",
      "Truck-hire, gallery and SEO buyer-guide pages",
    ],
    image: czuchiImg,
    tint: "#1d2b6b",
    live: "https://www.c-zuchigrp.com/",
    featured: true,
  },
  {
    slug: "frexiq",
    title: "Frexiq",
    sector: "Marketplace",
    role: "Frontend Developer (Contract)",
    year: "2024",
    tagline: "Book your beauty appointments in seconds.",
    summary:
      "A booking marketplace connecting customers with top-rated salons, spas and beauty pros — I built the vendor dashboard that runs their day.",
    highlights: [
      "Vendor dashboard handling 500+ daily bookings",
      "Pixel-perfect, responsive React pages from Figma",
      "REST API integration for booking & transaction flows",
    ],
    stack: ["React", "REST APIs"],
    image: frexiqImg,
    tint: "#5c1f3d",
    live: "https://www.frexiq.com/",
    featured: true,
  },
  {
    slug: "youfanly",
    title: "Youfanly",
    sector: "Creator economy",
    tagline: "Connect & support your favourite creators.",
    summary:
      "A platform where fans unlock creators' premium content and creators get paid — with separate fan and creator sign-up, Google login and card payments.",
    highlights: [
      "Fan and creator onboarding flows",
      "Email + Google authentication",
      "Premium content access with card payments",
    ],
    image: youfanlyImg,
    tint: "#5e0f5e",
    live: "https://www.youfanly.com/",
    featured: true,
  },
  {
    slug: "novacrust",
    title: "Novacrust",
    sector: "Fintech",
    tagline: "Simplifying global payments with virtual cards.",
    summary:
      "USD virtual cards that let anyone pay on Amazon, eBay and other global stores — a consumer site plus a dashboard for business accounts.",
    highlights: ["Consumer marketing site", "Business dashboard"],
    image: novaImg,
    secondaryImage: novaBusinessImg,
    tint: "#2b1f5c",
    live: "https://novacrust.com/",
    links: [{ label: "Business dashboard", href: "https://dashboard.novacrust.com" }],
    featured: true,
  },
  {
    slug: "grandma-wura",
    title: "Grandma Wura",
    sector: "Edtech",
    tagline: "Core African values, for the next generation.",
    summary:
      "A video learning platform teaching children the core values of African society, with separate parent and child experiences.",
    highlights: ["Parent & organisation portal", "Kids' video player"],
    image: wuraParentImg,
    secondaryImage: wuraChildImg,
    tint: "#6b3a12",
    live: "https://grandmawurahub.app",
    links: [{ label: "Kids' app", href: "https://watch.grandmawurahub.app/" }],
    featured: true,
  },
  {
    slug: "fruition-motors",
    title: "Fruition Motors",
    sector: "Automotive",
    summary: "Storefront for a vehicle dealership — browse inventory and start a purchase online.",
    image: fruitionImg,
    tint: "#1f3d2b",
    live: "https://www.fruitionmotors.com/",
    repo: "https://github.com/ph-dev-labs/fruition-motors",
  },
  {
    slug: "floodguard",
    title: "FloodGuard",
    sector: "Climate · ML",
    summary: "Predicts and visualises community flood risk from historical data, live weather and terrain.",
    image: floodImg,
    tint: "#123f5c",
    live: "https://flood-control-navy.vercel.app/",
  },
  {
    slug: "crypto-tracker",
    title: "Crypto Tracker",
    sector: "Side project",
    summary: "Live cryptocurrency prices and market data.",
    stack: ["React", "Tailwind", "Ant Design"],
    image: cryptoImg,
    tint: "#2a2a2a",
    live: "https://cryto-app-eight.vercel.app/",
    repo: "https://github.com/ph-dev-labs/cryto-app",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
export const clients = featuredProjects.map((p) => p.title);

export const hostOf = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
