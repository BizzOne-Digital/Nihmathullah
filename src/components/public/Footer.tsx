import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { SiteSettingsData } from "@/types";

const DEFAULT_LOGO = "/uploads/settings/sierralink-logo.png";

interface FooterProps {
  settings: SiteSettingsData;
  services?: Array<{ title: string; slug: string }>;
  serviceAreas?: Array<{ city: string; slug: string }>;
}

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer({
  settings,
  services = [],
  serviceAreas = [],
}: FooterProps) {
  const ctas = settings.headerCtas ?? {
    callLabel: "Call Now",
    quoteLabel: "Get a Quote",
    bookLabel: "Book a Ride",
  };

  const addressParts = [
    settings.streetAddress,
    settings.city,
    settings.state,
    settings.zip,
  ].filter(Boolean);

  const copyright =
    settings.copyrightText ||
    `© ${new Date().getFullYear()} ${settings.businessName}. All rights reserved.`;

  const logoUrl = settings.logoUrl || DEFAULT_LOGO;

  return (
    <footer className="w-full max-w-full overflow-x-clip border-t border-antique-gold/10 bg-obsidian">
      <div className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-br from-antique-gold/5 via-transparent to-signature-gold/5" />
        <Container className="relative py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-signature-gold">
              Ready to ride?
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory">
              {settings.headline}
            </h2>
            <p className="mt-4 text-muted-silver leading-relaxed">
              {settings.aboutStatement}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/booking" variant="gold" size="lg" magnetic>
                {ctas.bookLabel}
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                {ctas.quoteLabel}
              </Button>
            </div>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-signature-gold/40 to-transparent" />
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid min-w-0 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="relative mb-6 inline-flex"
              aria-label="SierraLink home"
            >
              <div className="relative h-16 w-full max-w-[min(100%,20rem)] sm:h-20">
                <OptimizedImage
                  src={logoUrl}
                  alt="SierraLink Executive Transportation"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <h3 className="font-display text-lg text-ivory">Company</h3>
            <p className="mt-4 text-sm text-muted-silver leading-relaxed">
              {settings.businessName}
            </p>
            {addressParts.length > 0 && (
              <p className="mt-2 text-sm text-muted-silver">
                {addressParts.join(", ")}
              </p>
            )}
            {settings.businessHours && (
              <p className="mt-2 text-sm text-muted-silver">
                {settings.businessHours}
              </p>
            )}
            {settings.footerCopy && (
              <p className="mt-4 text-sm text-muted-silver">{settings.footerCopy}</p>
            )}
          </div>

          <div>
            <h3 className="font-display text-lg text-ivory">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-silver hover:text-signature-gold"
                >
                  All Services
                </Link>
              </li>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted-silver hover:text-signature-gold"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-ivory">Service Areas</h3>
            <p className="mt-4 text-sm text-muted-silver">{settings.serviceAreaText}</p>
            {serviceAreas.length > 0 && (
              <ul className="mt-4 space-y-2">
                {serviceAreas.slice(0, 8).map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="text-sm text-muted-silver hover:text-signature-gold"
                    >
                      {area.city}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-display text-lg text-ivory">Contact</h3>
            <div className="mt-4 space-y-3">
              <PhoneLink
                display={settings.primaryPhoneDisplay}
                href={settings.primaryPhoneLink}
                showIcon
                className="text-sm"
              />
              {settings.alternatePhoneDisplay && settings.alternatePhoneLink && (
                <PhoneLink
                  display={settings.alternatePhoneDisplay}
                  href={settings.alternatePhoneLink}
                  className="text-sm"
                />
              )}
              <a
                href={`mailto:${settings.primaryEmail}`}
                className="block text-sm text-muted-silver hover:text-signature-gold"
              >
                {settings.primaryEmail}
              </a>
            </div>
            {settings.footerNav && settings.footerNav.length > 0 && (
              <ul className="mt-6 space-y-2">
                {settings.footerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-silver hover:text-signature-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-antique-gold/10 pt-8 md:flex-row">
          <p className="text-xs text-muted-silver">{copyright}</p>
          <ul className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-silver hover:text-signature-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
