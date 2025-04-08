"use client"
import { Check } from "lucide-react";
import {FC, useState} from "react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import {IItem} from "@/components/All/ComboBox/interfaces.ts";

export interface ComboBoxProps {
  items: IItem[];
  onSelect: (id: number) => void;
  label?: string;
}

const ComboBox: FC<ComboBoxProps> = ({ items = [], onSelect, label = "Select ..." }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
          >
            {value ? items.find(item => item.value === value)?.label : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {items.map(item => (
                    <CommandItem
                        key={item.id}
                        value={item.value}
                        onSelect={currentValue => {
                          setValue(currentValue === value ? "" : currentValue);
                          onSelect(item.id);
                          setOpen(false);
                        }}
                    >
                      {item.label}
                      <Check
                          className={cn(
                              "ml-auto",
                              value === item.value ? "opacity-100" : "opacity-0",
                          )}
                      />
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  );
};

export default ComboBox;


