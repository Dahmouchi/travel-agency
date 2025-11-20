"use client"

import type { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import clsx from "clsx"
import { ChevronRight } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { state, setOpenMobile } = useSidebar()

  const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(fr|en)/, "")
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            getPathWithoutLocale(pathname) === item.url ||
            (item.url !== "/admin/dashboard" && getPathWithoutLocale(pathname).startsWith(item.url))

          const hasActiveSubitem = item.items?.some((subitem) => getPathWithoutLocale(pathname) === subitem.url)

          return (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      onClick={() => setOpenMobile(false)}
                      tooltip={item.title}
                      className={clsx(
                        "cursor-pointer transition-all rounded-lg duration-200 py-5",
                        isActive || hasActiveSubitem
                          ? "bg-lime-600 shadow-[4px_6px_7px_0px_rgba(0,_0,_0,_0.1)] text-white hover:bg-lime-700 hover:text-white font-semibold"
                          : "hover:bg-white dark:hover:bg-gray-800",
                      )}
                    >
                      <div
                        className={`${
                          (isActive || hasActiveSubitem) && state === "expanded"
                            ? "bg-white rounded-md p-1.5 text-lime-600"
                            : ""
                        }`}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                      </div>
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>

                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subitem) => {
                        const isSubitemActive = getPathWithoutLocale(pathname) === subitem.url
                        return (
                          <SidebarMenuSubItem key={subitem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={clsx(
                                "transition-all duration-200",
                                isSubitemActive
                                  ? "bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 font-medium"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
                              )}
                            >
                              <Link href={subitem.url} onClick={() => setOpenMobile(false)}>
                                <span>{subitem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
