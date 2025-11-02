"use client"

import { UserButton } from "@clerk/nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopNavbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Mobile menu trigger */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Workspace/Project Selector */}
      <Select defaultValue="default">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">My Workspace</SelectItem>
          <SelectItem value="team">Team Workspace</SelectItem>
        </SelectContent>
      </Select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-4" />
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
        />
      </div>
    </header>
  )
}
