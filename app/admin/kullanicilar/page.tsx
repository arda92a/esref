import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import NewUserForm from "./NewUserForm";
import DeleteUserButton from "./DeleteUserButton";

export default async function KullanicilarPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let users: { id: string; email: string | null; created_at: string }[] = [];
  let listError: string | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) throw error;
    users = data.users.map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at,
    }));
  } catch (err) {
    listError = (err as Error).message;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Kullanıcılar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin paneline giriş yapabilecek yeni bir kullanıcı ekleyin.
        </p>
      </div>

      <NewUserForm />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          Mevcut Kullanıcılar
        </h2>
        {listError ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-destructive">
            {listError}
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm font-medium">{u.email}</span>
                  <span className="ml-3 text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                {u.id !== currentUser?.id && (
                  <DeleteUserButton id={u.id} email={u.email} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
