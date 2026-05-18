import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Hotel } from "@/features/hotels/types";

interface Props {
  hotel: Hotel;
  locale: "es" | "en";
  supabaseUrl: string;
}

export function HotelCard({ hotel, locale, supabaseUrl }: Props) {
  const name = locale === "es" ? hotel.name_es : hotel.name_en;
  const description = locale === "es" ? hotel.description_es : hotel.description_en;

  const coverUrl = hotel.cover_image_path
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${hotel.cover_image_path}`
    : null;

  return (
    <Link href={{ pathname: "/hoteles/[slug]", params: { slug: hotel.slug } }}>
    <Card className="h-full flex flex-col group hover:border-border-strong hover:shadow-soft transition-all duration-200">
      <div className="bg-ocean h-44 flex items-end justify-between p-4 relative overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
        )}
        {hotel.category && (
          <div className="relative z-10">
            <Badge variant="ocean">{hotel.category}</Badge>
          </div>
        )}
        {hotel.featured && (
          <div className="relative z-10 ml-auto">
            <Badge variant="peach">★</Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-medium text-ink mb-1">{name}</h3>
        {hotel.address && (
          <p className="text-xs text-mist mb-3">{hotel.address}</p>
        )}
        {description && (
          <p className="text-sm text-ink-muted leading-relaxed flex-1">{description}</p>
        )}
        {(hotel.phone || hotel.website) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm">
            {hotel.phone && (
              <a href={`tel:${hotel.phone}`} className="text-ocean hover:underline">
                {hotel.phone}
              </a>
            )}
            {hotel.website && (
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean hover:underline"
              >
                sitio web
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
    </Link>
  );
}
