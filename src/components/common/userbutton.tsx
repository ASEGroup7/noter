import Image from "next/image";
import Link, { LinkProps } from "next/link";
import { UserIcon, BookmarkIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useUser, useClerk } from "@clerk/nextjs";

export default function UserButton() {
  const user = useUser();
  const { signOut } = useClerk();
  const userProfileImageUrl = user.user?.imageUrl;
  
  if(!user.isSignedIn) return null;

  return(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image height={32} width={32} src={userProfileImageUrl || ""} alt="Profile Image" className="transition-all rounded-full shadow-sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <DropdownMenuItemLink href="/profile">
              <UserIcon className="size-4" />
              <span>Profile</span>
            </DropdownMenuItemLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItemLink href="/library">
              <BookmarkIcon className="size-4" />
              <span>My notes</span>
            </DropdownMenuItemLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuItemLink href="/settings">
              <Cog8ToothIcon className="size-4" />
              <span>Settings</span>
            </DropdownMenuItemLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/"})}>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DropdownMenuLinkProps extends LinkProps {
  children: React.ReactNode;
}

function DropdownMenuItemLink({ children, ...props }: DropdownMenuLinkProps) {
  return (
    <Link {...props} className="flex items-center gap-2">
      {children}
    </Link>
  );
}