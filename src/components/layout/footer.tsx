import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return(
    <div className="flex justify-center border-t border-gray-100">
      <div className="h-[60px] px-[1%] flex items-center justify-between w-screen text-sm">
        <div className="flex gap-4">
          <Link className="hover:underline" href="/about">About</Link>
          <Link className="hover:underline" href="/privacy">Privacy</Link>
          <Link className="hover:underline" href="/terms">Terms</Link>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-base">© <span className="text-sm"> {currentYear} all rights reserved.</span></span>
        </div>
      </div>
    </div>
  )
}