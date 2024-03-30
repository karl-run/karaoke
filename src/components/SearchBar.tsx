"use client";

import { useRef, ReactElement, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { usePathname } from "next/navigation";

function SearchBar(): React.ReactElement | null {
  const path = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useQueryState("q", {
    shallow: false,
    throttleMs: 1000,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (path !== "/") {
    return null;
  }

  return (
    <div className="p-3">
      <Input
        ref={searchRef}
        placeholder="Search for a song"
        onChange={(e) => setSearch(e.target.value)}
        value={search || ""}
      />
    </div>
  );
}

export default SearchBar;
