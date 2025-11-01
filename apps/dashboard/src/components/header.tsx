import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-sm text-muted-foreground">{/* Breadcrumbs or page info */}</div>

      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
