import { SignUp } from "@clerk/nextjs";

/**
 * Sign-up page with Clerk component
 * Works immediately for local development
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/home"
      />
    </div>
  );
}
