"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";

export default function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function getUrl() {
    return window.location.href;
  }

  async function copyLink(message = "Bağlantı kopyalandı.") {
    await navigator.clipboard.writeText(getUrl());
    toast.success(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShareClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: getUrl() });
      } catch {
        // kullanıcı iptal etti, sessizce geç
      }
      return;
    }
    setOpen((v) => !v);
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${title}\n${getUrl()}`
  )}`;

  return (
    <div ref={ref} className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={handleShareClick}
      >
        <Share2 className="size-4" />
        Paylaş
      </Button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 space-y-0.5 rounded-xl border bg-background p-1.5 shadow-lg">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <WhatsAppIcon className="size-4 text-[#25D366]" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() =>
              copyLink(
                "Bağlantı kopyalandı, Instagram'da paylaşabilirsin."
              )
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <InstagramIcon className="size-4 text-[#E4405F]" />
            Instagram
          </button>
          <button
            type="button"
            onClick={() => copyLink()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {copied ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <LinkIcon className="size-4 text-muted-foreground" />
            )}
            Bağlantıyı Kopyala
          </button>
        </div>
      )}
    </div>
  );
}
