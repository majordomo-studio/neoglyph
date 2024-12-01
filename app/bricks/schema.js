const schema = {
  // Specify keys to display in default view and their order
  order: ['size', 'color', 'price', 'rating', 'stock'],
  // Specify which keys are sortable
  sortable: ['title', 'category', 'price'],
  // Specify which keys can be filtered in the toolbar
  filters: ['category', 'size'],
};

export default schema;
