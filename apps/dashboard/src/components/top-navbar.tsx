"use client"

import { UserButton } from "@clerk/nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

export function TopNavbar() {
  return (
    <div className="flex h-16 items-center gap-4 border-b px-6 bg-background">
      {/* Workspace/Project Selector */}
      <Select defaultValue="default">
        <SelectTrigger className="w-[200px]">
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
        <Separator orientation="vertical" className="h-6" />
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9"
            }
          }}
        />
      </div>
    </div>
  )
}
