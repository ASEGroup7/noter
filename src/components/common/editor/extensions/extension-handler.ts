import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@/components/common/editor/extensions/placeholder";
import Details from "@/components/common/editor/extensions/details";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import DetailsContent from "@tiptap-pro/extension-details-content";


const ExtensionHandler = [
  StarterKit,
  Placeholder,
  Details,
  DetailsContent,
  DetailsSummary,
]

export default ExtensionHandler;