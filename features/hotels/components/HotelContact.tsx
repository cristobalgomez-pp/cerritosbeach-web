interface Props {
  phone: string | null;
  website: string | null;
}

export function HotelContact({ phone, website }: Props) {
  const waPhone = phone?.replace(/\D/g, "");

  return (
    <div className="flex flex-wrap gap-3">
      {phone && (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
        >
          {phone}
        </a>
      )}
      {phone && waPhone && (
        <a
          href={`https://wa.me/${waPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
        >
          WhatsApp
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
        >
          Sitio web
        </a>
      )}
    </div>
  );
}
