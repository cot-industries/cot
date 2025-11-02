import { redirect } from "next/navigation";

export default async function RootPage() {
  // Auth is handled by clerkMiddleware in proxy.ts
  // Redirect authenticated users to home
  redirect("/home");
}
