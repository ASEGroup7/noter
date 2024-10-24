import Document from "@tiptap/extension-document";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@/components/common/editor/extensions/placeholder";
import Details from "@/components/common/editor/extensions/details";
import DetailsSummary from "@tiptap-pro/extension-details-summary"; // Import from Tiptap Pro if that's what you're using
import DetailsContent from "@tiptap-pro/extension-details-content";
import Typography from "@tiptap/extension-typography";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowLight from "@/components/common/editor/extensions/codeblock-lowlight";
import History from "@tiptap/extension-history";
import { Mathematics } from "@tiptap-pro/extension-mathematics";
import Gapcursor from "@tiptap/extension-gapcursor";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import Emoji from "@/components/common/editor/extensions/emoji";
import Hardbreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Underline from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@/components/common/editor/extensions/text-align";
import Table from "@/components/common/editor/extensions/table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@/components/common/editor/extensions/task-item";
import TaskList from "@tiptap/extension-task-list";
import NodeRange from "@tiptap-pro/extension-node-range";
import UniqueID from "@/components/common/editor/extensions/unique-id";
import FileHandler from "@/components/common/editor/extensions/file-handler";

// Registering the extensions
const ExtensionHandler = [
  Placeholder, 
  Details, // Main details node
  DetailsContent, // Content within details
  DetailsSummary.configure({
    HTMLAttributes: {
      class: "details-summary",
    },
  }), // Configure DetailsSummary properly
  Document, // not needed for menu bar
  Paragraph, // not needed for menu bar
  Text,
  BulletList, // added
  ListItem, // added
  Blockquote, // add in a menu tab 
  Heading, // added
  Underline, // added
  Typography,
  OrderedList, // added 
  CodeBlockLowLight, // add in a menu tab 
  History, 
  Mathematics, 
  Bold, // added
  Code, // added
  Italic, // added
  Strike, // added
  Gapcursor,
  Dropcursor,
  Link,
  Emoji,
  Hardbreak, // not needed for menu bar
  HorizontalRule, // added
  Highlight.configure({
    multicolor: true, // Allow multiple highlight colors
  }), 
  Image,
  Color, // added
  TextStyle, // added
  FontFamily, // added
  Subscript,
  Superscript,
  CharacterCount,
  TextAlign, // added
  Table.configure({ resizable: true }),
  TableCell, 
  TableHeader,
  TableRow,
  TaskItem, // added
  TaskList, // added
  NodeRange,
  UniqueID,
  // FileHandler,
];

export default ExtensionHandler;
