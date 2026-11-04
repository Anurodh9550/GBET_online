import Image from "next/image";
import { cn } from "@/lib/utils";

export function PhotoPanel({
  src,
  alt,
  caption,
  sizes = "(max-width: 1024px) 100vw, 40vw",
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn("relative overflow-hidden rounded-3xl bg-mist", className)}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      {caption ? (
        <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-ink shadow-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
