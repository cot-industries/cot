import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const { userId } = await auth();
  
  // Redirect based on auth status
  if (userId) {
    redirect("/home");
  } else {
    redirect("/sign-in");
  }
}
