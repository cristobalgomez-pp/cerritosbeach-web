import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Restaurant } from "@/features/restaurants/types";

interface Props {
  restaurant: Restaurant;
  locale: "es" | "en";
  supabaseUrl: string;
}

export function RestaurantCard({ restaurant, locale, supabaseUrl }: Props) {
  const name        = locale === "es" ? restaurant.name_es : restaurant.name_en;
  const description = locale === "es" ? restaurant.description_es : restaurant.description_en;

  const coverUrl = restaurant.cover_image_path
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${restaurant.cover_image_path}`
    : null;

  return (
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
        <div className="relative z-10 flex gap-2">
          {restaurant.cuisine_type && (
            <Badge variant="ocean">{restaurant.cuisine_type}</Badge>
          )}
        </div>
        {restaurant.price_range && (
          <div className="relative z-10">
            <Badge variant="peach">{restaurant.price_range}</Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-medium text-ink mb-1">{name}</h3>
        {restaurant.address && (
          <p className="text-xs text-mist mb-1">{restaurant.address}</p>
        )}
        {restaurant.hours && (
          <p className="text-xs text-mist mb-3">{restaurant.hours}</p>
        )}
        {description && (
          <p className="text-sm text-ink-muted leading-relaxed flex-1">{description}</p>
        )}
        {(restaurant.phone || restaurant.website) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="text-ocean hover:underline">
                {restaurant.phone}
              </a>
            )}
            {restaurant.website && (
              <a
                href={restaurant.website}
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
  );
}
