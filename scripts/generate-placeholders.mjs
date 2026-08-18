/**
 * Generates branded SierraLink SVG placeholders for the public site.
 * Run: node scripts/generate-placeholders.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "placeholders");

const ICONS = {
  airport:
    '<path d="M800 360 L860 420 L820 430 L840 470 L800 455 L760 470 L780 430 L740 420 Z" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linejoin="round"/>',
  local:
    '<path d="M800 430 C760 360 720 390 720 430 C720 470 800 520 800 520 C800 520 880 470 880 430 C880 390 840 360 800 430 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="800" cy="430" r="8" fill="#D0AF6F"/>',
  route:
    '<path d="M560 500 C640 420 720 460 800 400 C880 340 960 380 1040 320" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/><circle cx="560" cy="500" r="6" fill="#E2C179"/><circle cx="800" cy="400" r="6" fill="#E2C179"/><circle cx="1040" cy="320" r="6" fill="#E2C179"/>',
  executive:
    '<rect x="755" y="360" width="90" height="70" rx="6" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M770 360 V345 H830 V360" fill="none" stroke="url(#gold)" stroke-width="2.5"/>',
  corporate:
    '<rect x="745" y="355" width="110" height="95" fill="none" stroke="url(#gold)" stroke-width="2.5"/><rect x="770" y="390" width="18" height="18" fill="#D0AF6F" opacity="0.8"/><rect x="812" y="390" width="18" height="18" fill="#D0AF6F" opacity="0.8"/>',
  hotel:
    '<rect x="745" y="350" width="110" height="100" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M785 450 V390 H815 V450" fill="none" stroke="url(#gold)" stroke-width="2.5"/>',
  car:
    '<rect x="710" y="410" width="180" height="50" rx="14" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="755" cy="470" r="16" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="845" cy="470" r="16" fill="none" stroke="url(#gold)" stroke-width="2.5"/>',
  fleet:
    '<rect x="700" y="405" width="200" height="58" rx="16" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="748" cy="475" r="17" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="852" cy="475" r="17" fill="none" stroke="url(#gold)" stroke-width="2.5"/>',
  area:
    '<path d="M800 350 L860 390 V470 L800 510 L740 470 V390 Z" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="800" cy="430" r="10" fill="#D0AF6F"/>',
  gallery:
    '<rect x="735" y="360" width="130" height="95" rx="8" fill="none" stroke="url(#gold)" stroke-width="2.5"/><circle cx="770" cy="395" r="10" fill="#D0AF6F" opacity="0.85"/><path d="M760 445 L790 410 L815 430 L845 395 L865 445 Z" fill="none" stroke="url(#gold)" stroke-width="2"/>',
  testimonial:
    '<path d="M735 430 H770 V470 H750 L735 485 Z M830 430 H865 V470 H845 L830 485 Z" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linejoin="round"/>',
  faq:
    '<circle cx="800" cy="415" r="34" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M785 415 H800 C812 415 818 422 818 430 C818 438 808 442 800 450 V465" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/><circle cx="800" cy="482" r="4" fill="#D0AF6F"/>',
  booking:
    '<rect x="740" y="360" width="120" height="105" rx="8" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M770 350 V375 M830 350 V375 M755 390 H845" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>',
  contact:
    '<path d="M760 370 H840 C855 370 865 380 865 395 V455 C865 470 855 480 840 480 H760 C745 480 735 470 735 455 V395 C735 380 745 370 760 370 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M735 390 L800 435 L865 390" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linejoin="round"/>',
  blog:
    '<rect x="745" y="355" width="110" height="120" rx="8" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M770 390 H830 M770 420 H830 M770 450 H805" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>',
  service:
    '<path d="M800 350 L845 375 V425 L800 450 L755 425 V375 Z" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linejoin="round"/><text x="800" y="420" text-anchor="middle" fill="#D0AF6F" font-family="Georgia, serif" font-size="22" font-weight="bold">SL</text>',
  hero:
    '<path d="M480 520 C620 440 740 500 880 420 C980 360 1080 400 1120 380" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.55" stroke-linecap="round"/><circle cx="480" cy="520" r="5" fill="#E2C179"/><circle cx="880" cy="420" r="5" fill="#E2C179"/><circle cx="1120" cy="380" r="5" fill="#E2C179"/>',
  trust:
    '<circle cx="800" cy="415" r="34" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M782 415 L795 430 L820 400" fill="none" stroke="url(#gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  process:
    '<circle cx="740" cy="430" r="14" fill="#D0AF6F"/><circle cx="800" cy="430" r="14" fill="#D0AF6F"/><circle cx="860" cy="430" r="14" fill="#D0AF6F"/><path d="M754 430 H786 M814 430 H846" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>',
  editorial:
    '<circle cx="800" cy="425" r="40" fill="none" stroke="url(#gold)" stroke-width="2.5"/><path d="M800 385 V425 L825 440" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>',
  cta:
    '<path d="M760 430 H840" stroke="url(#gold)" stroke-width="3" stroke-linecap="round"/><path d="M820 410 L840 430 L820 450" fill="none" stroke="url(#gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
};

/** @type {Record<string, { label: string; icon: keyof typeof ICONS }>} */
const FILES = {
  "home-trust-1.svg": { label: "Professional Service", icon: "trust" },
  "home-editorial-1.svg": { label: "Capital Region Travel", icon: "editorial" },
  "home-route-1.svg": { label: "Routes & Connections", icon: "route" },
  "home-process-1.svg": { label: "Simple Booking", icon: "process" },
  "home-faq-1.svg": { label: "Travel Questions", icon: "faq" },
  "home-cta-1.svg": { label: "Book Your Ride", icon: "cta" },
  "about-1.svg": { label: "About SierraLink", icon: "service" },
  "about-2.svg": { label: "Our Commitment", icon: "trust" },
  "about-3.svg": { label: "Capital Region", icon: "area" },
  "about-4.svg": { label: "Executive Travel", icon: "executive" },
  "about-5.svg": { label: "Private Transportation", icon: "car" },
  "services-1.svg": { label: "Our Services", icon: "service" },
  "services-2.svg": { label: "Airport Connections", icon: "airport" },
  "services-3.svg": { label: "Executive Travel", icon: "executive" },
  "services-4.svg": { label: "Corporate Service", icon: "corporate" },
  "services-5.svg": { label: "Private Car Hire", icon: "car" },
  "airport-1.svg": { label: "Airport Transportation", icon: "airport" },
  "airport-2.svg": { label: "JFK Connections", icon: "airport" },
  "local-1.svg": { label: "Local Transportation", icon: "local" },
  "long-distance-1.svg": { label: "Long-Distance Travel", icon: "route" },
  "executive-1.svg": { label: "Executive Transportation", icon: "executive" },
  "corporate-1.svg": { label: "Corporate Transportation", icon: "corporate" },
  "hotel-1.svg": { label: "Hotel & Residential", icon: "hotel" },
  "private-car-1.svg": { label: "Private Car Service", icon: "car" },
  "fleet-1.svg": { label: "Luxury Fleet", icon: "fleet" },
  "fleet-2.svg": { label: "Premium SUV", icon: "fleet" },
  "fleet-3.svg": { label: "Executive Sedan", icon: "fleet" },
  "fleet-4.svg": { label: "Professional Chauffeur", icon: "executive" },
  "fleet-5.svg": { label: "Comfort & Style", icon: "car" },
  "vehicle-sedan-1.svg": { label: "Executive Sedan", icon: "fleet" },
  "vehicle-suv-1.svg": { label: "Luxury SUV", icon: "fleet" },
  "vehicle-sprinter-1.svg": { label: "Sprinter Van", icon: "fleet" },
  "area-albany.svg": { label: "Albany", icon: "area" },
  "area-saratoga.svg": { label: "Saratoga Springs", icon: "area" },
  "area-clifton-park.svg": { label: "Clifton Park", icon: "area" },
  "area-latham.svg": { label: "Latham", icon: "area" },
  "area-schenectady.svg": { label: "Schenectady", icon: "area" },
  "gallery-1.svg": { label: "Travel Gallery", icon: "gallery" },
  "gallery-2.svg": { label: "Airport Travel", icon: "gallery" },
  "gallery-3.svg": { label: "Executive Journeys", icon: "gallery" },
  "gallery-4.svg": { label: "Luxury Details", icon: "gallery" },
  "gallery-5.svg": { label: "Private Service", icon: "gallery" },
  "testimonials-1.svg": { label: "Client Experience", icon: "testimonial" },
  "testimonials-2.svg": { label: "Trusted Service", icon: "testimonial" },
  "testimonials-3.svg": { label: "Professional Travel", icon: "testimonial" },
  "testimonials-4.svg": { label: "Capital Region", icon: "testimonial" },
  "testimonials-5.svg": { label: "SierraLink Reviews", icon: "testimonial" },
  "faqs-1.svg": { label: "Frequently Asked Questions", icon: "faq" },
  "faqs-2.svg": { label: "Booking Help", icon: "faq" },
  "faqs-3.svg": { label: "Airport Travel", icon: "faq" },
  "faqs-4.svg": { label: "Pricing Information", icon: "faq" },
  "faqs-5.svg": { label: "Contact Support", icon: "faq" },
  "booking-1.svg": { label: "Book Online", icon: "booking" },
  "booking-2.svg": { label: "Request a Quote", icon: "booking" },
  "booking-3.svg": { label: "Trip Details", icon: "booking" },
  "booking-4.svg": { label: "Confirmation", icon: "trust" },
  "booking-5.svg": { label: "Private Travel", icon: "car" },
  "contact-1.svg": { label: "Contact SierraLink", icon: "contact" },
  "contact-2.svg": { label: "Call or Message", icon: "contact" },
  "contact-3.svg": { label: "Capital Region Office", icon: "area" },
  "contact-4.svg": { label: "Customer Support", icon: "contact" },
  "contact-5.svg": { label: "Get in Touch", icon: "contact" },
  "blog-index-1.svg": { label: "Travel Insights", icon: "blog" },
  "blog-index-2.svg": { label: "Airport Tips", icon: "blog" },
  "blog-index-3.svg": { label: "Executive Travel", icon: "blog" },
  "blog-index-4.svg": { label: "Capital Region", icon: "blog" },
  "blog-index-5.svg": { label: "SierraLink Blog", icon: "blog" },
  "blog-airport.svg": { label: "Airport Transfer Guide", icon: "airport" },
  "blog-executive.svg": { label: "Executive Preparation", icon: "executive" },
  "blog-long-distance.svg": { label: "Long-Distance Planning", icon: "route" },
  "page-about.svg": { label: "About", icon: "service" },
  "page-services.svg": { label: "Services", icon: "service" },
  "page-fleet.svg": { label: "Fleet", icon: "fleet" },
  "page-areas.svg": { label: "Service Areas", icon: "area" },
  "page-gallery.svg": { label: "Gallery", icon: "gallery" },
  "page-testimonials.svg": { label: "Testimonials", icon: "testimonial" },
  "page-faqs.svg": { label: "FAQs", icon: "faq" },
  "page-booking.svg": { label: "Booking", icon: "booking" },
  "page-contact.svg": { label: "Contact", icon: "contact" },
  "page-blog.svg": { label: "Blog", icon: "blog" },
  "page-legal.svg": { label: "Policies", icon: "blog" },
};

function createSvg(label, iconKey) {
  const icon = ICONS[iconKey] || ICONS.service;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060807"/>
      <stop offset="45%" stop-color="#121413"/>
      <stop offset="100%" stop-color="#0C0E0D"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#AC9461"/>
      <stop offset="50%" stop-color="#D0AF6F"/>
      <stop offset="100%" stop-color="#E2C179"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="45%">
      <stop offset="0%" stop-color="#D0AF6F" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#060807" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <rect width="1600" height="1000" fill="url(#glow)"/>
  <path d="M120 860 C420 780 680 820 980 760 C1180 720 1360 740 1480 700" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.35" stroke-linecap="round"/>
  <path d="M80 900 C380 830 640 870 940 810 C1140 770 1320 790 1520 750" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.2" stroke-linecap="round"/>
  <rect x="120" y="120" width="80" height="80" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.25"/>
  <rect x="1400" y="800" width="80" height="80" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.25"/>
  ${icon}
  <text x="800" y="560" text-anchor="middle" fill="#F5EFE5" font-family="Georgia, 'Times New Roman', serif" font-size="28">${label}</text>
  <text x="800" y="600" text-anchor="middle" fill="#A7AAA7" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="0.28em">SIERRALINK EXECUTIVE TRANSPORTATION</text>
</svg>`;
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let count = 0;
for (const [filename, meta] of Object.entries(FILES)) {
  fs.writeFileSync(path.join(outDir, filename), createSvg(meta.label, meta.icon));
  count++;
}

console.log(`Generated ${count} SVG placeholders in public/images/placeholders/`);
