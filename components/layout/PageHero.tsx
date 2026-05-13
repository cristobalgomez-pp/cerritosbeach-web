import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-ocean text-foam">
      <Container className="py-16 md:py-20">
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
