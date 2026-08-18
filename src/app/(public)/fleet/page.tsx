import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedVehicles } from "@/lib/repositories/fleet";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("fleet");
  if (!page) return { title: "Fleet" };
  return generatePageMetadata(page);
}

export default async function FleetPage() {
  const [page, vehicles] = await Promise.all([
    getPageBySlug("fleet"),
    getPublishedVehicles(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Fleet", url: `${baseUrl}/fleet` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} context={{ vehicles }} />

      <section className="section-theme-charcoal py-[var(--section-padding-y)]">
        <Container>
          {vehicles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle, i) => (
                <RevealOnScroll key={vehicle._id?.toString() || i} delay={i * 0.06}>
                  <article className="overflow-hidden rounded-sm border border-antique-gold/10 bg-obsidian/40">
                    {vehicle.primaryImage?.url && (
                      <div className="relative aspect-[16/10]">
                        <OptimizedImage
                          src={vehicle.primaryImage.url}
                          alt={vehicle.primaryImage.alt || vehicle.displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="font-display text-xl text-ivory">{vehicle.displayName}</h2>
                      <p className="mt-1 text-xs uppercase tracking-wider text-signature-gold">
                        {vehicle.category}
                      </p>
                      {vehicle.passengerCapacity && (
                        <p className="mt-2 text-sm text-muted-silver">
                          Up to {vehicle.passengerCapacity} passengers
                        </p>
                      )}
                      {vehicle.luggageGuidance && (
                        <p className="mt-1 text-sm text-muted-silver">{vehicle.luggageGuidance}</p>
                      )}
                      {vehicle.amenities && vehicle.amenities.length > 0 && (
                        <ul className="mt-4 space-y-1 text-sm text-muted-silver">
                          {vehicle.amenities.map((amenity, j) => (
                            <li key={j}>• {amenity}</li>
                          ))}
                        </ul>
                      )}
                      {vehicle.gallery && vehicle.gallery.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {vehicle.gallery.slice(0, 3).map((img, j) => (
                            <div key={j} className="relative aspect-square overflow-hidden rounded-sm">
                              <OptimizedImage src={img.url} alt={img.alt} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      {vehicle.isIllustrative && (
                        <p className="mt-4 text-xs text-muted-silver">
                          Vehicle images may be illustrative. Assigned vehicle confirmed for your trip.
                        </p>
                      )}
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-silver">
              Our fleet showcase is being updated. Contact us for vehicle availability on your route.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
