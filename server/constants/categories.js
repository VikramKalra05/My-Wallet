const CATEGORIES = [
  {
    id: 1,
    categoryName: "Transportation",
    subCategories: [
      { id: 11, subCategoryName: "Train" },
      { id: 12, subCategoryName: "Bus" },
      { id: 13, subCategoryName: "Taxi" },
      { id: 14, subCategoryName: "Flight" },
      { id: 15, subCategoryName: "Metro" },
    ],
  },
  {
    id: 2,
    categoryName: "Food & Drinks",
    subCategories: [
      { id: 21, subCategoryName: "Groceries" },
      { id: 22, subCategoryName: "Restaurants & Cafes" },
      { id: 23, subCategoryName: "Bars, Pubs & Clubs" },
    ],
  },
  {
    id: 3,
    categoryName: "Vehicle Expenses",
    subCategories: [
      { id: 31, subCategoryName: "Fuel" },
      { id: 32, subCategoryName: "Parking" },
      { id: 33, subCategoryName: "Maintenance & Repairs" },
      { id: 34, subCategoryName: "Parts & Accessories" },
      { id: 35, subCategoryName: "Fines & Penalties" },
      { id: 36, subCategoryName: "Insurance" },
      { id: 37, subCategoryName: "Rentals & Leasing" },
    ],
  },
  {
    id: 4,
    categoryName: "Housing & Utilities",
    subCategories: [
      { id: 41, subCategoryName: "Loan Repayment" },
      { id: 42, subCategoryName: "Rent" },
      { id: 43, subCategoryName: "Home Repairs & Maintenance" },
      { id: 44, subCategoryName: "Electricity Bill" },
      { id: 45, subCategoryName: "Water & Gas Bills" },
      { id: 46, subCategoryName: "Home Insurance" },
      { id: 47, subCategoryName: "Housekeeping & Services" },
    ],
  },
  {
    id: 5,
    categoryName: "Personal & Wellness",
    subCategories: [
      { id: 51, subCategoryName: "Salon & Beauty" },
      { id: 52, subCategoryName: "Medical & Healthcare" },
      { id: 53, subCategoryName: "Education & Courses" },
      { id: 54, subCategoryName: "Gifts & Celebrations" },
      { id: 55, subCategoryName: "Subscriptions & Memberships" },
      { id: 56, subCategoryName: "Sports & Fitness" },
      { id: 57, subCategoryName: "Travel & Holidays" },
      { id: 58, subCategoryName: "Hobbies & Leisure" },
      { id: 59, subCategoryName: "Phone & Internet Bills" },
    ],
  },
  {
    id: 6,
    categoryName: "Shopping",
    subCategories: [
      { id: 61, subCategoryName: "Jewelry" },
      { id: 62, subCategoryName: "Clothing & Fashion" },
      { id: 63, subCategoryName: "Pharmacy & Medicines" },
      { id: 64, subCategoryName: "Kids & Baby Products" },
      { id: 65, subCategoryName: "Stationery & Office Supplies" },
      { id: 66, subCategoryName: "Pet Supplies" },
      { id: 67, subCategoryName: "Home & Garden" },
      { id: 68, subCategoryName: "Electronics & Gadgets" },
      { id: 69, subCategoryName: "Beauty & Skincare" },
    ],
  },
  {
    id: 7,
    categoryName: "Income & Earnings",
    subCategories: [
      { id: 71, subCategoryName: "Investments & Dividends" },
      { id: 72, subCategoryName: "Salary & Wages" },
      { id: 73, subCategoryName: "Rental Income" },
      { id: 74, subCategoryName: "Business Profits" },
      { id: 75, subCategoryName: "Gifts & Donations" },
      { id: 76, subCategoryName: "Freelance & Side Hustles" },
    ],
  },
  {
    id: 8,
    categoryName: "Financial & Banking",
    subCategories: [
      { id: 81, subCategoryName: "Loans & Borrowings" },
      { id: 82, subCategoryName: "Taxes & Government Fees" },
      { id: 83, subCategoryName: "Bank Fees & Charges" },
      { id: 84, subCategoryName: "EMIs & Installments" },
    ],
  },
  {
    id: 9,
    categoryName: "Entertainment & Recreation",
    subCategories: [
      { id: 91, subCategoryName: "Movies & Streaming" },
      { id: 92, subCategoryName: "Concerts & Events" },
      { id: 93, subCategoryName: "Gaming" },
      { id: 94, subCategoryName: "Books & Magazines" },
    ],
  },
  {
    id: 10,
    categoryName: "Miscellaneous",
    subCategories: [
      { id: 101, subCategoryName: "Uncategorized" },
      { id: 102, subCategoryName: "Unexpected Expenses" },
    ],
  },
];

module.exports = CATEGORIES;
