"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, LayoutDashboard, Box, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Entities", href: "/entities", icon: Box },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && <span className="text-xl font-bold">Cot</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t">
        <div className={cn("text-xs text-muted-foreground", collapsed && "text-center")}>
          {collapsed ? "v1" : "Version 1.0.0"}
        </div>
      </div>
    </div>
  )
}
