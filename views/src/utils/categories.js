 const FILTERS = [  
  {
    id: 1,
    categoryName: "Record Type",
    subCategories: [
      { id: 11, name: "All Records" },
      { id: 12, name: "Income" },
      { id: 13, name: "Expense" },
      { id: 14, name: "Transfer" },
    ],
  },
  {
    id: 2,
    categoryName: "Payment Type",
    subCategories: [
      { id: 21, name: "All Payment Types" },
      { id: 22, name: "Cash" },
      { id: 24, name: "Debit Card" },
      { id: 25, name: "Credit Card" },
      { id: 26, name: "Transfer" },
      { id: 27, name: "Voucher" },
      { id: 28, name: "UPI" },
    ],
  },
  {
    id: 3,
    categoryName: "Payment Status",
    subCategories: [
      { id: 31, name: "All" },
      { id: 32, name: "Cleared" },
      { id: 33, name: "Pending" }
    ],
  },

];
 export default FILTERS

