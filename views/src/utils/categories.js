export const CATEGORIES = [
  {
    id: 1,
    categoryName: "ACCOUNTS",
    subCategories: [
      { id: 11, name: "All Accounts" },
      { id: 12, name: "Cash" },
      { id: 13, name: "Bank" },
    ],
  },
  {
    id: 2,
    categoryName: "CATEGORIES",
    subCategories: [
      { id: 21, name: "Transportation",
        subCategories:[
          {id:211,name:"Train"},
          {id:212,name:"Bus"},
          {id:213,name:"Taxi"},
          {id:214,name:"Flight"},
          {id:215,name:"Metro"}
        ]
       },
      { id: 22, name: "Food & Drinks",
        subCategories:[
          {id:221,name:"Groceries"},
          {id:222,name:"Restaurants & Cafes"},
          {id:223,name:"Bars, Pubs & Clubs"}
        ]
       },
      { id: 23, name: "Vehicle Expenses",
        subCategories:[
          {id:231,name:"Fuel"},
          {id:232,name:"Parking"},
          {id:233,name:"Maintenance & Repairs"},
          {id:234,name:"Parts & Accessories"},
          {id:235,name:"Fines & Penalties"},
          {id:236,name:"Insurance"},
          {id:237,name:"Rentals & Leasing"}

        ]
       },
      { id: 24, name: "Housing & Utilities",
        subCategories: [
          { id: 241, name: "Loan Repayment" },
          { id: 242, name: "Rent" },
          { id: 243, name: "Home Repairs & Maintenance" },
          { id: 244, name: "Electricity Bill" },
          { id: 245, name: "Water & Gas Bills" },
          { id: 246, name: "Home Insurance" },
          { id: 247, name: "Housekeeping & Services" }
        ] 
       },
      { id: 25, name: "Personal & Wellness",
        subCategories: [
          { id: 251, name: "Salon & Beauty" },
          { id: 252, name: "Medical & Healthcare" },
          { id: 253, name: "Education & Courses" },
          { id: 254, name: "Gifts & Celebrations" },
          { id: 255, name: "Subscriptions & Memberships" },
          { id: 256, name: "Sports & Fitness" },
          { id: 257, name: "Travel & Holidays" },
          { id: 258, name: "Hobbies & Leisure" },
          { id: 259, name: "Phone & Internet Bills" }
        ] 
       },
      { id: 26, name: "Shopping",
        subCategories: [
          { id: 261, name: "Jewelry" },
          { id: 262, name: "Clothing & Fashion" },
          { id: 263, name: "Pharmacy & Medicines" },
          { id: 264, name: "Kids & Baby Products" },
          { id: 265, name: "Stationery & Office Supplies" },
          { id: 266, name: "Pet Supplies" },
          { id: 267, name: "Home & Garden" },
          { id: 268, name: "Electronics & Gadgets" },
          { id: 269, name: "Beauty & Skincare" }
        ] 
       },
      { id: 27, name: "Income & Earnings",
        subCategories: [
          { id: 271, name: "Investments & Dividends" },
          { id: 272, name: "Salary & Wages" },
          { id: 273, name: "Rental Income" },
          { id: 274, name: "Business Profits" },
          { id: 275, name: "Gifts & Donations" },
          { id: 276, name: "Freelance & Side Hustles" }
        ] 
       },
      { id: 28, name: "Financial & Banking",
        subCategories: [
          { id: 281, name: "Loans & Borrowings" },
          { id: 282, name: "Taxes & Government Fees" },
          { id: 283, name: "Bank Fees & Charges" },
          { id: 284, name: "EMIs & Installments" }
        ] 
       },
      { id: 29, name: "Entertainment & Recreation",
        subCategories: [
          { id: 291, name: "Movies & Streaming" },
          { id: 292, name: "Concerts & Events" },
          { id: 293, name: "Gaming" },
          { id: 294, name: "Books & Magazines" }
        ] 
       },
      { id: 30, name: "Miscellaneous",
        subCategories: [
          { id: 301, name: "Uncategorized" },
          { id: 302, name: "Unexpected Expenses" }
        ] 
       },
    ],
  },
  {
    id: 3,
    categoryName: "CURRENCY",
    subCategories: [
      { id: 31, name: "INR" },
      { id: 32, name: "USD" },
    ],
  },
  {
    id: 4,
    categoryName: "RECORD TYPE",
    subCategories: [
      { id: 41, name: "Income" },
      { id: 42, name: "Expense" },
      { id: 43, name: "Transfer" },
    ],
  },
  {
    id: 5,
    categoryName: "PAYMENT TYPE",
    subCategories: [
      { id: 51, name: "All Payment Types" },
      { id: 52, name: "Cash" },
      { id: 54, name: "Debit Card" },
      { id: 55, name: "Credit Card" },
      { id: 56, name: "Transfer" },
      { id: 57, name: "Voucher" },
      { id: 58, name: "UPI" },
    ],
  },
  {
    id: 6,
    categoryName: "PAYMENT STATUS",
    subCategories: [
      { id: 61, name: "Cleared" },
      { id: 62, name: "Pending" }
    ],
  },
];
