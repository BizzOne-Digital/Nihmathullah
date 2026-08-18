import type { FAQ_CATEGORIES } from "@/lib/constants";

type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export interface FaqSeed {
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
}

export const FAQS: FaqSeed[] = [
  // Booking
  {
    category: "Booking",
    order: 1,
    question: "How do I request a ride or quote?",
    answer:
      "You can call us, use the online booking form at /booking, or submit a quote request. Share pickup and destination details, date and time, passenger count, and any special instructions. We will confirm availability and pricing by quote.",
  },
  {
    category: "Booking",
    order: 2,
    question: "Is my online submission a confirmed reservation?",
    answer:
      "No. An online booking or quote request is a request for transportation. Your trip is not confirmed until SierraLink reviews the details and provides confirmation or an approved quote.",
  },
  {
    category: "Booking",
    order: 3,
    question: "Can I book a round-trip?",
    answer:
      "Yes. The booking form supports one-way and round-trip options. Include return date and time when applicable so we can review your full itinerary.",
  },
  // Airport Travel
  {
    category: "Airport Travel",
    order: 1,
    question: "Which airports do you serve?",
    answer:
      "We regularly provide pre-arranged transportation for Albany International Airport (ALB) and John F. Kennedy International Airport (JFK). Additional airports may be requested when you book.",
  },
  {
    category: "Airport Travel",
    order: 2,
    question: "What flight information should I provide?",
    answer:
      "When available, share your airport code, whether you are arriving or departing, airline, and flight number. This helps us coordinate pickup timing. Flight details are optional but recommended.",
  },
  {
    category: "Airport Travel",
    order: 3,
    question: "Where will I meet my driver at the airport?",
    answer:
      "Pickup instructions are confirmed when your trip is approved. Share your mobile number and preferred contact method so we can communicate day-of details.",
  },
  // Local Rides
  {
    category: "Local Rides",
    order: 1,
    question: "What areas do you cover for local rides?",
    answer:
      "We provide local private transportation throughout Albany, Saratoga Springs, Clifton Park, Latham, Schenectady, and surrounding Capital Region communities.",
  },
  {
    category: "Local Rides",
    order: 2,
    question: "Can I book a local ride for the same day?",
    answer:
      "Same-day requests may be available depending on schedule. Call us for urgent needs or submit a booking request with your preferred time.",
  },
  // Long-Distance Travel
  {
    category: "Long-Distance Travel",
    order: 1,
    question: "Do you offer long-distance private transportation?",
    answer:
      "Yes. We arrange private long-distance transportation within New York and to other destinations you request. Pricing is provided by quote based on your route and requirements.",
  },
  {
    category: "Long-Distance Travel",
    order: 2,
    question: "Can you take me from the Capital Region to NYC or JFK?",
    answer:
      "Yes. Capital Region to New York City and JFK connections are common long-distance requests. Share your pickup, destination, and schedule when requesting a quote.",
  },
  // Executive/Corporate
  {
    category: "Executive/Corporate",
    order: 1,
    question: "Do you provide executive and corporate transportation?",
    answer:
      "Yes. SierraLink arranges private transportation for executives, business travelers, employees, clients, and corporate events. Contact us to discuss recurring or one-time arrangements.",
  },
  {
    category: "Executive/Corporate",
    order: 2,
    question: "Can an assistant or travel coordinator book on behalf of a traveler?",
    answer:
      "Yes. Include the traveler's contact information and any company billing details when submitting your request.",
  },
  // Pricing & Payment
  {
    category: "Pricing & Payment",
    order: 1,
    question: "How is pricing determined?",
    answer:
      "Pricing is provided by quote based on pickup, destination, distance, trip type, and transportation requirements. Call, request a quote online, or book through our form to receive pricing for your trip.",
  },
  {
    category: "Pricing & Payment",
    order: 2,
    question: "When is payment requested?",
    answer:
      "Payment may be requested after your trip details are reviewed and a quote is approved. If secure online payment is enabled for your booking, you will receive instructions with your quote. Otherwise, payment arrangements are confirmed directly with SierraLink.",
  },
  {
    category: "Pricing & Payment",
    order: 3,
    question: "Are there current special offers?",
    answer:
      "There are no current special offers published. Please contact us for quotes and transportation arrangements.",
  },
  // Luggage/Special Requests
  {
    category: "Luggage/Special Requests",
    order: 1,
    question: "How much luggage can I bring?",
    answer:
      "Include your luggage count when booking so we can confirm an appropriate vehicle for your party. Specific capacity details are confirmed during the booking process.",
  },
  {
    category: "Luggage/Special Requests",
    order: 2,
    question: "Can I request a child seat or accessibility assistance?",
    answer:
      "You may note child-seat or accessibility requests in your booking. Availability is confirmed when your trip is reviewed—we do not guarantee specific equipment until confirmed.",
  },
  // Cancellations
  {
    category: "Cancellations",
    order: 1,
    question: "What is your cancellation policy?",
    answer:
      "Cancellation terms are provided when your trip or quote is confirmed. If you need to change or cancel, contact SierraLink as soon as possible so we can review your reservation.",
  },
  {
    category: "Cancellations",
    order: 2,
    question: "How do I change my pickup time or address?",
    answer:
      "Contact us by phone or email with your booking reference and updated details. Changes are subject to availability and may affect your quoted price.",
  },
];
