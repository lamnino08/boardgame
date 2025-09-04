import Button from "@/components/ui/common/button/button";
import { SignInForm } from "@/components/ui/form/app/user/sign-in-form";
import {Card} from "@/components/ui/Card";
import Link from "@/components/ui/link";
import icons from "@/components/icons";
import { Split } from "../../_component/split";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:w-4/5 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
      <Card>

        <SignInForm />

        <Split />

        <div className="flex flex-col gap-3">
          <Button
            icon={icons.google}
            variant="inverse"
          >
            Continue with Google
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link href="/auth/sign-up">Sign Up</Link>
        </div>
      </Card>
    </div>
  );
}