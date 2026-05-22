import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";

async function getCurrentProject() {
  if (!process.env.AWS_ACCESS_KEY_ID) return null;
  try {
    const cookieStore = await cookies();
    const projectId = cookieStore.get("currentProjectId")?.value;
    if (!projectId) return null;
    const { getProject } = await import("@/lib/projects");
    return await getProject(projectId);
  } catch {
    return null;
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentProject = await getCurrentProject();

  return (
    <AppShell sidebar={<Sidebar currentProject={currentProject ?? undefined} />}>
      {children}
    </AppShell>
  );
}
