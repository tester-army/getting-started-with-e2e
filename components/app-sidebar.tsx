import { AppSidebarHeader } from "@/components/app-sidebar-header"
import { AppSidebarNav } from "@/components/app-sidebar-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth"
import { getProjects } from "@/lib/db"

export async function AppSidebar() {
  const user = await getCurrentUser()
  const projects = await getProjects(user.id)

  return (
    <AppSidebarNav
      user={user}
      projects={projects.map(({ id, name }) => ({ id, name }))}
    />
  )
}

export function AppSidebarSkeleton() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {["70%", "55%", "80%"].map((width) => (
              <SidebarMenuItem
                key={width}
                className="flex h-8 items-center gap-2 px-2"
              >
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-4" style={{ width }} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
