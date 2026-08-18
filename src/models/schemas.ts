import { Schema } from "mongoose";
import type {
  BlogContentBlock,
  CtaLink,
  MediaItem,
  PageHero,
  PageSection,
  PageSectionType,
  QuoteLineItem,
  SeoFields,
  SectionTheme,
  ServiceDetailSection,
} from "@/types";

export const PAGE_SECTION_TYPES: PageSectionType[] = [
  "hero",
  "quickQuote",
  "richText",
  "splitMedia",
  "serviceCards",
  "airportSpotlight",
  "routeStory",
  "serviceAreas",
  "fleetPreview",
  "imageMosaic",
  "galleryRail",
  "process",
  "testimonials",
  "faqs",
  "contactPanel",
  "cta",
  "editorial",
  "comparison",
  "passengerTypes",
  "pricingInfo",
  "bookingProcess",
  "locationGrid",
  "blogPreview",
];

export const SECTION_THEMES: SectionTheme[] = [
  "black",
  "charcoal",
  "gold",
  "ivory",
  "white",
];

export const MediaItemSchema = new Schema<MediaItem>(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    title: { type: String },
    caption: { type: String },
  },
  { _id: false }
);

export const CtaLinkSchema = new Schema<CtaLink>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

export const SeoFieldsSchema = new Schema<SeoFields>(
  {
    title: { type: String },
    description: { type: String },
    socialImage: { type: String },
    canonical: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

export const PageHeroSchema = new Schema<PageHero>(
  {
    eyebrow: { type: String },
    heading: { type: String },
    subheading: { type: String },
    backgroundImage: { type: MediaItemSchema },
  },
  { _id: false }
);

export const PageSectionSchema = new Schema<PageSection>(
  {
    key: { type: String, required: true },
    type: { type: String, required: true, enum: PAGE_SECTION_TYPES },
    adminLabel: { type: String, required: true },
    eyebrow: { type: String },
    heading: { type: String },
    subheading: { type: String },
    body: { type: String },
    items: { type: [Schema.Types.Mixed], default: undefined },
    primaryMedia: { type: MediaItemSchema },
    media: { type: [MediaItemSchema], default: undefined },
    primaryCta: { type: CtaLinkSchema },
    secondaryCta: { type: CtaLinkSchema },
    layout: { type: String },
    theme: { type: String, enum: SECTION_THEMES },
    visible: { type: Boolean, required: true, default: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

export const ServiceDetailSectionSchema = new Schema<ServiceDetailSection>(
  {
    type: { type: String, required: true },
    heading: { type: String },
    subheading: { type: String },
    body: { type: String },
    items: { type: [Schema.Types.Mixed], default: undefined },
    media: { type: [MediaItemSchema], default: undefined },
    primaryCta: { type: CtaLinkSchema },
    layout: { type: String },
    theme: { type: String, enum: SECTION_THEMES },
    visible: { type: Boolean, required: true, default: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

export const QuoteLineItemSchema = new Schema<QuoteLineItem>(
  {
    label: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

export const BlogContentBlockSchema = new Schema<BlogContentBlock>(
  {
    type: {
      type: String,
      required: true,
      enum: ["paragraph", "heading", "list", "image", "quote"],
    },
    content: { type: String },
    items: { type: [String], default: undefined },
    media: { type: MediaItemSchema },
    level: { type: Number },
  },
  { _id: false }
);
