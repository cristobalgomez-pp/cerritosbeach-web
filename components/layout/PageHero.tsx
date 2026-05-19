import Image from "next/image";
import { Container } from "@/components/ui/Container";

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images`
  : "";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imagePath,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  imagePath?: string | null;
}) {
  const imageUrl = imagePath ? `${STORAGE_BASE}/${imagePath}` : null;

  return (
    <section className="relative bg-ocean text-foam overflow-hidden">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <Container className="relative py-16 md:py-20">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.08em] text-peach mb-4">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display font-medium text-4xl md:text-5xl tracking-tight max-w-3xl leading-[1.05]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-lg text-foam/80 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
