import type { MetadataRoute } from "next";
import connectDB from "@/lib/db/connect";
import { Service, BlogPost, ServiceArea } from "@/models";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/fleet`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/service-areas`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faqs`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/booking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    await connectDB();

    const [services, posts, areas] = await Promise.all([
      Service.find({ "listing.published": true, archived: { $ne: true } })
        .select("listing.slug listing.updatedAt")
        .lean(),
      BlogPost.find({ published: true, draft: false }).select("slug updatedAt").lean(),
      ServiceArea.find({ published: true, allowIndexing: true }).select("slug updatedAt").lean(),
    ]);

    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
      url: `${baseUrl}/services/${s.listing.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
      url: `${baseUrl}/service-areas/${a.slug}`,
      lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...areaRoutes];
  } catch {
    return staticRoutes;
  }
}
