import React from "react";

import { SearchIcon } from "lucide-react";

import { Input } from "@components/ui/input";

function CustomTableSearch({ search, setSearch, onSearch, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default CustomTableSearch;
