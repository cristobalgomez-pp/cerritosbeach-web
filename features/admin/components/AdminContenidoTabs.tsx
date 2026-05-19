"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HotelList } from "@/features/hotels/components/admin/HotelList";
import { RestaurantList } from "@/features/restaurants/components/admin/RestaurantList";
import { SurfShopList } from "@/features/surf/components/admin/SurfShopList";
import { NewsList } from "@/features/news/components/admin/NewsList";
import { BannerCard } from "@/features/content/components/BannerCard";
import type { Hotel } from "@/features/hotels/types";
import type { Restaurant } from "@/features/restaurants/types";
import type { SurfShop } from "@/features/surf/types";
import type { NewsPost } from "@/features/news/types";
import type { PageBanner, PageSlug } from "@/features/content/types";
import { cn } from "@/lib/utils";

type Tab = "hoteles" | "restaurantes" | "surf" | "novedades" | "banners";

const PAGE_SLUGS: PageSlug[] = [
  "home",
  "hoteles",
  "surf",
  "comida",
  "novedades",
  "comunidad",
  "real-estate",
  "contacto",
  "emergencias",
];

interface Props {
  hotels: Hotel[];
  restaurants: Restaurant[];
  surfShops: SurfShop[];
  newsPosts: NewsPost[];
  banners: (PageBanner | null)[];
  activeTab: Tab;
  successKey: string | null;
  successTab: Tab | null;
}

export function AdminContenidoTabs({
  hotels,
  restaurants,
  surfShops,
  newsPosts,
  banners,
  activeTab: initialTab,
  successKey,
  successTab,
}: Props) {
  const router = useRouter();
  const tHotels = useTranslations("admin.hotels");
  const tRestaurants = useTranslations("admin.restaurants");
  const tSurf = useTranslations("admin.surf_shops");
  const tNews = useTranslations("admin.news");
  const tContenido = useTranslations("admin.contenido");

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const SUCCESS_KEYS: Record<string, string> = {
    created: "successCreate",
    updated: "successUpdate",
    deleted: "successDelete",
  };

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "hoteles", label: tHotels("listTitle") },
    { id: "restaurantes", label: tRestaurants("listTitle") },
    { id: "surf", label: tSurf("listTitle") },
    { id: "novedades", label: tNews("listTitle") },
    { id: "banners", label: tContenido("title") },
  ];

  const showSuccess = successKey != null && successTab === activeTab;

  return (
    <div>
      <div className="border-b border-border flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-ink text-ink"
                : "border-transparent text-mist hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {showSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            {activeTab === "hoteles" && tHotels(SUCCESS_KEYS[successKey!] as Parameters<typeof tHotels>[0])}
            {activeTab === "restaurantes" && tRestaurants(SUCCESS_KEYS[successKey!] as Parameters<typeof tRestaurants>[0])}
            {activeTab === "surf" && tSurf(SUCCESS_KEYS[successKey!] as Parameters<typeof tSurf>[0])}
            {activeTab === "novedades" && tNews(SUCCESS_KEYS[successKey!] as Parameters<typeof tNews>[0])}
          </div>
        )}

        {activeTab === "hoteles" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-ink">{tHotels("listTitle")}</h2>
              <Button asChild size="sm">
                <Link href="/admin/hoteles/new">{tHotels("createBtn")}</Link>
              </Button>
            </div>
            <HotelList hotels={hotels} />
          </div>
        )}

        {activeTab === "restaurantes" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-ink">{tRestaurants("listTitle")}</h2>
              <Button asChild size="sm">
                <Link href="/admin/restaurantes/new">{tRestaurants("createBtn")}</Link>
              </Button>
            </div>
            <RestaurantList restaurants={restaurants} />
          </div>
        )}

        {activeTab === "surf" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-ink">{tSurf("listTitle")}</h2>
              <Button asChild size="sm">
                <Link href="/admin/surf-shops/new">{tSurf("createBtn")}</Link>
              </Button>
            </div>
            <SurfShopList shops={surfShops} />
          </div>
        )}

        {activeTab === "novedades" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-medium text-ink">{tNews("listTitle")}</h2>
              <Button asChild size="sm">
                <Link href="/admin/novedades/new">{tNews("createBtn")}</Link>
              </Button>
            </div>
            <NewsList posts={newsPosts} />
          </div>
        )}

        {activeTab === "banners" && (
          <div>
            <h2 className="font-display text-xl font-medium text-ink mb-6">{tContenido("title")}</h2>
            <div className="space-y-4">
              {PAGE_SLUGS.map((slug, i) => (
                <BannerCard key={slug} page={slug} banner={banners[i]} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
