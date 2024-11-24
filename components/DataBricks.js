import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash, Eye, EyeOff } from "lucide-react";
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

  const renderItems = () =>
    filteredItems.map((item) => (
      <motion.div
        key={item.id}
        variants={itemVariants}
        initial="hidden"
        animate={!item.isHidden ? "visible" : "hidden"}
        exit="exit"
        layout
        className={cn(
          layoutMode === "masonry" && "w-full",
          layoutMode === "fit-rows" && "w-full",
          layoutMode === "vertical" && "w-full",
          "aspect-square" // Ensure each card is a square
        )}
      >
        <Card className="shadow relative h-full">
          {/* Icons in the top-right corner */}
          <div className="absolute top-2 right-2 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Trash
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() =>
                      setFilteredItems((prev) =>
                        prev.filter((i) => i.id !== item.id)
                      )
                    }
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
                      onClick={() =>
                        setFilteredItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, isHidden: !i.isHidden }
                              : i
                          )
                        )
                      }
                      size={20}
                    />
                  ) : (
                    <EyeOff
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                      onClick={() =>
                        setFilteredItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, isHidden: !i.isHidden }
                              : i
                          )
                        )
                      }
                      size={20}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {item.isHidden ? "Show Item" : "Hide Item"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(item).map(([key, value]) => {
              if (["id", "title", "description", "category", "isHidden"].includes(key)) {
                return null;
              }
              return (
                <div key={key} className={`${key}_field text-sm text-gray-600`}>
                  <span className="font-medium">{formatKey(key)}:</span> {value}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    ));

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
          className={cn(
            "grid gap-4",
            layoutMode === "masonry" &&
              "grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]",
            layoutMode === "fit-rows" && "grid-cols-1",
            layoutMode === "vertical" && "grid-cols-1"
          )}
          style={{
            gridAutoRows: layoutMode === "masonry" ? "masonry" : "auto",
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          transition={{ duration: transitionDuration / 1000 }}
        >
          {renderItems()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DataBricks;
