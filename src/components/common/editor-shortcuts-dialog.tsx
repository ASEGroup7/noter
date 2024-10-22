import { CircleHelp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from 'react';

const KeyboardShortcut = ({ children }: { children: React.ReactNode }) => {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {children}
    </kbd>
  );
};

const shortcuts = [
  { description: 'Bold', shortcut: 'Ctrl + B or **content**' },
  { description: 'Italic', shortcut: 'Ctrl + I or *content*' },
  { description: 'Underline', shortcut: 'Ctrl + U' },
  { description: 'Strikethrough', shortcut: 'Ctrl + Shift + X or ~~content~~' },
  { description: 'Highlight', shortcut: '==content==' },
  { description: 'Blockquote', shortcut: '> ' },
  { description: 'Heading 1', shortcut: '# ' },
  { description: 'Heading 2', shortcut: '## ' },
  { description: 'Heading 3', shortcut: '### ' },
  { description: 'Unordered List', shortcut: '- ' },
  { description: 'Ordered List', shortcut: '1. ' },
  { description: 'Task List', shortcut: '[ ] (unchecked) or [x] (checked)' },
  { description: 'Code', shortcut: 'Ctrl+E' },
  { description: 'Code Block', shortcut: '```' },
  { description: 'Link', shortcut: 'Ctrl+K' },
  { description: 'Image', shortcut: '![](url)' },
  { description: 'Horizontal Rule', shortcut: '---' },
  { description: 'Math Block', shortcut: '$content$' },
];

export default function MarkdownShortcutsDialog() {
  return (
    <div className="relative"> {/* Make sure parent has relative positioning */}
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <CircleHelp className="h-6 w-6 text-gray-800 dark:text-gray-100" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Markdown Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shortcuts.map((item) => (
              <div key={item.description} className="flex flex-col space-y-1">
                <div className="text-sm font-medium">{item.description}</div>
                <KeyboardShortcut>{item.shortcut}</KeyboardShortcut>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
