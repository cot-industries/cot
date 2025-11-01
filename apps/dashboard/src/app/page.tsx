import { redirect } from "next/navigation";

export default async function HomePage() {
  // Auth is handled by clerkMiddleware in proxy.ts
  // Redirect authenticated users to dashboard
  redirect("/dashboard");
}
