import KBDIcon from "@/components/common/kbd-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import shortcuts from "@/data/shortcuts";

interface EditorShortcutsDialogProps {
  trigger: string | React.ReactNode;
}

export default function EditorShortcutsDialog(
  props: EditorShortcutsDialogProps
) {
  return (
    <Dialog>
      <DialogTrigger>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Command</TableHead>
              <TableHead>Shortcut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut, index) => (
              <TableRow key={shortcut.command}>
                <TableCell>{shortcut.command}</TableCell>
                <TableCell>
                  {shortcut.windows.map((item, index) => (
                    <>
                      <KBDIcon>{item}</KBDIcon>
                      {index !== shortcut.windows.length - 1 && ", "}
                    </>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}