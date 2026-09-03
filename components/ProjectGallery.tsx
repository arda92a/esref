"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

export default function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const canLoop = images.length > 1;
  // Mobile screens are narrower (fewer photos peek at once), so the continuous
  // "marquee" scroll already looks full starting at 3 photos there; desktop needs 4+.
  const useContinuousScroll = images.length >= (isMobile ? 3 : 4);

  // Memoized: Embla reInits (restarting the scroll animation) whenever options/plugins
  // are a new reference, so recreating these inline on every render caused the
  // continuous auto-scroll to keep resetting instead of gliding smoothly.
  const options = useMemo(
    () => ({
      loop: canLoop,
      align: "start" as const,
      dragFree: true,
      containScroll: "trimSnaps" as const,
    }),
    [canLoop]
  );
  const plugins = useMemo(
    () =>
      canLoop
        ? [
            useContinuousScroll
              ? AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })
              : Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
          ]
        : [],
    [canLoop, useContinuousScroll]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="group/gallery relative">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className="relative aspect-[4/3] w-[68%] shrink-0 grow-0 basis-[68%] cursor-grab overflow-hidden rounded-xl bg-muted active:cursor-grabbing sm:w-[42%] sm:basis-[42%] md:w-[31%] md:basis-[31%]"
              >
                <Image
                  src={src}
                  alt={`${title} - fotoğraf ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 31vw, (min-width: 640px) 42vw, 68vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>

        {canLoop && (
          <>
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover/gallery:opacity-100 hover:bg-background sm:flex"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={scrollNext}
              className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover/gallery:opacity-100 hover:bg-background sm:flex"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{title} galerisi</DialogTitle>
          {selectedIndex !== null && (
            <GalleryLightbox images={images} title={title} startIndex={selectedIndex} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryLightbox({
  images,
  title,
  startIndex,
}: {
  images: string[];
  title: string;
  startIndex: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex,
    loop: images.length > 1,
  });
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-md" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-video w-full shrink-0 grow-0 basis-full"
            >
              <Image
                src={src}
                alt={`${title} - fotoğraf ${i + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Önceki fotoğraf"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Sonraki fotoğraf"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="mt-2 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === current ? "w-4 bg-foreground" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

