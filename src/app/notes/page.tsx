"use client";
import Notes from "./_components/notes";

export default function Page() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] px-[8%] gap-16 relative">
      <Notes />
      <div className="hidden lg:block sticky h-[calc(100vh-122px)] border-l"></div>
    </div>
  );
}