import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash, Eye, EyeOff, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const getFilterTest = (filter) => {
  if (typeof filter === "function") return filter;
  return (item) => item.category === filter || filter === "*";
};

const getItemSorter = (sortHistory, sortAsc = true) => (a, b) => {
  for (const sortBy of sortHistory) {
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    if (aValue > bValue || aValue < bValue) {
      return sortAsc ? (aValue > bValue ? 1 : -1) : (aValue > bValue ? -1 : 1);
    }
  }
  return 0;
};

const DataBricks = ({
  items = [],
  filter = "*",
  sortBy = ["original-order"],
  transitionDuration = 300,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortHistory, setSortHistory] = useState(sortBy);
  const [categoryFilter, setCategoryFilter] = useState(filter);
  const [layoutMode, setLayoutMode] = useState("masonry");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fullWidthCardId, setFullWidthCardId] = useState(null);

  useEffect(() => {
    const filterTest = getFilterTest(categoryFilter);
    const sortedItems = items
      .filter((item) => filterTest(item))
      .sort(getItemSorter(sortHistory));

    setFilteredItems(sortedItems);
  }, [categoryFilter, sortHistory, items]);

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const shuffleItems = () => {
    setFilteredItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const renderKeyValuePairs = (item, isFullWidth, isLargeSize) => {
  const keyValuePairs = Object.entries(item).filter(
    ([key]) => !["id", "title", "description", "category", "isHidden"].includes(key)
  );

  const firstColumn = keyValuePairs.slice(0, 6);
  const secondColumn = keyValuePairs.slice(
    8,
    isLargeSize ? 20 : isFullWidth ? keyValuePairs.length : 0
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex flex-col space-y-2">
        {firstColumn.map(([key, value]) => (
          <div key={key} className={`${key}_field text-sm text-gray-600`}>
            <span className="font-medium">{formatKey(key)}:</span>
            {key === "tags" && Array.isArray(value) ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {value.map((tag, index) => (
                  <Badge key={index} className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <span> {value}</span>
            )}
          </div>
        ))}
      </div>
      {secondColumn.length > 0 && (isLargeSize || isFullWidth) && (
        <div
          className={cn(
            "flex flex-col space-y-2",
            isFullWidth ? "ml-[25vw] is-full-width" : "ml-[120px] is-large"
          )}
        >
          {secondColumn.map(([key, value]) => (
            <div key={key} className={`${key}_field text-sm text-gray-600`}>
              <span className="font-medium">{formatKey(key)}:</span>
              {key === "tags" && Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {value.map((tag, index) => (
                    <Badge key={index} className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span> {value}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

  const renderItems = () =>
    filteredItems
      .filter((item) => !item.isHidden) // Exclude hidden items from rendering
      .map((item) => {
        const isSelected = selectedCardId === item.id;
        const isFullWidth = fullWidthCardId === item.id;
        const isLargeSize = isSelected && !isFullWidth;

        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            onClick={() => {
              if (!isFullWidth) {
                setSelectedCardId((prevId) => (prevId === item.id ? null : item.id));
              }
            }}
            className={cn(
              "aspect-square cursor-pointer", // Ensure all cards are square and have pointer cursor
              layoutMode === "masonry" && "w-full",
              layoutMode === "fit-rows" && "w-full",
              layoutMode === "vertical" && "w-full",
              isSelected && "scale-[2] col-span-2 row-span-2", // Double size if clicked
              isFullWidth && "col-span-full row-span-full w-full aspect-square" // Full width if maximized
            )}
          >
            <Card className="shadow relative h-full">
              {/* Icons in the top-right corner */}
              <div className="absolute top-5 right-5 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Trash
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event bubbling
                          setFilteredItems((prev) =>
                            prev.filter((i) => i.id !== item.id)
                          );
                        }}
                        size={20}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Remove Item</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {item.isHidden ? (
                        <Eye
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click event bubbling
                            setFilteredItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, isHidden: !i.isHidden }
                                  : i
                              )
                            );
                          }}
                          size={20}
                        />
                      ) : (
                        <EyeOff
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click event bubbling
                            setFilteredItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, isHidden: !i.isHidden }
                                  : i
                              )
                            );
                          }}
                          size={20}
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.isHidden ? "Show Item" : "Hide Item"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Maximize2
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event bubbling
                          setFullWidthCardId((prevId) =>
                            prevId === item.id ? null : item.id
                          );
                          setSelectedCardId(null); // Clear double-size state
                        }}
                        size={20}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Maximize Item</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {renderKeyValuePairs(item, isFullWidth, isLargeSize)}
              </CardContent>
            </Card>
          </motion.div>
        );
      });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Filter by category"
          value={categoryFilter === "*" ? "" : categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value || "*")}
          className="w-full max-w-sm"
        />
        <Button onClick={shuffleItems}>Shuffle</Button>
        <Button onClick={() => setSortHistory(["title"])}>Sort by Title</Button>
        <Button onClick={() => setSortHistory(["category"])}>Sort by Category</Button>
        <Button
          onClick={() =>
            setLayoutMode(layoutMode === "masonry" ? "vertical" : "masonry")
          }
        >
          Toggle Layout
        </Button>
      </div>

      <AnimatePresence>
        <motion.div
          layout // Enable layout animations for the grid
          className={cn(
            "grid gap-4",
            layoutMode === "masonry" &&
              "grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]",
            layoutMode === "fit-rows" && "grid-cols-1",
            layoutMode === "vertical" && "grid-cols-1"
          )}
        >
          {renderItems()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DataBricks;
