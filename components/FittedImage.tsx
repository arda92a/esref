import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Shows the whole photo without cropping. Empty space around square or
 * portrait photos is filled with a blurred copy of the same photo instead of
 * white bars. Place inside a `relative overflow-hidden` box with a fixed size.
 */
export default function FittedImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        priority={priority}
        className="scale-110 object-cover blur-2xl"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain", className)}
      />
    </>
  );
}
