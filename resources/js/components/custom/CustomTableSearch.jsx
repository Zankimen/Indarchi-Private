import React from "react";
import { Search } from "lucide-react"; // atau SearchIcon
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

function CustomTableSearch({ search, setSearch, onSearch, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#194AC2]"
      />
      <Button
        type="button"
        variant="outline"
        className="border-border cursor-pointer flex items-center justify-center"
        onClick={onSearch}
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default CustomTableSearch;
