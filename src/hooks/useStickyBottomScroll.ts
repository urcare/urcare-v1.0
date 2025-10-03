import { useEffect, useRef, useState } from "react";

export function useStickyBottomScroll() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(2);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if bottom edge is at viewport bottom
      const atBottom = rect.bottom >= viewportHeight - 10;

      if (atBottom && rect.top < viewportHeight) {
        setIsSticky(true);
        // Gradually show more items as you scroll
        const scrollProgress = Math.min((viewportHeight - rect.top) / 300, 1);
        const newVisibleItems = Math.min(2 + Math.floor(scrollProgress * 3), 5);
        setVisibleItems(newVisibleItems);
      } else {
        setIsSticky(false);
        setVisibleItems(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { cardRef, visibleItems, isSticky };
}
