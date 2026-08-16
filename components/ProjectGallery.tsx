"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={src}
              alt={`${title} - fotoğraf ${i + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
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

