import Link from "next/link"

export default function Page() {
  return(
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-9xl">Uh OH</h1>
      <p className="text-sm">
        Go to {" "}
        <Link href="/" className="underline hover:cursor-pointer">
          home page
        </Link>
      </p>
    </div>
  )
}