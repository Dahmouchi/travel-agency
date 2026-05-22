"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    { value = [], onChange, placeholder = "Add a tag...", className, maxTags },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag();
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        value.length > 0
      ) {
        removeTag(value.length - 1);
      }
    };

    const addTag = () => {
      const trimmedValue = inputValue.trim().toLowerCase();
      if (trimmedValue && !value.includes(trimmedValue)) {
        if (maxTags && value.length >= maxTags) return;
        onChange([...value, trimmedValue]);
        setInputValue("");
      }
    };

    const removeTag = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div
        ref={ref}
        onClick={handleContainerClick}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text",
          className
        )}
      >
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className="gap-1 pr-1 hover:bg-secondary"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
          disabled={maxTags ? value.length >= maxTags : false}
        />
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
