export interface TestimonialSeed {
  customerName: string;
  role?: string;
  company?: string;
  quote: string;
  rating: number;
  featured: boolean;
  order: number;
  serviceSlug?: string;
}

export const TESTIMONIALS: TestimonialSeed[] = [
  {
    customerName: "Margaret Chen",
    role: "Frequent Traveler",
    company: "Clifton Park, NY",
    quote:
      "We fly out of ALB several times a year and SierraLink has become our regular choice for early departures. The driver was ready when we arrived, helped with luggage, and got us to the terminal with time to spare.",
    rating: 5,
    featured: true,
    order: 0,
    serviceSlug: "airport-transportation",
  },
  {
    customerName: "Robert Hayes",
    role: "Office Manager",
    company: "Albany, NY",
    quote:
      "Our team relies on SierraLink for client visits across the Capital Region. Every ride has been professional, discreet, and on time. Booking and confirmations are clear from start to finish.",
    rating: 5,
    featured: true,
    order: 1,
    serviceSlug: "corporate-transportation",
  },
  {
    customerName: "Danielle Porter",
    role: "Travel Planner",
    company: "Saratoga Springs, NY",
    quote:
      "We booked a long-distance trip to JFK for a family vacation. The quote was straightforward, the vehicle was clean and comfortable, and the drive was smooth the entire way.",
    rating: 5,
    featured: false,
    order: 2,
    serviceSlug: "long-distance-transportation",
  },
  {
    customerName: "James Whitfield",
    company: "Troy, NY",
    quote:
      "Needed a local ride across Troy for a medical appointment. Easy to book, fair pricing, and the driver was courteous and professional throughout the trip.",
    rating: 5,
    featured: false,
    order: 3,
    serviceSlug: "local-transportation",
  },
  {
    customerName: "Anita Rodriguez",
    role: "Business Consultant",
    company: "Latham, NY",
    quote:
      "Used executive transportation for an important evening in Albany. Immaculate vehicle, polite chauffeur, and a completely stress-free experience from pickup to drop-off.",
    rating: 5,
    featured: true,
    order: 4,
    serviceSlug: "executive-transportation",
  },
  {
    customerName: "Michael Sullivan",
    company: "Schenectady, NY",
    quote:
      "SierraLink picked me up at ALB after a late arrival. The driver was waiting, the car was comfortable, and the ride home was smooth. Exactly the reliable service you want after a long flight.",
    rating: 5,
    featured: false,
    order: 5,
    serviceSlug: "airport-transportation",
  },
  {
    customerName: "Patricia O'Brien",
    company: "Colonie, NY",
    quote:
      "Reserved private car service for visiting family near downtown Albany. Punctual, friendly, and made a great first impression for our out-of-town guests.",
    rating: 5,
    featured: false,
    order: 6,
    serviceSlug: "private-car-service",
  },
  {
    customerName: "David Kim",
    role: "Event Coordinator",
    company: "Rensselaer, NY",
    quote:
      "Coordinated hotel transfers for a small corporate group. SierraLink handled multiple pickups smoothly and kept communication simple. Would use them again for group travel.",
    rating: 5,
    featured: false,
    order: 7,
    serviceSlug: "hotel-residential-transportation",
  },
];
