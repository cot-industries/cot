import { SignIn } from "@clerk/nextjs";

/**
 * Sign-in page with Clerk component
 * Works immediately for local development
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/home"
      />
    </div>
  );
}
