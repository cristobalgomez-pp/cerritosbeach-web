"use client";

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export function HotelMap({ lat, lng, name }: Props) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-sm">
      <iframe
        src={src}
        title={name}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
