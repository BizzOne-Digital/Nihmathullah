/**
 * Generates branded demo placeholder JPEGs for development.
 * Run: node scripts/generate-demo-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.join(__dirname, "..", "public", "images", "demo");

const images = [
  "home-hero.jpg", "home-trust-1.jpg", "home-editorial-1.jpg", "home-route-1.jpg",
  "home-process-1.jpg", "home-faq-1.jpg", "home-cta-1.jpg",
  "about-1.jpg", "about-2.jpg", "about-3.jpg", "about-4.jpg", "about-5.jpg",
  "services-1.jpg", "services-2.jpg", "services-3.jpg", "services-4.jpg", "services-5.jpg",
  "airport-1.jpg", "airport-2.jpg", "local-1.jpg", "long-distance-1.jpg",
  "executive-1.jpg", "corporate-1.jpg", "hotel-1.jpg", "private-car-1.jpg",
  "fleet-1.jpg", "fleet-2.jpg", "fleet-3.jpg", "fleet-4.jpg", "fleet-5.jpg",
  "vehicle-sedan-1.jpg", "vehicle-suv-1.jpg", "vehicle-sprinter-1.jpg",
  "area-albany.jpg", "area-saratoga.jpg", "area-clifton-park.jpg",
  "area-latham.jpg", "area-schenectady.jpg",
  "gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "gallery-4.jpg", "gallery-5.jpg",
  "testimonials-1.jpg", "testimonials-2.jpg", "testimonials-3.jpg",
  "testimonials-4.jpg", "testimonials-5.jpg",
  "faqs-1.jpg", "faqs-2.jpg", "faqs-3.jpg", "faqs-4.jpg", "faqs-5.jpg",
  "booking-1.jpg", "booking-2.jpg", "booking-3.jpg", "booking-4.jpg", "booking-5.jpg",
  "contact-1.jpg", "contact-2.jpg", "contact-3.jpg", "contact-4.jpg", "contact-5.jpg",
  "blog-index-1.jpg", "blog-index-2.jpg", "blog-index-3.jpg",
  "blog-index-4.jpg", "blog-index-5.jpg",
  "blog-airport.jpg", "blog-executive.jpg", "blog-long-distance.jpg",
];

function createSvgPlaceholder(name) {
  const label = name.replace(/\.jpg$/, "").replace(/-/g, " ").toUpperCase();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#060807"/>
      <stop offset="50%" style="stop-color:#181A19"/>
      <stop offset="100%" style="stop-color:#0C0E0D"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#AC9461"/>
      <stop offset="50%" style="stop-color:#D0AF6F"/>
      <stop offset="100%" style="stop-color:#E2C179"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <line x1="0" y1="720" x2="1600" y2="680" stroke="url(#gold)" stroke-width="2" opacity="0.4"/>
  <line x1="0" y1="740" x2="1600" y2="720" stroke="url(#gold)" stroke-width="1" opacity="0.25"/>
  <rect x="700" y="280" width="200" height="240" rx="8" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>
  <text x="800" y="420" text-anchor="middle" fill="#D0AF6F" font-family="Georgia, serif" font-size="48" font-weight="bold">SL</text>
  <text x="800" y="560" text-anchor="middle" fill="#F5EFE5" font-family="Arial, sans-serif" font-size="22" letter-spacing="4">${label}</text>
  <text x="800" y="600" text-anchor="middle" fill="#A7AAA7" font-family="Arial, sans-serif" font-size="14">SierraLink Demo Image — Replace Before Production</text>
</svg>`;
}

if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

for (const name of images) {
  const svgPath = path.join(demoDir, name.replace(".jpg", ".svg"));
  fs.writeFileSync(svgPath, createSvgPlaceholder(name));
}

console.log(`Generated ${images.length} SVG demo placeholders in public/images/demo/`);
