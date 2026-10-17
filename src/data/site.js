import resumePdf from "../Assets/Nwosu-Chimezie-CV.pdf";
import avatarImg from "../Assets/me-avatar.webp";
import portraitImg from "../Assets/me-portrait.webp";
import fullImg from "../Assets/me-full.webp";

// Single source of truth for identity + contact details.
export const site = {
  name: "Nwosu Chimezie",
  fullName: "Nwosu Chimezie Justice",
  role: "Frontend & React Native Developer",
  location: "Port Harcourt, Nigeria · Remote",
  availability: "Open to remote roles in any time zone",
  email: "nwosuchimezie95@gmail.com",
  resume: resumePdf,
  resumeFileName: "Nwosu-Chimezie-CV.pdf",
  photos: { avatar: avatarImg, portrait: portraitImg, full: fullImg },
  socials: [
    { label: "GitHub", href: "https://github.com/ph-dev-labs" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nwosu-chimezie-44091122b",
    },
    { label: "X / Twitter", href: "https://twitter.com/phdev__" },
  ],
};

export const primaryContact = site.email
  ? { href: `mailto:${site.email}`, label: site.email, external: false }
  : { href: site.socials[1].href, label: "Message me on LinkedIn", external: true };

// Headline numbers — all taken from the CV.
export const stats = [
  { value: "3+", label: "years shipping React, Next.js & React Native" },
  { value: "500+", label: "daily bookings through the Frexiq vendor dashboard" },
  { value: "~3s", label: "faster page loads after the Sprinble refactor" },
  { value: "100+", label: "Google Play downloads in the Zysk app's first month" },
];
