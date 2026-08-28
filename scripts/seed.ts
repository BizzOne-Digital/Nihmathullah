import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  SiteSettings,
  PricingSettings,
  AdminUser,
  Service,
  ServiceArea,
  GalleryCategory,
  GalleryImage,
  FAQ,
  BlogPost,
  Page,
  Vehicle,
  Testimonial,
} from "@/models";
import { loadEnv, log, img, ABOUT_STATEMENT, PRICING_STATEMENT, SERVICE_AREA_TEXT } from "./seed/helpers";
import { SERVICES } from "./seed/services-data";
import { FAQS } from "./seed/faq-data";
import { BLOG_POSTS } from "./seed/blog-data";
import { buildPages, sanitizePageSeed } from "./seed/pages-data";
import {
  sanitizeContentBlocks,
  sanitizeMediaItem,
  sanitizePageSections,
  sanitizeSeoFields,
  sanitizeServiceDetailSection,
} from "@/lib/media/sanitize";
import type { PageSection } from "@/types";

async function seedSiteSettings(): Promise<void> {
  log("SiteSettings", "upserting singleton");
  await SiteSettings.findOneAndUpdate(
    { singletonKey: "singleton" },
    {
      $set: {
        businessName: "SierraLink Executive Transportation LLC",
        shortName: "SierraLink",
        headline:
          "Reliable Airport, Executive, Local & Long-Distance Transportation in Albany & the Capital Region",
        primaryEmail: "info@sierralinkexecutivetransportation.com",
        primaryPhoneDisplay: "(518) 290-0675",
        primaryPhoneLink: "tel:+15182900675",
        alternatePhoneDisplay: "(914) 483-2266",
        alternatePhoneLink: "tel:+19144832266",
        serviceAreaText: SERVICE_AREA_TEXT,
        aboutStatement: ABOUT_STATEMENT,
        publicPricingStatement: PRICING_STATEMENT,
        logoUrl: "/uploads/settings/sierralink-logo.png",
        faviconUrl: "/uploads/settings/sierralink-logo.png",
        headerCtas: {
          callLabel: "Call Now",
          quoteLabel: "Get a Quote",
          bookLabel: "Book a Ride",
        },
        footerCopy:
          "SierraLink Executive Transportation LLC provides professional private transportation throughout Albany and the Capital Region.",
        footerNav: [
          { label: "Services", href: "/services" },
          { label: "Fleet", href: "/fleet" },
          { label: "Service Areas", href: "/service-areas" },
          { label: "Booking", href: "/booking" },
          { label: "Contact", href: "/contact" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms", href: "/terms" },
        ],
        operationalClaims: {
          availability247: false,
          flightMonitoring: false,
          meetAndGreet: false,
          licensedInsured: false,
          chauffeurTraining: false,
        },
        airports: [
          {
            code: "ALB",
            name: "Albany International Airport",
            description: "Capital Region airport arrivals and departures.",
          },
          {
            code: "JFK",
            name: "John F. Kennedy International Airport",
            description: "Long-distance private connections to and from JFK.",
          },
        ],
        bookingConfirmationText:
          "Thank you for your booking request. This is not a confirmed reservation. A SierraLink representative will contact you by email or phone to confirm availability, provide pricing, and arrange payment.",
        introAnimationEnabled: true,
        analyticsConsentRequired: false,
        copyrightText: `© ${new Date().getFullYear()} SierraLink Executive Transportation LLC. All rights reserved.`,
      },
    },
    { upsert: true, new: true }
  );
}

async function seedPricingSettings(): Promise<void> {
  log("PricingSettings", "upserting singleton");
  await PricingSettings.findOneAndUpdate(
    { singletonKey: "singleton" },
    {
      $set: {
        publicPricingStatement: PRICING_STATEMENT,
        showPublicPricing: false,
        currency: "USD",
        defaultQuoteExpirationDays: 7,
        depositMode: "none",
        paymentEnabled: false,
        cancellationPolicyPublished: false,
        refundPolicyPublished: false,
        specialOffersEnabled: false,
      },
    },
    { upsert: true, new: true }
  );
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  log("AdminUser", `upserting ${email}`);
  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        passwordHash,
        name: "SierraLink Admin",
        role: "superadmin",
        active: true,
      },
    },
    { upsert: true, new: true }
  );
}

async function seedServices(): Promise<Map<string, mongoose.Types.ObjectId>> {
  log("Services", `upserting ${SERVICES.length} services`);
  const slugToId = new Map<string, mongoose.Types.ObjectId>();

  for (const svc of SERVICES) {
    const mainImage = sanitizeMediaItem(img(svc.mainImage, svc.mainImageAlt));
    const backgroundImage = sanitizeMediaItem(
      img(svc.detailHero.background, svc.detailHero.alt)
    );
    const detailSections = svc.sections.map((section) =>
      sanitizeServiceDetailSection(section)
    );

    const doc = await Service.findOneAndUpdate(
      { "listing.slug": svc.slug },
      {
        $set: {
          listing: {
            title: svc.title,
            slug: svc.slug,
            shortDescription: svc.shortDescription,
            ...(mainImage ? { mainImage } : {}),
            icon: svc.icon,
            features: svc.features,
            cta: { label: "Learn More", href: `/services/${svc.slug}` },
            published: true,
            order: svc.order,
            seo: {
              title: svc.seoTitle,
              description: svc.seoDescription,
            },
          },
          detailPage: {
            hero: {
              heading: svc.detailHero.heading,
              subheading: svc.detailHero.subheading,
              ...(backgroundImage ? { backgroundImage } : {}),
            },
            sections: detailSections,
            seo: {
              title: svc.seoTitle,
              description: svc.seoDescription,
            },
          },
          archived: false,
        },
      },
      { upsert: true, new: true }
    );

    slugToId.set(svc.slug, doc._id as mongoose.Types.ObjectId);
    log("Services", `  ✓ ${svc.slug}`);
  }

  return slugToId;
}

async function seedServiceAreas(
  serviceIds: Map<string, mongoose.Types.ObjectId>
): Promise<void> {
  const allServiceIds = Array.from(serviceIds.values());

  const areas = [
    {
      city: "Albany",
      slug: "albany",
      shortSummary:
        "Private airport, executive, and local transportation throughout Albany and downtown connections.",
      published: true,
      order: 1,
      image: "/images/placeholders/area-albany.svg",
      sections: [
        {
          key: "albany-intro",
          type: "richText" as const,
          adminLabel: "Albany Introduction",
          heading: "Transportation in Albany",
          body: "SierraLink provides pre-arranged private transportation for Albany residents, visitors, and business travelers—including ALB airport connections and local rides across the city.",
          primaryMedia: img("/images/placeholders/area-albany.svg", "Albany private transportation"),
          visible: true,
          order: 0,
        },
        {
          key: "albany-services",
          type: "serviceCards" as const,
          adminLabel: "Related Services",
          heading: "Popular Albany Services",
          visible: true,
          order: 1,
        },
        {
          key: "albany-airport",
          type: "airportSpotlight" as const,
          adminLabel: "Airport Connections",
          heading: "ALB Airport Service",
          body: "Pre-arranged transportation to and from Albany International Airport.",
          items: [{ code: "ALB", name: "Albany International Airport" }],
          primaryMedia: img("/images/placeholders/airport-1.svg", "ALB airport transportation from Albany"),
          visible: true,
          order: 2,
        },
        {
          key: "albany-scenarios",
          type: "editorial" as const,
          adminLabel: "Travel Scenarios",
          heading: "Common Albany Trips",
          body: "Downtown meetings, hotel transfers, residential pickups, and Capital Region connections.",
          media: [
            img("/images/placeholders/local-1.svg", "Local Albany ride"),
            img("/images/placeholders/executive-1.svg", "Executive travel in Albany"),
          ],
          visible: true,
          order: 3,
        },
        {
          key: "albany-cta",
          type: "cta" as const,
          adminLabel: "Albany CTA",
          heading: "Book Albany Transportation",
          primaryCta: { label: "Get a Quote", href: "/booking?mode=quote" },
          primaryMedia: img("/images/placeholders/area-albany.svg", "Albany booking CTA"),
          visible: true,
          order: 4,
        },
      ],
    },
    {
      city: "Saratoga Springs",
      slug: "saratoga-springs",
      shortSummary:
        "Private transportation for Saratoga Springs residents, visitors, and event travelers.",
      published: true,
      order: 2,
      image: "/images/placeholders/area-saratoga.svg",
      sections: [
        {
          key: "saratoga-intro",
          type: "richText" as const,
          adminLabel: "Saratoga Introduction",
          heading: "Saratoga Springs Transportation",
          body: "Pre-arranged private rides for downtown Saratoga, track season travel, hotels, and airport connections.",
          primaryMedia: img("/images/placeholders/area-saratoga.svg", "Saratoga Springs transportation"),
          visible: true,
          order: 0,
        },
        {
          key: "saratoga-editorial",
          type: "splitMedia" as const,
          adminLabel: "Saratoga Editorial",
          heading: "Local & Long-Distance from Saratoga",
          body: "Connect to ALB, regional destinations, and long-distance routes including JFK.",
          primaryMedia: img("/images/placeholders/home-route-1.svg", "Route from Saratoga Springs"),
          media: [img("/images/placeholders/long-distance-1.svg", "Long-distance from Saratoga")],
          visible: true,
          order: 1,
        },
        {
          key: "saratoga-services",
          type: "serviceCards" as const,
          adminLabel: "Services",
          heading: "Saratoga Services",
          visible: true,
          order: 2,
        },
        {
          key: "saratoga-visual",
          type: "imageMosaic" as const,
          adminLabel: "Saratoga Visuals",
          media: [
            img("/images/placeholders/gallery-1.svg", "Saratoga travel scene 1"),
            img("/images/placeholders/gallery-2.svg", "Saratoga travel scene 2"),
            img("/images/placeholders/hotel-1.svg", "Hotel pickup in Saratoga area"),
          ],
          visible: true,
          order: 3,
        },
        {
          key: "saratoga-cta",
          type: "cta" as const,
          adminLabel: "Saratoga CTA",
          heading: "Request Saratoga Transportation",
          primaryCta: { label: "Book a Ride", href: "/booking" },
          primaryMedia: img("/images/placeholders/area-saratoga.svg", "Saratoga CTA"),
          visible: true,
          order: 4,
        },
      ],
    },
    {
      city: "Clifton Park",
      slug: "clifton-park",
      shortSummary:
        "Residential and business private transportation throughout Clifton Park and nearby communities.",
      published: true,
      order: 3,
      image: "/images/placeholders/area-clifton-park.svg",
      sections: [
        {
          key: "clifton-intro",
          type: "richText" as const,
          adminLabel: "Clifton Park Introduction",
          heading: "Clifton Park Transportation",
          body: "Door-to-door private transportation for Clifton Park homes, offices, and regional destinations.",
          primaryMedia: img("/images/placeholders/area-clifton-park.svg", "Clifton Park private car service"),
          visible: true,
          order: 0,
        },
        {
          key: "clifton-local",
          type: "editorial" as const,
          adminLabel: "Local Rides",
          heading: "Local & Regional Connections",
          body: "Travel to Albany, Latham, Saratoga Springs, ALB, and beyond with pre-arranged private service.",
          media: [
            img("/images/placeholders/local-1.svg", "Clifton Park local ride"),
            img("/images/placeholders/airport-1.svg", "Clifton Park to ALB"),
          ],
          visible: true,
          order: 1,
        },
        {
          key: "clifton-services",
          type: "serviceCards" as const,
          adminLabel: "Services",
          visible: true,
          order: 2,
        },
        {
          key: "clifton-process",
          type: "process" as const,
          adminLabel: "Booking Process",
          heading: "How to Book from Clifton Park",
          items: [
            { step: 1, title: "Share addresses", description: "Pickup in Clifton Park and your destination." },
            { step: 2, title: "Confirm quote", description: "Pricing based on your trip details." },
            { step: 3, title: "Ride day", description: "Professional private transportation." },
          ],
          primaryMedia: img("/images/placeholders/home-process-1.svg", "Booking process"),
          visible: true,
          order: 3,
        },
        {
          key: "clifton-cta",
          type: "cta" as const,
          adminLabel: "Clifton Park CTA",
          heading: "Clifton Park Pickup",
          primaryCta: { label: "Get a Quote", href: "/booking?mode=quote" },
          primaryMedia: img("/images/placeholders/area-clifton-park.svg", "Clifton Park CTA"),
          visible: true,
          order: 4,
        },
      ],
    },
    {
      city: "Latham",
      slug: "latham",
      shortSummary:
        "Convenient private transportation for Latham residences, businesses, and ALB airport connections.",
      published: true,
      order: 4,
      image: "/images/placeholders/area-latham.svg",
      sections: [
        {
          key: "latham-intro",
          type: "richText" as const,
          adminLabel: "Latham Introduction",
          heading: "Latham Transportation",
          body: "SierraLink serves Latham with local rides, airport transfers, and executive transportation throughout the Capital Region.",
          primaryMedia: img("/images/placeholders/area-latham.svg", "Latham private transportation"),
          visible: true,
          order: 0,
        },
        {
          key: "latham-airport",
          type: "airportSpotlight" as const,
          adminLabel: "ALB from Latham",
          heading: "Close to Albany International Airport",
          body: "Pre-arranged ALB pickups and drop-offs for Latham travelers.",
          items: [{ code: "ALB", name: "Albany International Airport" }],
          primaryMedia: img("/images/placeholders/airport-2.svg", "Latham to ALB airport run"),
          visible: true,
          order: 1,
        },
        {
          key: "latham-split",
          type: "splitMedia" as const,
          adminLabel: "Latham Editorial",
          heading: "Business & Residential Service",
          body: "Transportation for Latham offices, shopping districts, and residential neighborhoods.",
          primaryMedia: img("/images/placeholders/corporate-1.svg", "Latham business transportation"),
          media: [img("/images/placeholders/hotel-1.svg", "Latham hotel pickup")],
          visible: true,
          order: 2,
        },
        {
          key: "latham-services",
          type: "serviceCards" as const,
          adminLabel: "Services",
          visible: true,
          order: 3,
        },
        {
          key: "latham-cta",
          type: "cta" as const,
          adminLabel: "Latham CTA",
          heading: "Book Latham Transportation",
          primaryCta: { label: "Book a Ride", href: "/booking" },
          primaryMedia: img("/images/placeholders/area-latham.svg", "Latham CTA visual"),
          visible: true,
          order: 4,
        },
      ],
    },
    {
      city: "Schenectady",
      slug: "schenectady",
      shortSummary:
        "Private transportation for Schenectady homes, businesses, and regional travel connections.",
      published: true,
      order: 5,
      image: "/images/placeholders/area-schenectady.svg",
      sections: [
        {
          key: "schenectady-intro",
          type: "richText" as const,
          adminLabel: "Schenectady Introduction",
          heading: "Schenectady Transportation",
          body: "Pre-arranged private rides across Schenectady with connections to ALB, Albany, and long-distance destinations.",
          primaryMedia: img("/images/placeholders/area-schenectady.svg", "Schenectady transportation service"),
          visible: true,
          order: 0,
        },
        {
          key: "schenectady-editorial",
          type: "editorial" as const,
          adminLabel: "Schenectady Routes",
          heading: "Capital Region Connectivity",
          body: "Travel between Schenectady and neighboring communities with professional private service.",
          media: [
            img("/images/placeholders/home-route-1.svg", "Schenectady route visual"),
            img("/images/placeholders/executive-1.svg", "Executive travel Schenectady"),
            img("/images/placeholders/private-car-1.svg", "Private car Schenectady"),
          ],
          visible: true,
          order: 1,
        },
        {
          key: "schenectady-services",
          type: "serviceCards" as const,
          adminLabel: "Services",
          visible: true,
          order: 2,
        },
        {
          key: "schenectady-faq",
          type: "faqs" as const,
          adminLabel: "Schenectady FAQs",
          heading: "Common Questions",
          visible: true,
          order: 3,
        },
        {
          key: "schenectady-cta",
          type: "cta" as const,
          adminLabel: "Schenectady CTA",
          heading: "Schenectady Pickup & Drop-Off",
          primaryCta: { label: "Get a Quote", href: "/booking?mode=quote" },
          primaryMedia: img("/images/placeholders/area-schenectady.svg", "Schenectady CTA"),
          visible: true,
          order: 4,
        },
      ],
    },
    {
      city: "Surrounding Capital Region",
      slug: "surrounding-capital-region",
      shortSummary:
        "Private transportation for communities throughout the greater Capital Region beyond core cities.",
      published: false,
      order: 6,
      allowIndexing: false,
      image: "/images/placeholders/home-route-1.svg",
      sections: [
        {
          key: "surrounding-intro",
          type: "richText" as const,
          adminLabel: "Surrounding Area Introduction",
          heading: "Beyond the Core Cities",
          body: "SierraLink serves surrounding Capital Region communities. Contact us with your pickup location to confirm service availability.",
          primaryMedia: img("/images/placeholders/home-route-1.svg", "Surrounding Capital Region routes"),
          visible: true,
          order: 0,
        },
        {
          key: "surrounding-note",
          type: "richText" as const,
          adminLabel: "Publish Note",
          body: "This dynamic location page is seeded unpublished. Publish only when unique local content is ready.",
          visible: true,
          order: 1,
        },
      ],
    },
  ];

  log("ServiceAreas", `upserting ${areas.length} service areas`);

  for (const area of areas) {
    const areaImage = sanitizeMediaItem(img(area.image, `${area.city} service area`));
    const sections = sanitizePageSections(area.sections as PageSection[]);

    await ServiceArea.findOneAndUpdate(
      { slug: area.slug },
      {
        $set: {
          city: area.city,
          slug: area.slug,
          shortSummary: area.shortSummary,
          sections,
          relatedServices: allServiceIds,
          ...(areaImage ? { image: areaImage } : {}),
          published: area.published,
          order: area.order,
          allowIndexing: "allowIndexing" in area ? area.allowIndexing : true,
          seo: {
            title: `${area.city} Transportation | SierraLink`,
            description: area.shortSummary,
          },
        },
        ...(areaImage ? {} : { $unset: { image: "" } }),
      },
      { upsert: true, new: true }
    );
    log("ServiceAreas", `  ✓ ${area.slug} (published: ${area.published})`);
  }
}

async function seedGallery(): Promise<void> {
  const categories = [
    {
      name: "Vehicles",
      slug: "vehicles",
      description: "Illustrative vehicle exteriors and fleet scenes.",
      order: 1,
    },
    {
      name: "Airport Travel",
      slug: "airport-travel",
      description: "Airport curbside, terminal, and luggage moments.",
      order: 2,
    },
    {
      name: "Executive Travel",
      slug: "executive-travel",
      description: "Business and executive private transportation scenes.",
      order: 3,
    },
    {
      name: "Local & Long-Distance",
      slug: "local-long-distance",
      description: "Capital Region streets and highway travel imagery.",
      order: 4,
    },
    {
      name: "Details/Interiors",
      slug: "details-interiors",
      description: "Interior details, doors, leather, and luggage loading.",
      order: 5,
    },
  ];

  log("GalleryCategories", `upserting ${categories.length} categories`);
  const categoryIds = new Map<string, mongoose.Types.ObjectId>();

  for (const cat of categories) {
    const doc = await GalleryCategory.findOneAndUpdate(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: cat.order,
          published: true,
        },
      },
      { upsert: true, new: true }
    );
    categoryIds.set(cat.slug, doc._id as mongoose.Types.ObjectId);
    log("GalleryCategories", `  ✓ ${cat.slug}`);
  }

  const images: Array<{
    cat: string;
    url: string;
    alt: string;
    title: string;
    order: number;
    featured?: boolean;
  }> = [];

  if (images.length > 0) {
    log("GalleryImages", `upserting ${images.length} demo images (unpublished)`);

    for (const image of images) {
      const categoryId = categoryIds.get(image.cat);
      if (!categoryId) continue;

      await GalleryImage.findOneAndUpdate(
        { url: image.url, categoryId },
        {
          $set: {
            title: image.title,
            caption: "Illustrative demo image — replace before publishing as SierraLink-owned photography.",
            alt: image.alt,
            url: image.url,
            categoryId,
            featured: image.featured ?? false,
            published: false,
            order: image.order,
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  const removed = await GalleryImage.deleteMany({
    $or: [
      { url: { $regex: "/images/demo/" } },
      { url: { $regex: "/uploads/" } },
    ],
  });
  log("GalleryImages", `removed ${removed.deletedCount ?? 0} legacy photo records`);
}

async function seedFaqs(serviceIds: Map<string, mongoose.Types.ObjectId>): Promise<void> {
  log("FAQs", `upserting ${FAQS.length} FAQs`);
  const airportServiceId = serviceIds.get("airport-transportation");

  for (const faq of FAQS) {
    const relatedServiceIds =
      faq.category === "Airport Travel" && airportServiceId
        ? [airportServiceId]
        : [];

    await FAQ.findOneAndUpdate(
      { question: faq.question },
      {
        $set: {
          answer: faq.answer,
          category: faq.category,
          relatedServiceIds,
          published: true,
          order: faq.order,
        },
      },
      { upsert: true, new: true }
    );
  }
  log("FAQs", "  ✓ complete");
}

async function seedTestimonials(): Promise<void> {
  log("Testimonials", "removing unpublished demo reviews — only admin-approved reviews are shown");
  const removed = await Testimonial.deleteMany({});
  log("Testimonials", `  ✓ removed ${removed.deletedCount ?? 0} records (add approved reviews in admin)`);
}

async function seedBlogPosts(): Promise<void> {
  log("BlogPosts", `upserting ${BLOG_POSTS.length} posts`);

  for (const post of BLOG_POSTS) {
    const featuredImage = sanitizeMediaItem(img(post.featuredImage, post.featuredImageAlt));
    const seo = sanitizeSeoFields({
      title: post.seoTitle,
      description: post.seoDescription,
      socialImage: post.featuredImage,
    });

    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentBlocks: sanitizeContentBlocks(post.contentBlocks),
          ...(featuredImage ? { featuredImage } : {}),
          category: post.category,
          tags: post.tags,
          authorDisplay: "SierraLink Team",
          publishDate: new Date(),
          draft: false,
          published: true,
          featured: post.slug === "planning-your-airport-transfer",
          seo,
        },
        ...(featuredImage ? {} : { $unset: { featuredImage: "" } }),
      },
      { upsert: true, new: true }
    );
    log("BlogPosts", `  ✓ ${post.slug}`);
  }
}

async function seedPages(): Promise<void> {
  const pages = buildPages().map(sanitizePageSeed);
  log("Pages", `upserting ${pages.length} pages`);

  for (const page of pages) {
    await Page.findOneAndUpdate(
      { slug: page.slug },
      {
        $set: {
          title: page.title,
          hero: page.hero,
          sections: page.sections,
          seo: page.seo,
          published: page.published,
          order: page.order,
        },
      },
      { upsert: true, new: true }
    );
    log("Pages", `  ✓ ${page.slug} (${page.sections.length} sections)`);
  }
}

async function seedVehicles(
  serviceIds: Map<string, mongoose.Types.ObjectId>
): Promise<void> {
  const relatedServices = [
    serviceIds.get("airport-transportation"),
    serviceIds.get("local-transportation"),
    serviceIds.get("long-distance-transportation"),
    serviceIds.get("executive-transportation"),
    serviceIds.get("private-car-service"),
  ].filter(Boolean) as mongoose.Types.ObjectId[];

  const vehicles = [
    {
      displayName: "Toyota Highlander Hybrid AWD",
      make: "Toyota",
      model: "Highlander Hybrid AWD",
      category: "suv" as const,
      passengerCapacity: 7,
      luggageGuidance:
        "Comfortable seating for up to 7 passengers with room for multiple suitcases. Share luggage counts when booking.",
      amenities: [
        "Hybrid AWD",
        "Spacious SUV",
        "Third-row seating",
        "Climate control",
      ],
      primaryImage: {
        url: "/images/placeholders/vehicle-suv-1.svg",
        alt: "Toyota Highlander Hybrid AWD",
      },
      gallery: [
        {
          url: "/images/placeholders/fleet-2.svg",
          alt: "Toyota Highlander Hybrid AWD exterior",
        },
        {
          url: "/images/placeholders/fleet-3.svg",
          alt: "Toyota Highlander Hybrid AWD interior",
        },
      ],
      order: 1,
    },
    {
      displayName: "Toyota C-HR AWD Premium",
      make: "Toyota",
      model: "C-HR AWD Premium",
      category: "suv" as const,
      passengerCapacity: 5,
      luggageGuidance:
        "Ideal for up to 5 passengers with moderate luggage. Confirm bag count when booking.",
      amenities: [
        "AWD Premium",
        "Compact SUV",
        "Fuel efficient",
        "Premium interior",
      ],
      primaryImage: {
        url: "/images/placeholders/fleet-4.svg",
        alt: "Toyota C-HR AWD Premium",
      },
      gallery: [
        {
          url: "/images/placeholders/fleet-5.svg",
          alt: "Toyota C-HR AWD Premium exterior",
        },
        {
          url: "/images/placeholders/gallery-4.svg",
          alt: "Toyota C-HR AWD Premium detail",
        },
      ],
      order: 2,
    },
  ];

  const removedVehicleNames = [
    "Executive Sedan (Illustrative)",
    "Luxury SUV (Illustrative)",
    "Sprinter Van (Illustrative)",
  ];

  log("Vehicles", `upserting ${vehicles.length} published fleet vehicles`);

  for (const vehicle of vehicles) {
    await Vehicle.findOneAndUpdate(
      { displayName: vehicle.displayName },
      {
        $set: {
          displayName: vehicle.displayName,
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.category,
          passengerCapacity: vehicle.passengerCapacity,
          luggageGuidance: vehicle.luggageGuidance,
          amenities: vehicle.amenities,
          primaryImage: vehicle.primaryImage,
          gallery: vehicle.gallery,
          relatedServices,
          published: true,
          order: vehicle.order,
          isIllustrative: false,
        },
      },
      { upsert: true, new: true }
    );
    log("Vehicles", `  ✓ ${vehicle.displayName}`);
  }

  const removed = await Vehicle.deleteMany({
    displayName: { $in: removedVehicleNames },
  });
  if (removed.deletedCount > 0) {
    log("Vehicles", `  removed ${removed.deletedCount} legacy illustrative record(s)`);
  }
}

async function main(): Promise<void> {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env or the environment.");
  }

  log("start", "connecting to MongoDB");
  await mongoose.connect(uri);
  log("connected", mongoose.connection.name);

  try {
    await seedSiteSettings();
    await seedPricingSettings();
    await seedAdminUser();
    const serviceIds = await seedServices();
    await seedServiceAreas(serviceIds);
    await seedGallery();
    await seedFaqs(serviceIds);
    await seedBlogPosts();
    await seedTestimonials();
    await seedPages();
    await seedVehicles(serviceIds);

    log("complete", "database seeded successfully");
    console.log("\n--- Seed Summary ---");
    console.log("  SiteSettings & PricingSettings: singleton upserted");
    console.log("  Admin user: upserted from ADMIN_EMAIL");
    console.log(`  Services: ${SERVICES.length} published with detail pages`);
    console.log("  Service areas: 5 published + 1 unpublished (surrounding-capital-region)");
    console.log("  Gallery: 5 categories (placeholder SVGs via sections; no photo gallery seeded)");
    console.log(`  FAQs: ${FAQS.length} across all categories`);
    console.log(`  Blog posts: ${BLOG_POSTS.length} published`);
    console.log("  Testimonials: none seeded (admin-approved only)");
    console.log(`  Pages: ${buildPages().length} with complete sections`);
    console.log("  Vehicles: 2 published (Toyota Highlander Hybrid AWD, Toyota C-HR AWD Premium)");
    console.log("\n  Branded SVG placeholders: public/images/placeholders/ (npm run generate:placeholders)");
    console.log("  Run: npm run seed\n");
  } finally {
    await mongoose.disconnect();
    log("disconnected", "MongoDB connection closed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("[seed] failed:", err);
    process.exit(1);
  });
