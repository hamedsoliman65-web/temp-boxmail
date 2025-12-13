import { Button } from "@/components/ui/button";
import { Cpu, Shield, Laptop, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: null, label: "All", icon: LayoutGrid },
  { id: "AI", label: "AI", icon: Cpu },
  { id: "Cybersecurity", label: "Cybersecurity", icon: Shield },
  { id: "Technology", label: "Technology", icon: Laptop },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      data-testid="category-filter"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        return (
          <Button
            key={category.id ?? "all"}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            data-testid={`button-category-${category.label.toLowerCase()}`}
          >
            <Icon className="w-4 h-4 mr-1.5" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
