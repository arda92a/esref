"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteAdminUser } from "./actions";

export default function DeleteUserButton({
  id,
  email,
}: {
  id: string;
  email: string | null;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${email}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteAdminUser(id);
      } catch (err) {
        toast.error((err as Error).message || "Kullanıcı silinemedi.");
      }
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={pending}>
      <Trash2 className="size-4" />
      Sil
    </Button>
  );
}
