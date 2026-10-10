import { Suspense } from "react"

import { AppSidebar, AppSidebarSkeleton } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">Todos</span>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
