import { SignUpForm } from "@/components/ui/form/app/user/sign-up-form";
// import {Card} from "@/components/ui/Card";
import Link from "@/components/ui/link";

export default function SignUp() {
  return (
    <>
      <SignUpForm />

      {/* <Split />

      <div className="flex flex-col gap-3">
        <Button
          icon={icons.google}
          variant="inverse"
        >
          Continue with Google
        </Button>
      </div> */}

      <div className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/auth/sign-in">Sign In</Link>
      </div>
    </>
  );
}
