import type { ServiceDetailSection } from "@/types";
import { cta, DEMO, img } from "./helpers";

export interface ServiceSeed {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  features: string[];
  mainImage: string;
  mainImageAlt: string;
  order: number;
  detailHero: { heading: string; subheading: string; background: string; alt: string };
  sections: ServiceDetailSection[];
  seoTitle: string;
  seoDescription: string;
}

function detailSection(
  type: string,
  order: number,
  fields: Partial<ServiceDetailSection> = {}
): ServiceDetailSection {
  return {
    type,
    visible: true,
    order,
    ...fields,
  };
}

export const SERVICES: ServiceSeed[] = [
  {
    slug: "airport-transportation",
    title: "Airport Transportation",
    shortDescription:
      "Pre-arranged pickup and drop-off service for Albany International Airport (ALB), JFK Airport, and other requested airports.",
    icon: "plane",
    features: [
      "ALB and JFK airport service",
      "Pre-arranged pickup and drop-off",
      "Flight details captured at booking",
      "Private, comfortable vehicles",
    ],
    mainImage: DEMO.airportService,
    mainImageAlt: "Luxury sedan at airport curbside pickup area",
    order: 1,
    detailHero: {
      heading: "Airport Transportation",
      subheading:
        "Private, pre-arranged transportation to and from Albany International Airport (ALB), JFK, and other requested airports.",
      background: DEMO.airportService,
      alt: "Executive vehicle at airport terminal arrival area",
    },
    seoTitle: "Airport Transportation Albany & Capital Region | SierraLink",
    seoDescription:
      "Pre-arranged private airport transportation for ALB, JFK, and other airports serving Albany and New York's Capital Region.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "SierraLink provides pre-arranged private airport transportation for arrivals and departures. Share your flight details, pickup location, and passenger count when you request a quote or book online.",
        media: [img(DEMO.airportService, "Airport curbside private car service")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Business travelers", description: "Reliable airport transfers for meetings and conferences." },
          { label: "Families", description: "Comfortable rides with room for luggage and passengers." },
          { label: "Visitors", description: "Straightforward transportation to hotels and residences." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "ALB arrivals", description: "Pickup from Albany International Airport to your destination." },
          { label: "ALB departures", description: "Timely drop-off for outbound flights from ALB." },
          { label: "JFK connections", description: "Long-distance private transportation to or from JFK." },
          { label: "Other airports", description: "Request service for additional airports when scheduling." },
        ],
        media: [img(DEMO.homeAirport2, "Traveler with luggage at airport terminal")],
      }),
      detailSection("airports", 3, {
        type: "airportSpotlight",
        heading: "Primary Airports",
        body: "We regularly serve Albany International Airport (ALB) and John F. Kennedy International Airport (JFK). Additional airports may be requested when you book.",
        items: [
          { code: "ALB", name: "Albany International Airport" },
          { code: "JFK", name: "John F. Kennedy International Airport" },
        ],
      }),
      detailSection("booking", 4, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Provide pickup or drop-off location, date and time, passenger and luggage counts, and flight details when available. Pricing is provided by quote.",
        items: [
          { label: "Airport code (ALB, JFK, or Other)" },
          { label: "Arrival or departure" },
          { label: "Airline and flight number (optional)" },
          { label: "Contact phone and preferred contact method" },
        ],
        primaryCta: cta("Request Airport Quote", "/booking?mode=quote&rideType=airport"),
      }),
    ],
  },
  {
    slug: "local-transportation",
    title: "Local Transportation",
    shortDescription:
      "Short-distance rides throughout Albany, Clifton Park, Saratoga Springs, Latham, Schenectady, and nearby areas.",
    icon: "map-pin",
    features: [
      "Capital Region local rides",
      "Homes, hotels, and businesses",
      "Flexible scheduling",
      "Quote-based pricing",
    ],
    mainImage: DEMO.localService,
    mainImageAlt: "Luxury sedan on a Capital Region city street",
    order: 2,
    detailHero: {
      heading: "Local Transportation",
      subheading: "Private rides throughout Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and nearby communities.",
      background: DEMO.localService,
      alt: "Private car service in downtown Albany",
    },
    seoTitle: "Local Transportation Albany & Capital Region | SierraLink",
    seoDescription:
      "Private local transportation in Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and surrounding Capital Region areas.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "When you need a comfortable private ride across town or to a nearby community, SierraLink provides pre-arranged local transportation with clear communication and professional service.",
        media: [img(DEMO.localService, "Local private transportation in the Capital Region")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Residents", description: "Appointments, events, and everyday travel." },
          { label: "Visitors", description: "Hotel, restaurant, and attraction transportation." },
          { label: "Professionals", description: "Meetings and client visits across the region." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Hotel transfers", description: "Pickup and drop-off at area hotels." },
          { label: "Business meetings", description: "Travel between offices and venues." },
          { label: "Evening events", description: "Pre-arranged rides for dinners and occasions." },
        ],
      }),
      detailSection("destinations", 3, {
        type: "destinations",
        heading: "Pickup & Destination Possibilities",
        body: "Share your pickup address and destination when requesting a quote. Service covers Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and surrounding areas.",
        media: [img(DEMO.areas1, "Capital Region streetscape")],
      }),
      detailSection("booking", 4, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Include pickup and destination addresses, date and time, and passenger details. Pricing is confirmed by quote.",
        primaryCta: cta("Book Local Ride", "/booking?mode=booking&rideType=local"),
      }),
    ],
  },
  {
    slug: "long-distance-transportation",
    title: "Long-Distance Transportation",
    shortDescription:
      "Private transportation for longer trips within New York and to other requested destinations.",
    icon: "route",
    features: [
      "Intercity private travel",
      "New York statewide service",
      "Other destinations on request",
      "Comfortable long-form rides",
    ],
    mainImage: DEMO.longDistanceService,
    mainImageAlt: "Luxury vehicle on a highway at dusk",
    order: 3,
    detailHero: {
      heading: "Long-Distance Transportation",
      subheading: "Private transportation for longer journeys within New York and to destinations you specify.",
      background: DEMO.longDistanceService,
      alt: "Long-distance private car on upstate New York highway",
    },
    seoTitle: "Long-Distance Private Transportation | SierraLink",
    seoDescription:
      "Private long-distance transportation from Albany and the Capital Region to destinations across New York and beyond, by quote.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "For trips beyond a local radius, SierraLink arranges private long-distance transportation tailored to your schedule, route, and passenger needs.",
        media: [img(DEMO.longDistanceService, "Long-distance private transportation")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Families", description: "Comfortable travel for multi-passenger trips." },
          { label: "Business travelers", description: "Private rides between cities and offices." },
          { label: "Airport connectors", description: "Capital Region to JFK and other airports." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Capital Region to NYC", description: "Private rides to Manhattan, airports, and boroughs." },
          { label: "Upstate travel", description: "Connections between Capital Region communities." },
          { label: "Custom routes", description: "Request specific pickup and destination pairs." },
        ],
      }),
      detailSection("booking", 3, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Share full pickup and destination details, preferred schedule, and passenger count. Your quote reflects trip distance and requirements.",
        primaryCta: cta("Request Long-Distance Quote", "/booking?mode=quote&rideType=long-distance"),
      }),
    ],
  },
  {
    slug: "executive-transportation",
    title: "Executive Transportation",
    shortDescription:
      "Professional private transportation for executives, business travelers, meetings, and special appointments.",
    icon: "briefcase",
    features: [
      "Executive travel support",
      "Meeting and appointment transport",
      "Discreet professional service",
      "Flexible scheduling",
    ],
    mainImage: DEMO.executiveService,
    mainImageAlt: "Executive traveler entering a luxury sedan",
    order: 4,
    detailHero: {
      heading: "Executive Transportation",
      subheading: "Professional private transportation for executives, business travelers, and important appointments.",
      background: DEMO.executiveService,
      alt: "Executive pickup at a business district",
    },
    seoTitle: "Executive Transportation Albany | SierraLink",
    seoDescription:
      "Executive private transportation in Albany and the Capital Region for business travelers, meetings, and appointments.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "SierraLink supports executive travel with pre-arranged private transportation designed for professionalism, comfort, and clear communication.",
        media: [img(DEMO.executiveService, "Executive private car service")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Executives", description: "Transportation for leadership and VIP travel." },
          { label: "Business travelers", description: "Airport, hotel, and office connections." },
          { label: "Meeting attendees", description: "Reliable arrival for scheduled appointments." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Airport to office", description: "Seamless connections after arrival." },
          { label: "Multi-stop days", description: "Coordinated travel between venues." },
          { label: "Client entertainment", description: "Discreet transportation for hosted events." },
        ],
        media: [img(DEMO.homeExecutive, "Business traveler in luxury vehicle interior")],
      }),
      detailSection("booking", 3, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Share itinerary details, timing preferences, and contact information. Quotes reflect your specific executive travel requirements.",
        primaryCta: cta("Request Executive Quote", "/booking?mode=quote&rideType=executive"),
      }),
    ],
  },
  {
    slug: "corporate-transportation",
    title: "Corporate Transportation",
    shortDescription:
      "Transportation arrangements for companies, employees, clients, and business travelers.",
    icon: "building-2",
    features: [
      "Employee and client transport",
      "Recurring arrangements available",
      "Centralized booking support",
      "Quote-based corporate pricing",
    ],
    mainImage: DEMO.corporateService,
    mainImageAlt: "Corporate travelers near a luxury SUV",
    order: 5,
    detailHero: {
      heading: "Corporate Transportation",
      subheading: "Private transportation arrangements for companies, employees, clients, and visiting business travelers.",
      background: DEMO.corporateService,
      alt: "Corporate group transportation pickup",
    },
    seoTitle: "Corporate Transportation Capital Region | SierraLink",
    seoDescription:
      "Corporate private transportation in Albany and the Capital Region for employees, clients, and business travel.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "SierraLink helps organizations arrange dependable private transportation for staff, clients, and guests throughout the Capital Region and beyond.",
        media: [img(DEMO.corporateService, "Corporate private transportation")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Companies", description: "Ongoing and ad-hoc employee transportation." },
          { label: "Event planners", description: "Guest and speaker transportation." },
          { label: "Travel coordinators", description: "Centralized booking for visiting teams." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Client visits", description: "Airport and hotel connections for guests." },
          { label: "Team off-sites", description: "Group travel to meetings and retreats." },
          { label: "Conference support", description: "Transportation during multi-day events." },
        ],
      }),
      detailSection("booking", 3, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Provide company name, trip details, and billing contact when applicable. Corporate quotes reflect your transportation scope.",
        primaryCta: cta("Request Corporate Quote", "/booking?mode=quote&rideType=corporate"),
      }),
    ],
  },
  {
    slug: "hotel-residential-transportation",
    title: "Hotel & Residential Transportation",
    shortDescription:
      "Pickup and drop-off from homes, hotels, businesses, airports, and other locations.",
    icon: "home",
    features: [
      "Residential pickups",
      "Hotel arrivals and departures",
      "Business location service",
      "Flexible scheduling",
    ],
    mainImage: DEMO.hotelService,
    mainImageAlt: "Luxury vehicle at hotel entrance",
    order: 6,
    detailHero: {
      heading: "Hotel & Residential Transportation",
      subheading: "Convenient pickup and drop-off from homes, hotels, businesses, airports, and other locations.",
      background: DEMO.hotelService,
      alt: "Private car at hotel lobby entrance",
    },
    seoTitle: "Hotel & Residential Transportation | SierraLink",
    seoDescription:
      "Private transportation to and from hotels, residences, and businesses in Albany and the Capital Region.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "Whether you are leaving home, arriving at a hotel, or traveling between business locations, SierraLink provides pre-arranged private transportation with clear pickup instructions.",
        media: [img(DEMO.hotelService, "Hotel and residential private transportation")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Residents", description: "Door-to-door private rides." },
          { label: "Hotel guests", description: "Arrival and departure transportation." },
          { label: "Business visitors", description: "Connections between offices and lodging." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Home to airport", description: "Residential pickup for flight departures." },
          { label: "Hotel to event", description: "Evening and occasion transportation." },
          { label: "Business campus", description: "Travel between offices and sites." },
        ],
      }),
      detailSection("booking", 3, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Share exact pickup location details, destination, and timing. Special instructions can be noted during booking.",
        primaryCta: cta("Book Transportation", "/booking?mode=booking&rideType=hotel-residential"),
      }),
    ],
  },
  {
    slug: "private-car-service",
    title: "Private Car Service",
    shortDescription:
      "Pre-arranged transportation for individuals, families, and business customers.",
    icon: "car",
    features: [
      "Individual and family rides",
      "Pre-arranged scheduling",
      "Professional chauffeur service",
      "Quote-based pricing",
    ],
    mainImage: DEMO.privateCarService,
    mainImageAlt: "Black luxury sedan available for private hire",
    order: 7,
    detailHero: {
      heading: "Private Car Service",
      subheading: "Pre-arranged private transportation for individuals, families, and business customers.",
      background: DEMO.privateCarService,
      alt: "Private luxury car service vehicle",
    },
    seoTitle: "Private Car Service Albany | SierraLink",
    seoDescription:
      "Pre-arranged private car service in Albany and the Capital Region for individuals, families, and business customers.",
    sections: [
      detailSection("overview", 0, {
        type: "overview",
        heading: "Overview",
        body: "SierraLink's private car service offers a straightforward way to arrange comfortable transportation for personal and business needs across the Capital Region.",
        media: [img(DEMO.privateCarService, "Private car service vehicle exterior")],
      }),
      detailSection("audience", 1, {
        type: "audience",
        heading: "Who It Is For",
        items: [
          { label: "Individuals", description: "Personal appointments and travel." },
          { label: "Families", description: "Group transportation with luggage." },
          { label: "Business customers", description: "Professional private travel." },
        ],
      }),
      detailSection("scenarios", 2, {
        type: "scenarios",
        heading: "Common Trip Scenarios",
        items: [
          { label: "Special occasions", description: "Anniversaries, celebrations, and events." },
          { label: "Daily appointments", description: "Medical, personal, and professional visits." },
          { label: "Custom itineraries", description: "Routes tailored to your schedule." },
        ],
      }),
      detailSection("booking", 3, {
        type: "bookingInfo",
        heading: "Booking Information",
        body: "Tell us where you are going, when you need to travel, and how many passengers are riding. We will confirm details and provide a quote.",
        primaryCta: cta("Book Private Car", "/booking?mode=booking&rideType=private-car"),
      }),
    ],
  },
];
