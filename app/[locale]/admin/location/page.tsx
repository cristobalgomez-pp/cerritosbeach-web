import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import { redirect } from "next/navigation";
import { getLocationImages } from "@/features/location/lib/queries";
import { LocationImageCard } from "@/features/location/components/LocationImageCard";

const TRANSPORT_KEYS = ["transport_rental", "transport_shuttle", "transport_taxi", "transport_bus"];
const AIRPORT_KEYS   = ["airport_sjd", "airport_lap"];

export default async function AdminLocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const guard = await requireAdmin();
  if (guard) redirect("/admin");

  const t = await getTranslations("admin.location");
  const images = await getLocationImages();

  return (
    <div className="p-8 space-y-10">
      <h1 className="font-display text-2xl font-medium text-ink">{t("title")}</h1>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-ink/60 uppercase tracking-wider">
          {t("sectionTransport")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRANSPORT_KEYS.map((key) => (
            <LocationImageCard key={key} locationKey={key} imagePath={images[key] ?? null} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-ink/60 uppercase tracking-wider">
          {t("sectionAirports")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AIRPORT_KEYS.map((key) => (
            <LocationImageCard key={key} locationKey={key} imagePath={images[key] ?? null} />
          ))}
        </div>
      </section>
    </div>
  );
}
