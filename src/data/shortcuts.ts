export interface ShortcutsType {
  command: string,
  windows: string[],
}

const Shortcuts : ShortcutsType[] = [
  {
    command: "Toggle Blockquote",
    windows: ["Cntrl","Shift","B"],
  },
  {
    command: "Toggle Bulletlist",
    windows: ["Cntrl", "Shift", "8"],
  },
  {
    command: "Toggle Codeblock",
    windows: ["Cntrl", "Alt", "C"],
  },
  {
    command: "Toggle Heading",
    windows: ["Cntrl", "Alt", "1 ~ 6"],
  },
  {
    command: "Toggle Highlight",
    windows: ["Cntrl", "Shift", "H"],
  },
  {
    command: "Toggle Highlight",
    windows: ["Cntrl", "Shift", "H"],
  },
  {
    command: "Toggle Orderedlist",
    windows: ["Cntrl", "Shift", "H"],
  },
  {
    command: "Toggle Subscript",
    windows: ["Cntrl", ","],
  },
  {
    command: "Toggle Subscript",
    windows: ["Cntrl", "."],
  },
  {
    command: "Set Paragraph",
    windows: ["Cntrl", "Alt", "0"],
  },
]

export default Shortcuts;