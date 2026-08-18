import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { MobileActionBar } from "@/components/public/MobileActionBar";
import { PageTransition } from "@/components/public/PageTransition";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { getPublishedServices } from "@/lib/repositories/services";
import { getPublishedServiceAreas } from "@/lib/repositories/service-areas";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settingsDoc, services, serviceAreas] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getPublishedServiceAreas(),
  ]);

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const serviceNav = services.map((s) => ({
    title: s.listing.title,
    slug: s.listing.slug,
  }));
  const areaNav = serviceAreas.map((a) => ({
    city: a.city,
    slug: a.slug,
  }));

  return (
    <>
      <Header settings={settings} services={serviceNav} />
      <PageTransition>
        <main className="w-full min-w-0 max-w-full overflow-x-clip pb-mobile-bar">{children}</main>
      </PageTransition>
      <Footer settings={settings} services={serviceNav} serviceAreas={areaNav} />
      <MobileActionBar settings={settings} />
    </>
  );
}
