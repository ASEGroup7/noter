"use client";

import PageContainer from "@/components/layout/page-container";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"; // Assuming these are from your UI library
import Sidebar from "./_components/sidebarPanel"; // Your sidebar component
import NotesSection from "./_components/notessection"; // Main content component

import { useRef } from "react";
import { api } from "@convex/api";
import { usePaginatedQuery } from "convex/react";
import { useScroll } from "@/components/hooks/useScroll";

export default function Page() {
  const notesRef = useRef<HTMLDivElement | null>(null);

  const { results: notes, status, loadMore } = usePaginatedQuery(api.notes.get.list, {}, { initialNumItems: 5 });

  useScroll(notesRef, () => loadMore(5));

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
      
      {/* Main Content Panel */}
      <ResizablePanel defaultSize={80} minSize={50}>
        <PageContainer>
          <NotesSection />
        </PageContainer>
      </ResizablePanel>

      {/* Resizable handle between panels */}
      <ResizableHandle withHandle />

      {/* Sidebar Panel */}
      <ResizablePanel defaultSize={20} minSize={0} maxSize={20}>
        <Sidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}