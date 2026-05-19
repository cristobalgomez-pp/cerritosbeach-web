import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { SurfShop } from "@/features/surf/types";

interface Props {
  shop: SurfShop;
  locale: "es" | "en";
  supabaseUrl: string;
}

export function SurfShopCard({ shop, locale, supabaseUrl }: Props) {
  const t = useTranslations("surf");
  const name        = locale === "es" ? shop.name_es : shop.name_en;
  const description = locale === "es" ? shop.description_es : shop.description_en;

  const coverUrl = shop.cover_image_path
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${shop.cover_image_path}`
    : null;

  return (
    <Link href={{ pathname: "/surf/[slug]", params: { slug: shop.slug } }}>
    <Card className="h-full flex flex-col group hover:border-border-strong hover:shadow-soft transition-all duration-200">
      <div className="bg-ocean h-44 flex items-end p-4 relative overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-medium text-ink mb-1">{name}</h3>
        {shop.address && (
          <p className="text-xs text-mist mb-3">{shop.address}</p>
        )}
        {description && (
          <p className="text-sm text-ink-muted leading-relaxed flex-1 mb-4">{description}</p>
        )}

        {shop.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.services.map((service) => (
              <Badge key={service} variant="ocean">
                {t(`services.${service as "rentals" | "lessons" | "repairs" | "shop"}`)}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          {shop.price_from != null && shop.price_from > 0 ? (
            <p className="text-sm text-ink">
              <span className="text-mist text-xs">
                {locale === "es" ? "Desde " : "From "}
              </span>
              <span className="font-medium">
                {formatPrice(shop.price_from, "MXN", locale)}
              </span>
            </p>
          ) : (
            <span />
          )}
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="text-sm text-ocean hover:underline">
              {shop.phone}
            </a>
          )}
        </div>
      </div>
    </Card>
    </Link>
  );
}
