"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteProject } from "@/app/admin/projelerim/actions";

export default function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${title}" projesini silmek istediğinize emin misiniz?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProject(id);
      } catch {
        toast.error("Proje silinemedi.");
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
