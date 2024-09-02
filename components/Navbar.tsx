import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  SignInButton,
  SignOutButton, 
  SignUpButton,
} from "@clerk/nextjs";

const Navbar = async () => {
  const  userdata = auth();
  const user = await currentUser()

  const isUser = userdata.userId; 
  const isUserAdmin = user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL_ADDRESS;

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex justify-between h-14 items-center border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>
          <div className="flex h-full items-center space-x-4">
            {isUser ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Logout
                  </Button>
                </SignOutButton>
                {isUserAdmin ? (
                  <Link
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    href="/admin"
                  >
                    Dashboard ✨
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button size="sm" variant="ghost">
                    Sign up
                  </Button>
                </SignUpButton>
                <Button className="" size="sm" variant="ghost">
                  <SignInButton />
                </Button>
              </>
            )}
            <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

            <Link
              href="/configure/upload"
              className={buttonVariants({
                size: "sm",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              Create case
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
