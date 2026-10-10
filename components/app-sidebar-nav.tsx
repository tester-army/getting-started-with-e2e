"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { HashIcon, InboxIcon, LogOutIcon, SettingsIcon } from "lucide-react"

import { signOutAction } from "@/app/actions/auth"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import { DeleteProjectButton } from "@/components/projects/delete-project-button"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import type { CurrentUser } from "@/lib/auth"

export type SidebarProject = { id: string; name: string }

export function AppSidebarNav({
  user,
  projects,
}: {
  user: CurrentUser
  projects: SidebarProject[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onTodos = pathname === "/todos"
  const activeProjectId = onTodos ? searchParams.get("project") : null

  return (
    <Sidebar>
      <AppSidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu aria-label="Projects">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={onTodos && !activeProjectId}
                  render={<Link href="/todos" />}
                >
                  <InboxIcon />
                  <span>Inbox</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    isActive={activeProjectId === project.id}
                    render={
                      <Link
                        href={`/todos?project=${encodeURIComponent(project.id)}`}
                      />
                    }
                  >
                    <HashIcon />
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                  <DeleteProjectButton
                    project={project}
                    isActive={activeProjectId === project.id}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="px-0 pt-2">
              <NewProjectDialog />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/settings"}
              render={<Link href="/settings" />}
            >
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="mx-0" />
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium uppercase">
            {(user.displayName || user.email).slice(0, 1)}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              className="truncate text-sm font-medium"
              data-testid="user-display-name"
            >
              {user.displayName || user.email}
            </span>
            {user.displayName && (
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            )}
          </div>
          <form action={signOutAction}>
            <SidebarMenuButton
              type="submit"
              size="sm"
              className="size-7 justify-center p-0"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOutIcon />
            </SidebarMenuButton>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
