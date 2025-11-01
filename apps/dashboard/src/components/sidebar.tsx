import { Database, Home, Key, Settings } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Cot</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/entities"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Database className="h-4 w-4" />
          Entities
        </Link>

        <Link
          href="/api-keys"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Key className="h-4 w-4" />
          API Keys
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
