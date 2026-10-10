import { ListTodoIcon } from "lucide-react"

import { SidebarHeader } from "@/components/ui/sidebar"

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ListTodoIcon className="size-4" />
        </div>
        <span className="font-semibold">Todos</span>
      </div>
    </SidebarHeader>
  )
}
