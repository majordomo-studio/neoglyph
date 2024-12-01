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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';

import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
} from 'lucide-react'; // Import icons

import { Switch } from '@/components/ui/switch'; // Import ShadCN Switch
import { Calendar } from '@/components/ui/calendar'; // Import ShadCN Calendar for date editing
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; // ShadCN Popover for date picker
import { format } from 'date-fns'; // Import date-fns for formatting dates
import { cn } from '@/lib/utils'; // Utility class names

// Helper function to format column headers for display purposes
const formatHeader = (key) => {
  if (key.length === 2) {
    // Capitalize both letters for two-letter keys
    return key.toUpperCase();
  }
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to title case
};

export default function DataGrid({ data = [], schema = null }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState(''); // New state for global filter
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false); // For delete confirmation
  const [rowToDelete, setRowToDelete] = React.useState(null); // Row selected for deletion
  const [isEditing, setIsEditing] = React.useState(false); // Tracks edit mode
  const [editingRow, setEditingRow] = React.useState(null); // Tracks the row being edited
  const [editingData, setEditingData] = React.useState(data); // Syncs editingData with the incoming data

  // Sync editingData with the latest data when it changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditingData(data);
    }
  }, [data, isEditing]);

  // Initialize sorting based on schema's defaultSorting
  const [sorting, setSorting] = React.useState(() => {
    const defaultSorting = schema?.defaultSorting || [];
    return defaultSorting.map(({ key, desc }) => ({
      id: key, // Map `key` to `id` for React Table
      desc: desc || false,
    }));
  });

  // Enter edit mode for a specific row
  const handleEditClick = (row) => {
    setIsEditing(true);
    setEditingRow(row.original.id); // Use a unique identifier
  };

  // Cancel edit mode
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingRow(null);
    setEditingData(data); // Reset to original data
  };

  // Save changes made in edit mode
  const handleSaveClick = () => {
    console.log('Saving updated data:', editingData);
    setIsEditing(false);
    setEditingRow(null);
  };

  // Update cell value while editing
  const updateCellValue = (rowId, columnId, value) => {
    setEditingData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    );
  };

  // Define columns dynamically based on schema and data
  const columns = React.useMemo(() => {
    const schemaColumns = schema?.order || Object.keys(data[0] || {});
    const badgeColumns = schema?.badgeColumns || []; // Add badgeColumns to schema
    const centerAlignedColumns = schema?.centerAlignedColumns || []; // Add centerAlignedColumns to schema
    const sortableColumns = schema?.sortableColumns || [
      'title',
      'description',
      'category',
    ]; // Add sortableColumns to schema
    const editableColumns =
      schema?.editableColumns || schemaColumns.filter((col) => col !== 'id'); // Defaults to all except `id`

    return [
      ...schemaColumns.map((key) => ({
        accessorKey: key,
        id: key, // Ensure every column has an id
        header: ({ column }) => {
          const columnId = column.id; // Ensure we are using the correct identifier
          const isCenterAligned =
            centerAlignedColumns.includes(columnId) ||
            typeof data[0]?.[columnId] === 'boolean'; // Center align if in schema or if the column is boolean

          return (
            <div className={`${isCenterAligned ? 'text-center' : ''}`}>
              {sortableColumns.includes(columnId) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 data-[state=open]:bg-accent"
                  onClick={() => {
                    const currentSort = column.getIsSorted();
                    column.toggleSorting(
                      currentSort === 'asc'
                        ? true
                        : currentSort === 'desc'
                          ? false
                          : undefined
                    );
                  }}
                >
                  <span>{formatHeader(columnId)}</span>
                  {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </Button>
              ) : (
                <span>{formatHeader(columnId)}</span>
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const value = row.getValue(key);

          if (isEditing && row.original.id === editingRow) {
            if (editableColumns.includes(key)) {
              if (typeof value === 'boolean') {
                return (
                  <Switch
                    checked={
                      editingData.find((r) => r.id === row.original.id)[key]
                    }
                    onCheckedChange={(checked) =>
                      updateCellValue(row.original.id, key, checked)
                    }
                  />
                );
              }
              if (key.toLowerCase().includes('date') || key.endsWith('_at')) {
                const dateValue = new Date(
                  editingData.find((r) => r.id === row.original.id)[key]
                );

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-left font-normal"
                      >
                        {isNaN(dateValue.getTime())
                          ? 'Pick a date'
                          : format(dateValue, 'MM/dd/yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          isNaN(dateValue.getTime()) ? undefined : dateValue
                        }
                        onSelect={(date) =>
                          updateCellValue(
                            row.original.id,
                            key,
                            date.toISOString()
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                );
              }
              return (
                <Input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  value={editingData.find((r) => r.id === row.original.id)[key]}
                  onChange={(e) =>
                    updateCellValue(
                      row.original.id,
                      key,
                      typeof value === 'number'
                        ? parseFloat(e.target.value) || 0
                        : e.target.value
                    )
                  }
                />
              );
            }
          }
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

          if (typeof value === 'boolean') {
            return (
              <div className="flex justify-center items-center">
                <Switch checked={value} disabled />
              </div>
            );
          }

          if (badgeColumns.includes(key)) {
            return <Badge>{value}</Badge>;
          }

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
          <div>
            {schema?.showActions !== false && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    aria-label="Open actions menu"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => handleEditClick(row)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setRowToDelete(row.original);
                      setAlertDialogOpen(true); // Open the alert dialog
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ),
      },
    ];
  }, [schema, data, isEditing, editingRow, editingData]);

  const table = useReactTable({
    data: isEditing ? editingData : data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter, // Add globalFilter state
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter, // Update global filter
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row, index) => row?.id || row?.key || `row-${index}`, // Ensure unique row IDs
  });

  const renderToolbar = () => {
    if (schema?.showToolbar === false) return null; // Conditionally render toolbar
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="success"
                className="h-8 px-2"
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Button
                variant="destructive"
                className="h-8 px-2"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Search..."
                value={globalFilter || ''}
                onChange={(event) => setGlobalFilter(event.target.value)} // Update to use globalFilter
                className="h-8 w-[250px]"
              />
              {schema?.filters?.map((key) => {
                const column = table
                  .getAllColumns()
                  .find((col) => col.id === key || col.accessorKey === key);
                if (!column) {
                  console.warn(
                    `The key "${key}" specified in schema.filters does not match any column.`
                  );
                  return null;
                }
                return (
                  <DataTableFacetedFilter
                    key={key}
                    column={column}
                    title={formatHeader(key)}
                    options={Array.from(
                      column.getFacetedUniqueValues() || []
                    ).map(([value]) => ({
                      label: String(value),
                      value: String(value),
                    }))}
                  />
                );
              })}
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex h-8">
                  <Settings2 />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {formatHeader(column.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async () => {
    setAlertDialogOpen(false);
    console.log('Deleting row:', rowToDelete);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    const updatedData = data.filter((item) => item.id !== rowToDelete.id);
    // Update the DataGrid data
    console.log('Updated data:', updatedData);
    setRowToDelete(null); // Clear the row to delete
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
      {schema?.showFooter !== false && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {schema?.selectedRowCount !== false && (
              <div>
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
