"use client";
import Notes from "./_components/notes";

export default function Page() {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_350px] px-[8%] gap-16 relative">
      <Notes />
      {/* TODO : Add something here. */}
      <div className="hidden lg:block flex-1 border-l">
      </div> 
    
    </div>
  );
}