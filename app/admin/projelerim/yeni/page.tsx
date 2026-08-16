import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Yeni Proje Ekle
      </h1>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
