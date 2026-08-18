import type { ComponentType } from "react";
import { Clock, Shield, Plane, Award, Headphones, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection, SiteSettingsData } from "@/types";
import { sectionWrapperClass } from "./theme";

interface TrustItem {
  icon?: string;
  label?: string;
  title?: string;
  description?: string;
}

interface TrustStripSectionProps {
  section?: PageSection;
  settings?: Pick<SiteSettingsData, "operationalClaims">;
}

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  clock: Clock,
  shield: Shield,
  plane: Plane,
  award: Award,
  headphones: Headphones,
  users: Users,
};

function buildClaimsFromSettings(
  claims?: SiteSettingsData["operationalClaims"]
): TrustItem[] {
  if (!claims) return [];

  const items: TrustItem[] = [];

  if (claims.availability247) {
    items.push({ icon: "clock", title: "24/7 Availability", description: "Rides when you need them" });
  }
  if (claims.flightMonitoring) {
    items.push({ icon: "plane", title: "Flight Monitoring", description: "We track your flight" });
  }
  if (claims.meetAndGreet) {
    items.push({ icon: "users", title: "Meet & Greet", description: "Personal airport service" });
  }
  if (claims.licensedInsured) {
    items.push({
      icon: "shield",
      title: "Licensed & Insured",
      description: claims.licensedInsuredText || "Fully licensed and insured",
    });
  }
  if (claims.chauffeurTraining) {
    items.push({
      icon: "award",
      title: "Professional Chauffeurs",
      description: claims.chauffeurTrainingText || "Trained professionals",
    });
  }
  if (claims.yearsInBusiness) {
    items.push({
      icon: "award",
      title: `${claims.yearsInBusiness}+ Years`,
      description: "Experience in the region",
    });
  }

  return items;
}

const DEFAULT_ITEMS: TrustItem[] = [
  { icon: "clock", title: "24/7 Availability", description: "Always ready to serve" },
  { icon: "plane", title: "Flight Monitoring", description: "Real-time tracking" },
  { icon: "shield", title: "Licensed & Insured", description: "Your safety matters" },
  { icon: "award", title: "Professional Service", description: "Executive standards" },
];

export function TrustStripSection({ section, settings }: TrustStripSectionProps) {
  const fromSettings = buildClaimsFromSettings(settings?.operationalClaims);
  const fromSection = (section?.items as TrustItem[] | undefined) ?? [];
  const items = fromSection.length > 0 ? fromSection : fromSettings.length > 0 ? fromSettings : DEFAULT_ITEMS;

  return (
    <section className={sectionWrapperClass(section?.theme, "py-12")}>
      <Container>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon || "shield"] || Shield;
            return (
              <RevealOnScroll key={i} delay={i * 0.08} direction="bottom">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-signature-gold/30 text-signature-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm md:text-base text-ivory">
                    {item.title || item.label}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-xs text-muted-silver">{item.description}</p>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
