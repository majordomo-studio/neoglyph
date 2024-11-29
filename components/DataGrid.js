'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { Check, X } from 'lucide-react'; // Import icons

// Helper function to format column headers for display purposes
const formatHeader = (key) => {
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

export default function DataGrid({ data = [], schema = null }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);

  // Define columns dynamically based on schema and data
  const columns = React.useMemo(() => {
    const schemaColumns = schema?.order || Object.keys(data[0] || {});
    const badgeColumns = schema?.badgeColumns || []; // Add badgeColumns to schema
    const centerAlignedColumns = schema?.centerAlignedColumns || []; // Add centerAlignedColumns to schema

    return [
      ...schemaColumns.map((key) => ({
        accessorKey: key, // Use the raw key for accessor
        id: key, // Match id to the raw key
        header: ({ column }) => (
          <div
            className={`${
              centerAlignedColumns.includes(key) ||
              typeof data[0]?.[key] === 'boolean'
                ? 'text-center'
                : ''
            }`}
          >
            {formatHeader(key)}
          </div>
        ),
        cell: ({ row }) => {
          const value = row.getValue(key);

          // Special handling for 'tags' key
          if (key === 'tags' && Array.isArray(value)) {
            return (
              <div className="flex flex-wrap gap-2">
                {value.map((tag, index) => (
                  <Badge key={index} className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            );
          }

          // Handle boolean values with icons and center alignment
          if (typeof value === 'boolean') {
            return (
              <div className="flex justify-center items-center">
                {value ? (
                  <Check className="text-green-500 w-5 h-5" aria-label="True" />
                ) : (
                  <X className="text-red-500 w-5 h-5" aria-label="False" />
                )}
              </div>
            );
          }

          // Wrap values in a Badge if specified in schema.badgeColumns
          if (badgeColumns.includes(key)) {
            return <Badge>{value}</Badge>;
          }

          // Center-align content if specified in schema or for boolean columns
          return (
            <div
              className={`${
                centerAlignedColumns.includes(key) ||
                typeof data[0]?.[key] === 'boolean'
                  ? 'text-center'
                  : ''
              }`}
            >
              {value}
            </div>
          );
        },
      })),
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                aria-label="Open actions menu"
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => console.log('Edit clicked for:', row.original)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log('Delete clicked for:', row.original)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [schema, data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Render toolbar for filtering and search
  const renderToolbar = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={(() => {
              const firstColumnId = table.getAllColumns()?.[0]?.id || ''; // Use the first column if available
              return table.getColumn(firstColumnId)?.getFilterValue() || '';
            })()}
            onChange={(event) => {
              const firstColumnId = table.getAllColumns()?.[0]?.id || '';
              table
                .getColumn(firstColumnId)
                ?.setFilterValue(event.target.value);
            }}
            className="h-8 w-[250px]"
          />
          {schema?.filters?.map((key) => {
            const column = table
              .getAllColumns()
              .find((col) => col.id === key || col.accessorKey === key); // Match against raw key
            if (!column) {
              console.warn(
                `The key "${key}" specified in schema.filters does not match any column.`
              );
              return null; // Skip rendering the filter button for invalid keys
            }
            return (
              <DataTableFacetedFilter
                key={key}
                column={column}
                title={formatHeader(key)}
                options={Array.from(column.getFacetedUniqueValues() || []).map(
                  ([value]) => ({
                    label: String(value),
                    value: String(value),
                  })
                )}
              />
            );
          })}
        </div>
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset Filters
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderToolbar()}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-20 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              className="h-8 w-20 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
