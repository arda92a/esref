"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Mesaj gönderilemedi.");
        return;
      }

      toast.success("Mesajınız gönderildi, teşekkürler!");
      form.reset();
    } catch {
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" required maxLength={100} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" required maxLength={200} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefon (opsiyonel)</Label>
        <Input id="phone" name="phone" type="tel" maxLength={30} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mesajınız</Label>
        <Textarea id="message" name="message" required maxLength={2000} rows={5} />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}
