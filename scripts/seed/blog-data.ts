import type { BlogContentBlock } from "@/types";
import { DEMO, img } from "./helpers";

export interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  contentBlocks: BlogContentBlock[];
  seoTitle: string;
  seoDescription: string;
}

export const BLOG_POSTS: BlogSeed[] = [
  {
    slug: "planning-your-airport-transfer",
    title: "Planning Your Airport Transfer: What to Share When You Book",
    excerpt:
      "A practical checklist for arranging private airport transportation to or from ALB, JFK, and other airports—without guesswork.",
    category: "Travel Tips",
    tags: ["airport", "ALB", "JFK", "booking"],
    featuredImage: DEMO.blogAirport,
    featuredImageAlt: "Traveler with luggage at airport curbside",
    seoTitle: "Airport Transfer Planning Guide | SierraLink Blog",
    seoDescription:
      "How to plan a private airport transfer in Albany and the Capital Region, including what details to provide when booking.",
    contentBlocks: [
      {
        type: "paragraph",
        content:
          "Arranging private airport transportation is easiest when you share the right details upfront. Whether you are traveling through Albany International Airport (ALB) or connecting via JFK, a few minutes of preparation helps your transportation provider confirm timing and routing accurately.",
      },
      {
        type: "heading",
        level: 2,
        content: "Confirm your flight direction",
      },
      {
        type: "paragraph",
        content:
          "Let your provider know whether you need an arrival pickup or a departure drop-off. For arrivals, share your scheduled landing time and airline when available. For departures, allow enough travel time based on your preferred airport arrival window.",
      },
      {
        type: "heading",
        level: 2,
        content: "Share pickup and destination details",
      },
      {
        type: "list",
        items: [
          "Full pickup address or airport terminal area",
          "Destination address or airport code",
          "Passenger count and luggage count",
          "Preferred contact method for day-of updates",
        ],
      },
      {
        type: "image",
        media: img(DEMO.blogAirport, "Airport transfer planning"),
      },
      {
        type: "heading",
        level: 2,
        content: "Request your quote early",
      },
      {
        type: "paragraph",
        content:
          "SierraLink provides pricing by quote based on pickup, destination, distance, and trip requirements. Submitting your request in advance allows time to confirm availability and trip details before your travel date.",
      },
      {
        type: "quote",
        content:
          "Clear trip details at booking lead to clearer confirmations—especially for early-morning departures and late-evening arrivals.",
      },
    ],
  },
  {
    slug: "executive-travel-preparation",
    title: "Executive Travel Preparation: Staying on Schedule in the Capital Region",
    excerpt:
      "Practical steps for business travelers arranging private transportation for meetings, airport connections, and multi-stop days.",
    category: "Business Travel",
    tags: ["executive", "corporate", "Capital Region"],
    featuredImage: DEMO.blogExecutive,
    featuredImageAlt: "Executive traveler in a luxury vehicle",
    seoTitle: "Executive Travel Preparation | SierraLink Blog",
    seoDescription:
      "Tips for preparing executive private transportation in Albany and the Capital Region for meetings and business travel.",
    contentBlocks: [
      {
        type: "paragraph",
        content:
          "Executive travel often involves tight schedules, multiple stops, and last-minute adjustments. Pre-arranged private transportation can support your day when trip details are organized and communicated clearly.",
      },
      {
        type: "heading",
        level: 2,
        content: "Build a simple itinerary",
      },
      {
        type: "paragraph",
        content:
          "List each stop in order with approximate timing windows. Include airport connections, hotel pickups, and meeting locations. If your schedule changes, update your transportation contact as soon as possible.",
      },
      {
        type: "list",
        items: [
          "Primary contact name and phone number",
          "Backup contact for assistants or coordinators",
          "Meeting addresses with suite or building details",
          "Any special instructions for pickup locations",
        ],
      },
      {
        type: "image",
        media: img(DEMO.blogExecutive, "Executive travel in private vehicle"),
      },
      {
        type: "heading",
        level: 2,
        content: "Coordinate airport connections",
      },
      {
        type: "paragraph",
        content:
          "For ALB or JFK connections, share flight information when available and confirm whether you need curbside pickup or a specific terminal area. Pricing and availability are confirmed by quote based on your route and requirements.",
      },
    ],
  },
  {
    slug: "booking-long-distance-private-transportation",
    title: "Booking Long-Distance Private Transportation: Questions to Ask",
    excerpt:
      "What to consider when arranging a private long-distance ride from the Capital Region to NYC, upstate destinations, or other requested routes.",
    category: "Travel Tips",
    tags: ["long-distance", "private car", "New York"],
    featuredImage: DEMO.blogLongDistance,
    featuredImageAlt: "Luxury vehicle on a long-distance highway route",
    seoTitle: "Booking Long-Distance Private Transportation | SierraLink Blog",
    seoDescription:
      "Key questions and details for booking long-distance private transportation from Albany and the Capital Region.",
    contentBlocks: [
      {
        type: "paragraph",
        content:
          "Long-distance private transportation involves more variables than a local ride—route, timing, passenger needs, and stops along the way. Asking the right questions helps you book with confidence.",
      },
      {
        type: "heading",
        level: 2,
        content: "Define your route clearly",
      },
      {
        type: "paragraph",
        content:
          "Provide exact pickup and drop-off addresses. If you need intermediate stops, list them when requesting your quote so routing and timing can be reviewed together.",
      },
      {
        type: "heading",
        level: 2,
        content: "Share passenger and luggage details",
      },
      {
        type: "list",
        items: [
          "Number of passengers",
          "Luggage count and oversized items",
          "Child seats or accessibility requests (availability confirmed during booking)",
          "Preferred departure time and any schedule constraints",
        ],
      },
      {
        type: "image",
        media: img(DEMO.blogLongDistance, "Long-distance private transportation route"),
      },
      {
        type: "heading",
        level: 2,
        content: "Understand quote-based pricing",
      },
      {
        type: "paragraph",
        content:
          "SierraLink provides pricing by quote. Your total reflects pickup, destination, distance, trip type, and transportation requirements. Request a quote or book online to receive confirmed pricing for your specific trip.",
      },
    ],
  },
];
