import { useEffect } from "react";

export default function useScroll(
  ref : React.RefObject<HTMLElement>,
  callback : () => void,
) {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || ref.current.scrollHeight - ref.current.scrollTop !== ref.current.clientHeight) return;
      callback();
    }

    const currentRef = ref.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [callback, ref])
}