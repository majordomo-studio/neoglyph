const schema = {
  // Specify keys to display in default view and their order
  order: ['size', 'color', 'price', 'rating', 'stock'],
  // Specify which column (key) to sort by default
  // defaultSorting: [{ key: 'category', desc: false }],
  // Specify which keys are sortable
  sortable: ['title', 'category', 'price'],
  // Specify which keys can be filtered in the toolbar
  filters: ['category', 'size'],
  // Specify which columns (keys) will display values in a badge component
  badges: ['price', 'shipping_cost'],
};

export default schema;
