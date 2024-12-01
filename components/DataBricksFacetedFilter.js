'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PlusCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DataBricksFacetedFilter({
  columnKey,
  items,
  title,
  columnFilters,
  setColumnFilters,
}) {
  // Extract unique values for the column
  const uniqueValues = React.useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item[columnKey]).filter(Boolean))
    );
  }, [items, columnKey]);

  const selectedValues = React.useMemo(() => {
    return new Set(columnFilters[columnKey] || []);
  }, [columnFilters, columnKey]);

  const toggleFilter = (value) => {
    setColumnFilters((prev) => {
      const updatedFilters = { ...prev };
      const currentValues = new Set(updatedFilters[columnKey] || []);

      if (currentValues.has(value)) {
        currentValues.delete(value);
      } else {
        currentValues.add(value);
      }

      updatedFilters[columnKey] = Array.from(currentValues);
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setColumnFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[columnKey];
      return updatedFilters;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal ml-2"
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${columnKey}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {uniqueValues.map((value) => {
                const isSelected = selectedValues.has(value);
                return (
                  <CommandItem key={value} onSelect={() => toggleFilter(value)}>
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary text-primary-foreground' : ''
                      )}
                    >
                      {isSelected && <Check />}
                    </div>
                    {String(value)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
