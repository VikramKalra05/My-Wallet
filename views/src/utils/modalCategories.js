import { FaCar, FaUtensils, FaTools, FaHome, FaShoppingCart, FaMoneyBillWave, FaPiggyBank, FaFilm, FaHeartbeat } from "react-icons/fa";
// import { MdOutlineMiscellaneous } from "react-icons/md";

const categoriesData = [
  {
    id: 21,
    name: "Transportation",
    icon: <FaCar style={{ color: "#FF5733" }} />, // Orange-Red
    subCategories: [
      { id: 211, name: "Train", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 212, name: "Bus", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 213, name: "Taxi", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 214, name: "Flight", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 215, name: "Metro", icon: <FaCar style={{ color: "#FF5733" }} /> },
    ],
  },
  {
    id: 22,
    name: "Food & Drinks",
    icon: <FaUtensils style={{ color: "#FFB900" }} />, // Yellow
    subCategories: [
      { id: 221, name: "Groceries", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
      { id: 222, name: "Restaurants & Cafes", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
      { id: 223, name: "Bars, Pubs & Clubs", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
    ],
  },
  {
    id: 23,
    name: "Vehicle Expenses",
    icon: <FaTools style={{ color: "#A83279" }} />, // Purple-Pink
    subCategories: [
      { id: 231, name: "Fuel", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 232, name: "Parking", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 233, name: "Maintenance & Repairs", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 234, name: "Parts & Accessories", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 235, name: "Fines & Penalties", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 236, name: "Insurance", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 237, name: "Rentals & Leasing", icon: <FaTools style={{ color: "#A83279" }} /> },
    ],
  },
  {
    id: 24,
    name: "Housing & Utilities",
    icon: <FaHome style={{ color: "#008DDA" }} />, // Blue
    subCategories: [
      { id: 241, name: "Loan Repayment", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 242, name: "Rent", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 243, name: "Home Repairs & Maintenance", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 244, name: "Electricity Bill", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 245, name: "Water & Gas Bills", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 246, name: "Home Insurance", icon: <FaHome style={{ color: "#008DDA" }} /> },
      { id: 247, name: "Housekeeping & Services", icon: <FaHome style={{ color: "#008DDA" }} /> },
    ],
  },
  {
    id: 25,
    name: "Personal & Wellness",
    icon: <FaHeartbeat style={{ color: "#FF3366" }} />, // Red-Pink
    subCategories: [
      { id: 251, name: "Salon & Beauty", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 252, name: "Medical & Healthcare", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 253, name: "Education & Courses", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 254, name: "Gifts & Celebrations", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 255, name: "Subscriptions & Memberships", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 256, name: "Sports & Fitness", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 257, name: "Travel & Holidays", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 258, name: "Hobbies & Leisure", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
      { id: 259, name: "Phone & Internet Bills", icon: <FaHeartbeat style={{ color: "#FF3366" }} /> },
    ],
  },
  {
    id: 26,
    name: "Shopping",
    icon: <FaShoppingCart style={{ color: "#4CAF50" }} />, // Green
    subCategories: [
      { id: 261, name: "Jewelry", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 262, name: "Clothing & Fashion", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 263, name: "Pharmacy & Medicines", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 264, name: "Kids & Baby Products", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 265, name: "Stationery & Office Supplies", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 266, name: "Pet Supplies", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 267, name: "Home & Garden", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 268, name: "Electronics & Gadgets", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
      { id: 269, name: "Beauty & Skincare", icon: <FaShoppingCart style={{ color: "#4CAF50" }} /> },
    ],
  },
  {
    id: 27,
    name: "Income & Earnings",
    icon: <FaMoneyBillWave style={{ color: "#FFD700" }} />, // Gold
    subCategories: [
      { id: 271, name: "Investments & Dividends", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
      { id: 272, name: "Salary & Wages", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
      { id: 273, name: "Rental Income", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
      { id: 274, name: "Business Profits", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
      { id: 275, name: "Gifts & Donations", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
      { id: 276, name: "Freelance & Side Hustle", icon: <FaMoneyBillWave style={{ color: "#FFD700" }} /> },
    ],
  },
  {
    id: 28,
    name: "Financial & Banking",
    icon: <FaPiggyBank style={{ color: "#9C27B0" }} />, // Purple
    subCategories: [
      { id: 281, name: "Loans & Borrowings", icon: <FaPiggyBank style={{ color: "#9C27B0" }} /> },
      { id: 282, name: "Taxes & Government Fees", icon: <FaPiggyBank style={{ color: "#9C27B0" }} /> },
      { id: 283, name: "Bank Fees & Charges", icon: <FaPiggyBank style={{ color: "#9C27B0" }} /> },
      { id: 284, name: "EMIs & Installments", icon: <FaPiggyBank style={{ color: "#9C27B0" }} /> },
    ],
  },
  {
    id: 29,
    name: "Entertainment & Recreation",
    icon: <FaFilm style={{ color: "#FF9800" }} />, // Orange
    subCategories: [
      { id: 291, name: "Movies & Streaming", icon: <FaFilm style={{ color: "#FF9800" }} /> },
      { id: 292, name: "Concerts & Events", icon: <FaFilm style={{ color: "#FF9800" }} /> },
      { id: 293, name: "Gaming", icon: <FaFilm style={{ color: "#FF9800" }} /> },
      { id: 294, name: "Books & Magazines", icon: <FaFilm style={{ color: "#FF9800" }} /> },
    ],
  },
  {
    id: 30,
    name: "Miscellaneous",
    // icon: <MdOutlineMiscellaneous style={{ color: "#607D8B" }} />, // Gray
    subCategories: [
      { id: 301, name: "Uncategorized"},
      { id: 302, name: "Unexpected Expenses"},
    ],
  },
];

export default categoriesData;

  