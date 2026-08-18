import type { PageHero, PageSection, SeoFields } from "@/types";
import {
  sanitizePageHero,
  sanitizePageSection,
  sanitizeSeoFields,
} from "@/lib/media/sanitize";
import { ABOUT_STATEMENT, cta, DEMO, img, PRICING_STATEMENT, section } from "./helpers";

export interface PageSeed {
  slug: string;
  title: string;
  published: boolean;
  order: number;
  hero?: PageHero;
  sections: PageSection[];
  seo?: SeoFields;
}

export function sanitizePageSeed(page: PageSeed): PageSeed {
  return {
    ...page,
    hero: sanitizePageHero(page.hero),
    sections: page.sections.map(sanitizePageSection),
    seo: sanitizeSeoFields(page.seo),
  };
}

export function buildPages(): PageSeed[] {
  return [
    {
      slug: "home",
      title: "Home",
      published: true,
      order: 0,
      hero: {
        eyebrow: "Private Transportation • Albany & the Capital Region",
        heading:
          "Reliable Airport, Executive, Local & Long-Distance Transportation",
        subheading:
          "Professional private car service for airport transfers, business travel, local rides and long-distance trips.",
        backgroundImage: img(
          DEMO.homeHero,
          "Luxury black sedan at Albany airport curbside at dusk"
        ),
      },
      seo: {
        title: "SierraLink Executive Transportation | Albany & Capital Region",
        description:
          "Private airport, executive, local, and long-distance transportation in Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and the Capital Region.",
        socialImage: DEMO.homeHero,
      },
      sections: [
        section("home-quick-quote", "quickQuote", "Quick Quote Launcher", 0, {
          eyebrow: "Get Started",
          heading: "Request a Quote in Minutes",
          subheading: "Share your trip details and continue to booking with your information preserved.",
          primaryCta: cta("Get a Quote", "/booking?mode=quote"),
          secondaryCta: cta("Book a Ride", "/booking?mode=booking"),
          theme: "charcoal",
        }),
        section("home-trust", "richText", "Trust Strip", 1, {
          eyebrow: "SierraLink",
          heading: "Private Transportation, Professionally Arranged",
          body: "Airport • Local • Long-Distance • Executive • Corporate • Pre-Arranged Private Car Service",
          primaryMedia: img(DEMO.homeTrust, "Professional chauffeur opening luxury vehicle door"),
          theme: "black",
        }),
        section("home-airports", "airportSpotlight", "Airport Spotlight", 2, {
          eyebrow: "Airport Service",
          heading: "Albany International & JFK Connections",
          subheading: "Pre-arranged private airport transportation for arrivals and departures.",
          items: [
            {
              code: "ALB",
              name: "Albany International Airport",
              description: "Capital Region arrivals and departures with private curbside service.",
              image: img(DEMO.homeAirport, "Albany International Airport private pickup"),
              cta: cta("ALB Transportation", "/services/airport-transportation"),
            },
            {
              code: "JFK",
              name: "John F. Kennedy International Airport",
              description: "Long-distance private connections between the Capital Region and JFK.",
              image: img(DEMO.homeAirport2, "JFK airport private transportation"),
              cta: cta("JFK Transportation", "/services/airport-transportation"),
            },
          ],
          primaryCta: cta("Airport Quote", "/booking?mode=quote&rideType=airport"),
          theme: "charcoal",
        }),
        section("home-services", "serviceCards", "Service Cards", 3, {
          eyebrow: "Our Services",
          heading: "Transportation for Every Journey",
          subheading: "Seven core services—each with dedicated detail pages and quote-based booking.",
          theme: "ivory",
        }),
        section("home-editorial", "editorial", "Local to Long-Distance", 4, {
          eyebrow: "Capital Region Travel",
          heading: "From Local Pickup to Long-Distance Arrival",
          body: "Whether you need a short ride across Albany or a private trip to JFK, SierraLink coordinates pre-arranged transportation with clear communication and comfortable vehicles.",
          primaryMedia: img(DEMO.homeEditorial, "Luxury vehicle on Capital Region road at night"),
          media: [
            img(DEMO.homeRoute, "Route through upstate New York countryside"),
            img(DEMO.localService, "Local private transportation scene"),
          ],
          primaryCta: cta("Explore Services", "/services"),
          theme: "black",
        }),
        section("home-executive", "splitMedia", "Executive Experience", 5, {
          eyebrow: "Executive & Corporate",
          heading: "Professional Travel for Business",
          body: "Discreet, pre-arranged transportation for executives, corporate clients, and business travelers throughout the Capital Region.",
          primaryMedia: img(DEMO.homeExecutive, "Executive traveler in luxury sedan interior"),
          media: [img(DEMO.corporateService, "Corporate transportation pickup")],
          primaryCta: cta("Executive Transportation", "/services/executive-transportation"),
          secondaryCta: cta("Corporate Transportation", "/services/corporate-transportation"),
          layout: "image-right",
          theme: "charcoal",
        }),
        section("home-areas", "routeStory", "Service Areas", 6, {
          eyebrow: "Service Areas",
          heading: "Capital Region Routes",
          subheading: "Albany • Saratoga Springs • Clifton Park • Latham • Schenectady • Surrounding Areas",
          body: "Local knowledge across the Capital Region supports efficient routing for airport runs, business travel, and private appointments.",
          items: [
            { label: "Albany", href: "/service-areas/albany" },
            { label: "Saratoga Springs", href: "/service-areas/saratoga-springs" },
            { label: "Clifton Park", href: "/service-areas/clifton-park" },
            { label: "Latham", href: "/service-areas/latham" },
            { label: "Schenectady", href: "/service-areas/schenectady" },
          ],
          primaryMedia: img(DEMO.homeRoute, "Animated route map concept for Capital Region"),
          media: [img(DEMO.areas1, "Albany cityscape at golden hour")],
          primaryCta: cta("View Service Areas", "/service-areas"),
          theme: "gold",
        }),
        section("home-process", "process", "Booking Process", 7, {
          eyebrow: "How It Works",
          heading: "Simple Booking, Clear Confirmation",
          items: [
            { step: 1, title: "Share trip details", description: "Pickup, destination, date, time, and passengers." },
            { step: 2, title: "Receive confirmation or quote", description: "We review your request and respond with next steps." },
            { step: 3, title: "Approve and pay if requested", description: "Secure payment when enabled for your approved quote." },
            { step: 4, title: "Ride", description: "Professional private transportation on your scheduled day." },
          ],
          primaryMedia: img(DEMO.homeProcess, "Booking confirmation on mobile device"),
          theme: "ivory",
        }),
        section("home-fleet", "fleetPreview", "Fleet Preview", 8, {
          eyebrow: "Fleet & Gallery",
          heading: "Comfortable Private Vehicles",
          subheading: "Explore our fleet showcase and gallery. Vehicle details are confirmed for your specific trip.",
          primaryMedia: img(DEMO.homeFleet, "Luxury sedan and SUV fleet preview"),
          media: [img(DEMO.fleet2, "Vehicle interior leather seating detail")],
          primaryCta: cta("View Fleet", "/fleet"),
          secondaryCta: cta("Gallery", "/gallery"),
          theme: "charcoal",
        }),
        section("home-testimonials", "testimonials", "Testimonials", 9, {
          eyebrow: "Testimonials",
          heading: "Client Experiences",
          body: "What Capital Region clients say about SierraLink private transportation.",
          visible: true,
          theme: "black",
        }),
        section("home-faqs", "faqs", "FAQ Preview", 10, {
          eyebrow: "Questions",
          heading: "Frequently Asked Questions",
          subheading: "Quick answers about booking, airports, pricing, and more.",
          primaryMedia: img(DEMO.homeFaq, "Traveler reviewing transportation information"),
          primaryCta: cta("View All FAQs", "/faqs"),
          theme: "ivory",
        }),
        section("home-cta", "cta", "Final Conversion", 11, {
          eyebrow: "Ready to Travel",
          heading: "Private Travel, Precisely Arranged",
          body: "Call now, request a quote, or book your ride online. SierraLink serves Albany and the Capital Region with professional private transportation.",
          primaryCta: cta("Call Now", "tel:+15182900675"),
          secondaryCta: cta("Get a Quote", "/booking?mode=quote"),
          theme: "gold",
        }),
      ],
    },
    {
      slug: "about",
      title: "About",
      published: true,
      order: 1,
      hero: {
        eyebrow: "About SierraLink",
        heading: "Professional Travel, Made Simple",
        subheading: ABOUT_STATEMENT,
        backgroundImage: img(DEMO.pageAbout, "SierraLink professional transportation team moment"),
      },
      seo: {
        title: "About SierraLink Executive Transportation",
        description: ABOUT_STATEMENT,
        socialImage: DEMO.about1,
      },
      sections: [
        section("about-positioning", "richText", "Company Positioning", 0, {
          heading: "Who We Are",
          body: ABOUT_STATEMENT,
          primaryMedia: img(DEMO.about2, "Luxury transportation vehicle exterior"),
          theme: "ivory",
        }),
        section("about-audience", "passengerTypes", "Who We Serve", 1, {
          heading: "Who SierraLink Serves",
          items: [
            { label: "Individuals", description: "Personal appointments and private travel." },
            { label: "Families", description: "Group transportation with luggage." },
            { label: "Business professionals", description: "Meetings and executive travel." },
            { label: "Corporate clients", description: "Employee and guest transportation." },
            { label: "Travelers & tourists", description: "Airport and hotel connections." },
            { label: "Local residents", description: "Everyday private rides across the region." },
          ],
          primaryMedia: img(DEMO.about3, "Diverse travelers using private car service"),
          theme: "charcoal",
        }),
        section("about-philosophy", "editorial", "Service Philosophy", 2, {
          heading: "Reliability, Comfort, and Clear Communication",
          body: "We focus on dependable service, comfortable vehicles, and straightforward booking—without unsupported claims or fine print surprises.",
          media: [img(DEMO.about4, "Chauffeur providing professional service")],
          theme: "black",
        }),
        section("about-local", "splitMedia", "Local Knowledge", 3, {
          heading: "Capital Region Expertise",
          body: "From Albany to Saratoga Springs, Clifton Park, Latham, and Schenectady, we understand the routes and communities our clients travel through every day.",
          primaryMedia: img(DEMO.areas2, "Saratoga Springs area streetscape"),
          media: [img(DEMO.areas1, "Albany Capital Region skyline")],
          layout: "image-left",
          theme: "gold",
        }),
        section("about-capability", "routeStory", "Airport to Long-Distance", 4, {
          heading: "From ALB Connections to Long-Distance Travel",
          body: "SierraLink supports airport transfers, local rides, executive travel, and long-distance private transportation—including Capital Region to JFK connections.",
          primaryMedia: img(DEMO.about5, "Long-distance route from Capital Region"),
          media: [img(DEMO.longDistanceService, "Highway travel at dusk")],
          primaryCta: cta("Our Services", "/services"),
          theme: "charcoal",
        }),
        section("about-cta", "cta", "Booking CTA", 5, {
          heading: "Experience SierraLink",
          body: "Request a quote or book your next ride with professional Capital Region transportation.",
          primaryMedia: img(DEMO.about1, "About page hero vehicle"),
          primaryCta: cta("Book a Ride", "/booking"),
          secondaryCta: cta("Contact Us", "/contact"),
          theme: "black",
        }),
      ],
    },
    {
      slug: "services",
      title: "Services",
      published: true,
      order: 2,
      hero: {
        eyebrow: "Services",
        heading: "Private Transportation for Every Occasion",
        subheading: "Airport, local, long-distance, executive, corporate, hotel, and private car service—each available by quote.",
        backgroundImage: img(DEMO.pageServices, "Fleet of luxury vehicles for private hire"),
      },
      seo: {
        title: "Transportation Services | SierraLink",
        description:
          "Airport, local, long-distance, executive, corporate, hotel, and private car service in Albany and the Capital Region.",
        socialImage: DEMO.services1,
      },
      sections: [
        section("services-cards", "serviceCards", "Service Cards", 0, {
          heading: "Our Seven Core Services",
          theme: "ivory",
        }),
        section("services-comparison", "comparison", "Airport vs Local vs Long-Distance", 1, {
          heading: "Choose the Right Service",
          body: "Airport transportation focuses on ALB and JFK connections. Local rides cover Capital Region communities. Long-distance service handles intercity private travel.",
          primaryMedia: img(DEMO.services2, "Airport versus local travel comparison"),
          media: [img(DEMO.services3, "Long-distance travel route")],
          theme: "charcoal",
        }),
        section("services-passengers", "passengerTypes", "Passenger Types", 2, {
          heading: "Who Each Service Supports",
          items: [
            { label: "Airport travelers", description: "ALB, JFK, and requested airports." },
            { label: "Local residents", description: "Short-distance Capital Region rides." },
            { label: "Business travelers", description: "Executive and corporate transportation." },
          ],
          primaryMedia: img(DEMO.services4, "Passengers boarding private vehicle"),
          theme: "black",
        }),
        section("services-pricing", "pricingInfo", "Quote-Based Pricing", 3, {
          heading: "Pricing by Quote",
          body: PRICING_STATEMENT,
          theme: "gold",
        }),
        section("services-process", "bookingProcess", "Booking Process", 4, {
          heading: "How to Book",
          items: [
            { title: "Select your service", description: "Choose airport, local, long-distance, or specialty service." },
            { title: "Submit details", description: "Share addresses, schedule, and passenger information." },
            { title: "Receive your quote", description: "Pricing confirmed based on your trip requirements." },
          ],
          primaryMedia: img(DEMO.services5, "Booking process illustration"),
          theme: "ivory",
        }),
        section("services-areas-cta", "cta", "Service Areas CTA", 5, {
          heading: "Serving the Capital Region",
          body: "Explore our service areas and request transportation for your next trip.",
          primaryMedia: img(DEMO.areas3, "Clifton Park area transportation"),
          media: [img(DEMO.areas4, "Latham area route")],
          primaryCta: cta("Service Areas", "/service-areas"),
          secondaryCta: cta("Get a Quote", "/booking?mode=quote"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "fleet",
      title: "Fleet",
      published: true,
      order: 3,
      hero: {
        eyebrow: "Fleet",
        heading: "Comfortable Private Vehicles",
        subheading: "Vehicle details are confirmed for your trip. Demo records below are illustrative until replaced with verified fleet information.",
        backgroundImage: img(DEMO.pageFleet, "Luxury fleet lineup"),
      },
      seo: {
        title: "Fleet | SierraLink Executive Transportation",
        description: "Explore SierraLink private transportation vehicles. Details confirmed per trip.",
        socialImage: DEMO.fleet1,
      },
      sections: [
        section("fleet-intro", "richText", "Fleet Introduction", 0, {
          body: "Our fleet showcase highlights the types of comfortable private vehicles used for SierraLink transportation. Specific vehicle assignment is confirmed when your trip is approved.",
          primaryMedia: img(DEMO.fleet2, "Luxury sedan exterior detail"),
          theme: "charcoal",
        }),
        section("fleet-preview", "fleetPreview", "Vehicle Cards", 1, {
          heading: "Vehicle Options",
          subheading: "Published vehicles appear here. Demo records remain unpublished until verified.",
          theme: "black",
        }),
        section("fleet-gallery", "galleryRail", "Vehicle Gallery", 2, {
          heading: "Interior & Exterior Details",
          media: [
            img(DEMO.fleet3, "Leather interior seating"),
            img(DEMO.fleet4, "Vehicle door and handle detail"),
            img(DEMO.fleet5, "Luggage loading scene"),
          ],
          theme: "ivory",
        }),
        section("fleet-luggage", "richText", "Luggage Guidance", 3, {
          heading: "Luggage & Passenger Fit",
          body: "Share passenger and luggage counts when booking. Vehicle suitability is confirmed during the booking process.",
          primaryMedia: img(DEMO.gallery4, "Luggage placed in vehicle trunk"),
          theme: "gold",
        }),
        section("fleet-cta", "cta", "Fleet CTA", 4, {
          heading: "Confirm Vehicle Details for Your Trip",
          body: "Request a quote and we will confirm the right vehicle for your party and luggage.",
          primaryMedia: img(DEMO.vehicleSuv, "SUV for group transportation"),
          media: [img(DEMO.vehicleSedan, "Sedan for executive travel")],
          primaryCta: cta("Request a Quote", "/booking?mode=quote"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "service-areas",
      title: "Service Areas",
      published: true,
      order: 4,
      hero: {
        eyebrow: "Service Areas",
        heading: "Capital Region Private Transportation",
        subheading: "Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and surrounding communities.",
        backgroundImage: img(DEMO.pageAreas, "Albany Capital Region aerial view"),
      },
      seo: {
        title: "Service Areas | SierraLink Capital Region",
        description:
          "Private transportation in Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and the Capital Region.",
        socialImage: DEMO.areas1,
      },
      sections: [
        section("areas-intro", "richText", "Service Area Overview", 0, {
          body: "SierraLink provides private airport, local, long-distance, executive, and corporate transportation throughout the Capital Region and beyond.",
          primaryMedia: img(DEMO.areas2, "Saratoga Springs downtown"),
          theme: "ivory",
        }),
        section("areas-grid", "locationGrid", "Location Grid", 1, {
          heading: "Communities We Serve",
          theme: "charcoal",
        }),
        section("areas-airports", "airportSpotlight", "Airport Connectivity", 2, {
          heading: "ALB & JFK Connections",
          items: [
            { code: "ALB", name: "Albany International Airport" },
            { code: "JFK", name: "John F. Kennedy International Airport" },
          ],
          primaryMedia: img(DEMO.homeAirport, "Airport connection from Capital Region"),
          media: [img(DEMO.homeAirport2, "JFK long-distance connection")],
          theme: "black",
        }),
        section("areas-scenarios", "editorial", "Travel Scenarios", 3, {
          heading: "Local & Long-Distance from Your Community",
          body: "From residential pickups in Clifton Park to executive travel in Albany and long-distance trips to JFK, we coordinate private transportation across the region.",
          media: [
            img(DEMO.areas3, "Clifton Park residential pickup"),
            img(DEMO.areas4, "Latham business district travel"),
            img(DEMO.areas5, "Schenectady area transportation"),
          ],
          theme: "gold",
        }),
        section("areas-cta", "cta", "Service Areas CTA", 4, {
          heading: "Transportation in Your Area",
          primaryMedia: img(DEMO.areas1, "Capital Region map concept"),
          primaryCta: cta("Book a Ride", "/booking"),
          secondaryCta: cta("Call Now", "tel:+15182900675"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "gallery",
      title: "Gallery",
      published: true,
      order: 5,
      hero: {
        eyebrow: "Gallery",
        heading: "Travel in Motion",
        subheading: "Illustrative demo imagery—replace with your own licensed photos before publishing.",
        backgroundImage: img(DEMO.pageGallery, "Gallery hero collage of transportation scenes"),
      },
      seo: {
        title: "Gallery | SierraLink",
        description: "Photo gallery of private transportation, airport travel, and executive travel scenes.",
        socialImage: DEMO.gallery1,
      },
      sections: [
        section("gallery-intro", "richText", "Gallery Introduction", 0, {
          body: "Browse categories including vehicles, airport travel, executive travel, local and long-distance routes, and interior details.",
          primaryMedia: img(DEMO.gallery2, "Gallery grid preview"),
          theme: "black",
        }),
        section("gallery-mosaic", "imageMosaic", "Image Mosaic", 1, {
          heading: "Featured Moments",
          media: [
            img(DEMO.gallery1, "Airport curbside pickup"),
            img(DEMO.gallery2, "Executive travel interior"),
            img(DEMO.gallery3, "Local Capital Region street"),
            img(DEMO.gallery4, "Vehicle detail close-up"),
            img(DEMO.gallery5, "Night highway travel"),
          ],
          theme: "charcoal",
        }),
        section("gallery-rail", "galleryRail", "Gallery Rail", 2, {
          heading: "Categories",
          theme: "ivory",
        }),
        section("gallery-note", "richText", "Demo Note", 3, {
          body: "Demo gallery images are illustrative placeholders. Replace with your own licensed photography before publishing as SierraLink-owned vehicles.",
          primaryMedia: img(DEMO.gallery3, "Placeholder gallery image note"),
          theme: "gold",
        }),
        section("gallery-cta", "cta", "Gallery CTA", 4, {
          heading: "Ready for Your Own Journey?",
          primaryMedia: img(DEMO.gallery5, "Gallery CTA background road"),
          media: [img(DEMO.gallery4, "Gallery detail shot")],
          primaryCta: cta("Book a Ride", "/booking"),
          theme: "black",
        }),
      ],
    },
    {
      slug: "testimonials",
      title: "Testimonials",
      published: true,
      order: 6,
      hero: {
        eyebrow: "Testimonials",
        heading: "Client Experiences",
        subheading: "Real feedback from clients who rely on SierraLink for airport, executive, local, and long-distance travel.",
        backgroundImage: img(DEMO.pageTestimonials, "Elegant testimonial page background"),
      },
      seo: {
        title: "Testimonials | SierraLink",
        description: "Client testimonials for SierraLink Executive Transportation.",
        socialImage: DEMO.testimonials1,
      },
      sections: [
        section("testimonials-intro", "richText", "Introduction", 0, {
          body: "SierraLink is trusted for professional private transportation throughout Albany and the Capital Region. Read what clients have shared about their experiences.",
          primaryMedia: img(DEMO.testimonials2, "Client experience editorial image"),
          theme: "ivory",
        }),
        section("testimonials-slider", "testimonials", "Testimonial Slider", 1, {
          heading: "What Clients Say",
          theme: "charcoal",
        }),
        section("testimonials-editorial", "splitMedia", "Editorial", 2, {
          heading: "Professional Service You Can Count On",
          body: "SierraLink focuses on reliable private transportation and clear communication from booking through arrival.",
          primaryMedia: img(DEMO.testimonials3, "Professional service moment"),
          media: [img(DEMO.testimonials4, "Traveler satisfaction scene")],
          theme: "black",
        }),
        section("testimonials-visual", "imageMosaic", "Visual Placements", 3, {
          media: [
            img(DEMO.testimonials1, "Testimonial page visual 1"),
            img(DEMO.testimonials2, "Testimonial page visual 2"),
            img(DEMO.testimonials5, "Testimonial page visual 3"),
          ],
          theme: "gold",
        }),
        section("testimonials-cta", "cta", "Testimonials CTA", 4, {
          heading: "Experience SierraLink",
          primaryMedia: img(DEMO.testimonials5, "Booking encouragement image"),
          primaryCta: cta("Book a Ride", "/booking"),
          secondaryCta: cta("Contact Us", "/contact"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "faqs",
      title: "FAQs",
      published: true,
      order: 7,
      hero: {
        eyebrow: "FAQs",
        heading: "Frequently Asked Questions",
        subheading: "Answers about booking, airports, pricing, and special requests—without unverified policies.",
        backgroundImage: img(DEMO.pageFaqs, "FAQ page hero with travel context"),
      },
      seo: {
        title: "FAQs | SierraLink Executive Transportation",
        description: "Frequently asked questions about booking, airports, pricing, and private transportation.",
        socialImage: DEMO.faqs1,
      },
      sections: [
        section("faqs-intro", "richText", "FAQ Introduction", 0, {
          body: "Browse categorized answers below. For trip-specific questions, call or contact us directly.",
          primaryMedia: img(DEMO.faqs2, "Traveler reading FAQ information"),
          theme: "ivory",
        }),
        section("faqs-accordion", "faqs", "FAQ Accordion", 1, {
          heading: "All Categories",
          theme: "charcoal",
        }),
        section("faqs-airport", "splitMedia", "Airport FAQ Context", 2, {
          heading: "Airport Travel Questions",
          body: "Learn about ALB and JFK connections, flight details, and pickup coordination.",
          primaryMedia: img(DEMO.faqs3, "Airport FAQ editorial image"),
          theme: "black",
        }),
        section("faqs-pricing", "pricingInfo", "Pricing FAQ", 3, {
          heading: "Quote-Based Pricing",
          body: PRICING_STATEMENT,
          primaryMedia: img(DEMO.faqs4, "Pricing information editorial"),
          theme: "gold",
        }),
        section("faqs-cta", "cta", "FAQ CTA", 4, {
          heading: "Still Have Questions?",
          primaryMedia: img(DEMO.faqs5, "Contact support travel scene"),
          media: [img(DEMO.faqs1, "FAQ hero alternate")],
          primaryCta: cta("Contact Us", "/contact"),
          secondaryCta: cta("Get a Quote", "/booking?mode=quote"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "booking",
      title: "Booking",
      published: true,
      order: 8,
      hero: {
        eyebrow: "Book or Quote",
        heading: "Request Your Ride",
        subheading: "Submit trip details for booking or a custom quote. Your request is reviewed before confirmation.",
        backgroundImage: img(DEMO.pageBooking, "Booking page hero with luxury vehicle"),
      },
      seo: {
        title: "Book or Request a Quote | SierraLink",
        description: "Book private transportation or request a quote for airport, local, and long-distance travel.",
        socialImage: DEMO.booking1,
      },
      sections: [
        section("booking-intro", "richText", "Booking Introduction", 0, {
          body: "Complete the multi-step form with ride type, addresses, schedule, passenger details, and contact information.",
          primaryMedia: img(DEMO.booking2, "Mobile booking form on phone"),
          theme: "ivory",
        }),
        section("booking-process", "bookingProcess", "Booking Steps", 1, {
          heading: "What to Expect",
          items: [
            { title: "Submit your request", description: "Share complete trip and contact details." },
            { title: "Review & confirmation", description: "SierraLink reviews availability and responds." },
            { title: "Quote or payment", description: "Approved quotes may include secure payment when enabled." },
          ],
          theme: "charcoal",
        }),
        section("booking-pricing", "pricingInfo", "Pricing Note", 2, {
          heading: "Quote-Based Pricing",
          body: PRICING_STATEMENT,
          primaryMedia: img(DEMO.booking3, "Quote review illustration"),
          theme: "gold",
        }),
        section("booking-visual", "imageMosaic", "Booking Visuals", 3, {
          media: [
            img(DEMO.booking1, "Booking hero vehicle"),
            img(DEMO.booking2, "Booking on mobile"),
            img(DEMO.booking4, "Passenger boarding"),
            img(DEMO.booking5, "Trip confirmation concept"),
          ],
          theme: "black",
        }),
        section("booking-contact", "contactPanel", "Need Help?", 4, {
          heading: "Questions Before You Book?",
          body: "Call (518) 290-0675 or email info@sierralinkexecutivetransportation.com for assistance.",
          primaryCta: cta("Call Now", "tel:+15182900675"),
          secondaryCta: cta("Contact Form", "/contact"),
          primaryMedia: img(DEMO.booking5, "Customer support for booking"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "contact",
      title: "Contact",
      published: true,
      order: 9,
      hero: {
        eyebrow: "Contact",
        heading: "Get in Touch",
        subheading: "Call, email, or send an inquiry. We serve Albany and the Capital Region.",
        backgroundImage: img(DEMO.pageContact, "Contact page hero with professional service"),
      },
      seo: {
        title: "Contact SierraLink Executive Transportation",
        description: "Contact SierraLink by phone or email for private transportation in the Capital Region.",
        socialImage: DEMO.contact1,
      },
      sections: [
        section("contact-info", "contactPanel", "Contact Information", 0, {
          heading: "Reach SierraLink",
          body: "Primary: (518) 290-0675 | Alternate: (914) 483-2266 | info@sierralinkexecutivetransportation.com",
          primaryCta: cta("Call Primary", "tel:+15182900675"),
          secondaryCta: cta("Email Us", "mailto:info@sierralinkexecutivetransportation.com"),
          primaryMedia: img(DEMO.contact2, "Phone and email contact visual"),
          theme: "charcoal",
        }),
        section("contact-area", "richText", "Service Area", 1, {
          heading: "Service Area",
          body: "Saratoga Springs, Clifton Park, Latham, Albany, Schenectady, and surrounding Capital Region areas.",
          primaryMedia: img(DEMO.contact3, "Capital Region service area map concept"),
          theme: "ivory",
        }),
        section("contact-cta", "cta", "Contact CTA", 2, {
          heading: "Ready to Travel?",
          primaryMedia: img(DEMO.contact3, "Contact CTA background"),
          primaryCta: cta("Book a Ride", "/booking"),
          secondaryCta: cta("Get a Quote", "/booking?mode=quote"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "blog",
      title: "Blog",
      published: true,
      order: 10,
      hero: {
        eyebrow: "Blog & News",
        heading: "Travel Insights & Tips",
        subheading: "Practical guidance for airport transfers, executive travel, and long-distance private transportation.",
        backgroundImage: img(DEMO.pageBlog, "Blog index hero with travel editorial"),
      },
      seo: {
        title: "Blog | SierraLink Executive Transportation",
        description: "Travel tips and insights for private transportation in Albany and the Capital Region.",
        socialImage: DEMO.blogIndex1,
      },
      sections: [
        section("blog-intro", "richText", "Blog Introduction", 0, {
          body: "Evergreen articles to help you plan airport transfers, executive travel, and long-distance trips.",
          primaryMedia: img(DEMO.blogIndex2, "Blog reading scene"),
          theme: "ivory",
        }),
        section("blog-preview", "blogPreview", "Blog Preview", 1, {
          heading: "Latest Articles",
          theme: "charcoal",
        }),
        section("blog-featured", "editorial", "Featured Topics", 2, {
          heading: "Popular Topics",
          items: [
            { label: "Airport planning", href: "/blog/planning-your-airport-transfer" },
            { label: "Executive travel", href: "/blog/executive-travel-preparation" },
            { label: "Long-distance booking", href: "/blog/booking-long-distance-private-transportation" },
          ],
          primaryMedia: img(DEMO.blogIndex3, "Featured blog topics collage"),
          media: [img(DEMO.blogIndex4, "Travel editorial image")],
          theme: "black",
        }),
        section("blog-visual", "imageMosaic", "Blog Visuals", 3, {
          media: [
            img(DEMO.blogAirport, "Airport blog featured"),
            img(DEMO.blogExecutive, "Executive blog featured"),
            img(DEMO.blogLongDistance, "Long-distance blog featured"),
            img(DEMO.blogIndex5, "Blog index visual"),
          ],
          theme: "gold",
        }),
        section("blog-cta", "cta", "Blog CTA", 4, {
          heading: "Plan Your Next Trip",
          primaryMedia: img(DEMO.blogIndex1, "Blog CTA background"),
          primaryCta: cta("Book a Ride", "/booking"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      published: true,
      order: 11,
      hero: {
        eyebrow: "Legal",
        heading: "Privacy Policy",
        subheading: "Starter policy for business and legal review. Update before production launch.",
        backgroundImage: img(DEMO.pageLegal, "SierraLink privacy policy"),
      },
      seo: {
        title: "Privacy Policy | SierraLink",
        description: "Privacy policy for SierraLink Executive Transportation LLC.",
      },
      sections: [
        section("privacy-intro", "richText", "Privacy Introduction", 0, {
          body: "This starter privacy policy describes how SierraLink Executive Transportation LLC may collect, use, and protect personal information submitted through this website. This document requires legal review before publication.",
          primaryMedia: img(DEMO.about2, "Privacy policy editorial"),
          theme: "ivory",
        }),
        section("privacy-collection", "richText", "Information Collection", 1, {
          heading: "Information We May Collect",
          body: "When you submit a booking, quote request, or contact inquiry, we may collect your name, email, phone number, trip details, and other information you provide voluntarily.",
          primaryMedia: img(DEMO.booking3, "Data collection illustration"),
          theme: "charcoal",
        }),
        section("privacy-use", "richText", "Use of Information", 2, {
          heading: "How Information Is Used",
          body: "Information is used to respond to requests, coordinate transportation, process approved quotes and payments when enabled, and improve our services.",
          media: [img(DEMO.contact4, "Secure information handling concept")],
          theme: "black",
        }),
        section("privacy-cookies", "richText", "Cookies & Analytics", 3, {
          heading: "Cookies and Analytics",
          body: "If analytics are configured and consent is required, tracking is enabled only according to your site settings. Cookie details should be finalized with legal counsel.",
          primaryMedia: img(DEMO.faqs4, "Cookies and analytics note"),
          theme: "gold",
        }),
        section("privacy-contact", "contactPanel", "Privacy Contact", 4, {
          heading: "Privacy Questions",
          body: "Contact info@sierralinkexecutivetransportation.com with privacy-related questions.",
          primaryMedia: img(DEMO.contact2, "Privacy contact visual"),
          primaryCta: cta("Email Us", "mailto:info@sierralinkexecutivetransportation.com"),
          theme: "charcoal",
        }),
      ],
    },
    {
      slug: "terms",
      title: "Terms & Booking Policy",
      published: true,
      order: 12,
      hero: {
        eyebrow: "Legal",
        heading: "Terms & Booking Policy",
        subheading: "Starter terms for business and legal review. Cancellation and refund terms apply only when configured.",
        backgroundImage: img(DEMO.pageLegal, "SierraLink terms of service"),
      },
      seo: {
        title: "Terms & Booking Policy | SierraLink",
        description: "Terms and booking policy for SierraLink Executive Transportation LLC.",
      },
      sections: [
        section("terms-intro", "richText", "Terms Introduction", 0, {
          body: "These starter terms describe the relationship between SierraLink Executive Transportation LLC and customers using this website. Legal review is required before production use.",
          primaryMedia: img(DEMO.services5, "Terms introduction visual"),
          theme: "ivory",
        }),
        section("terms-booking", "richText", "Booking vs Confirmation", 1, {
          heading: "Booking Requests vs Confirmed Reservations",
          body: "Online submissions are requests for transportation. A reservation is confirmed only after SierraLink reviews and approves your trip or quote.",
          primaryMedia: img(DEMO.booking4, "Booking confirmation distinction"),
          theme: "charcoal",
        }),
        section("terms-payment", "pricingInfo", "Payment Terms", 2, {
          heading: "Payment",
          body: "Pricing is quote-based. Payment may be requested through approved quotes and secure payment processing when enabled. Payment terms are provided with your quote.",
          primaryMedia: img(DEMO.booking5, "Payment terms illustration"),
          theme: "black",
        }),
        section("terms-cancellation", "richText", "Cancellation", 3, {
          heading: "Cancellation & Refunds",
          body: "Cancellation and refund policies are provided when configured in admin and included with your confirmed quote. Contact SierraLink to discuss changes to your reservation.",
          media: [img(DEMO.faqs5, "Cancellation policy note")],
          theme: "gold",
        }),
        section("terms-contact", "contactPanel", "Terms Contact", 4, {
          heading: "Questions About These Terms",
          body: "Email info@sierralinkexecutivetransportation.com or call (518) 290-0675.",
          primaryMedia: img(DEMO.contact5, "Terms contact visual"),
          primaryCta: cta("Contact Us", "/contact"),
          theme: "charcoal",
        }),
      ],
    },
  ];
}
