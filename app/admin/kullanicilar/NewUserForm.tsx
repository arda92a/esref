"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminUser } from "./actions";

export default function NewUserForm() {
  const [state, formAction, pending] = useActionState(createAdminUser, undefined);

  return (
    <form
      action={formAction}
      key={state?.success ?? "form"}
      className="space-y-4 rounded-lg border p-4"
    >
      <h2 className="text-sm font-semibold text-foreground">
        Yeni Kullanıcı Ekle
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor="new-user-email">E-posta</Label>
        <Input id="new-user-email" name="email" type="email" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="new-user-password">Şifre</Label>
        <Input
          id="new-user-password"
          name="password"
          type="password"
          minLength={6}
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">{state.success}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Ekleniyor..." : "Kullanıcı Ekle"}
      </Button>
    </form>
  );
}
