const schema = {
  // Toggle toolbar (true or false)
  showToolbar: true,
  // Toggle actions column (true or false)
  showActions: true,
  // Toggle footer (true or false)
  showFooter: true,
  // Toggle selected row count (true or false)
  selectedRowCount: false,
  // Specify columns (keys) to display and their order
  // order: ['size', 'color', 'price', 'rating', 'stock'],
  // Specify which column (key) to sort by default
  // defaultSorting: [{ key: 'category', desc: false }],
  // Specify which columns (keys) are sortable
  sortableColumns: ['title', 'category', 'price'],
  // Specify which columns (keys) can be filtered in the toolbar
  filters: ['category', 'size'],
  // Specify which columns (keys) will display values in a badge component
  badgeColumns: ['price', 'shipping_cost'],
  // Specify which columns (keys) are allowed to have their values edited
  // editableColumns: ['price', 'size', 'is_featured'],
  // Specify which columns (keys) have a select component when editing
  editableColumnsSelect: ['size'],
  // Specify which columns (keys) should be center aligned
  centerAlignedColumns: [
    'category',
    'size',
    'color',
    'rating',
    'stock',
    'created_at',
    'updated_at',
    'popularity',
  ],
};

export default schema;
