import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength)}...`;
  }
  return str;
}

export function copyToClipboard(str: string) {
  navigator.clipboard.writeText(str).then(() => {
    toast("Copied to clipboard!")
    return true;
  }).catch((e) => {
    console.error(e);
    return false;
  })
}

export function toPascalCase(str: string) {
  const words = str.match(/[a-zA-Z0-9]+/g) || [];

  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('');
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}