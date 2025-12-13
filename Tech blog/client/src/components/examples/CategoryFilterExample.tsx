import { useState } from "react";
import CategoryFilter from "../blog/CategoryFilter";

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="p-4">
      <CategoryFilter selectedCategory={selected} onCategoryChange={setSelected} />
      <p className="mt-4 text-sm text-muted-foreground">
        Selected: {selected ?? "All"}
      </p>
    </div>
  );
}
