import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function SectionCard({
  href,
  badge,
  title,
  description,
  imagePath,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
  imagePath?: string | null;
}) {
  return (
    <Link href={href as never} className="group block">
      <Card className="h-full transition-all duration-200 group-hover:border-border-strong group-hover:shadow-soft">
        <div className="bg-ocean h-32 flex items-end p-4 relative overflow-hidden">
          {imagePath && (
            <Image
              src={imagePath}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
          <Badge variant="peach" className="relative z-10">
            {badge}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-display text-2xl font-medium text-ink mb-2">
            {title}
          </h3>
          <p className="text-sm text-mist leading-relaxed">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
