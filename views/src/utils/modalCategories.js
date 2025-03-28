import { FaCar, FaUtensils, FaTools, FaHome, FaShoppingCart, FaMoneyBillWave, FaPiggyBank, FaFilm, FaHeartbeat } from "react-icons/fa";
// import { MdOutlineMiscellaneous } from "react-icons/md";

const categoriesData = [
  {
    id: 1,
    name: "Transportation",
    icon: <FaCar style={{ color: "#FF5733" }} />,
    subCategories: [
      { id: 11, name: "Train", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 12, name: "Bus", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 13, name: "Taxi", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 14, name: "Flight", icon: <FaCar style={{ color: "#FF5733" }} /> },
      { id: 15, name: "Metro", icon: <FaCar style={{ color: "#FF5733" }} /> },
    ],
  },
  {
    id: 2,
    name: "Food & Drinks",
    icon: <FaUtensils style={{ color: "#FFB900" }} />,
    subCategories: [
      { id: 21, name: "Groceries", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
      { id: 22, name: "Restaurants & Cafes", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
      { id: 23, name: "Bars, Pubs & Clubs", icon: <FaUtensils style={{ color: "#FFB900" }} /> },
    ],
  },
  {
    id: 3,
    name: "Vehicle Expenses",
    icon: <FaTools style={{ color: "#A83279" }} />,
    subCategories: [
      { id: 31, name: "Fuel", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 32, name: "Parking", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 33, name: "Maintenance & Repairs", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 34, name: "Parts & Accessories", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 35, name: "Fines & Penalties", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 36, name: "Insurance", icon: <FaTools style={{ color: "#A83279" }} /> },
      { id: 37, name: "Rentals & Leasing", icon: <FaTools style={{ color: "#A83279" }} /> },
    ],
  },
  {
    id: 4,
    name: "Housing & Utilities",
    icon: <FaHome style={{ color: "#0074D9" }} />,
    subCategories: [
      { id: 41, name: "Loan Repayment", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 42, name: "Rent", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 43, name: "Home Repairs & Maintenance", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 44, name: "Electricity Bill", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 45, name: "Water & Gas Bills", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 46, name: "Home Insurance", icon: <FaHome style={{ color: "#0074D9" }} /> },
      { id: 47, name: "Housekeeping & Services", icon: <FaHome style={{ color: "#0074D9" }} /> },
    ],
  },
  {
    id: 5,
    name: "Personal & Wellness",
    icon: <FaHeartbeat style={{ color: "#FF69B4" }} />,
    subCategories: [
      { id: 51, name: "Salon & Beauty", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 52, name: "Medical & Healthcare", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 53, name: "Education & Courses", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 54, name: "Gifts & Celebrations", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 55, name: "Subscriptions & Memberships", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 56, name: "Sports & Fitness", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 57, name: "Travel & Holidays", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 58, name: "Hobbies & Leisure", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
      { id: 59, name: "Phone & Internet Bills", icon: <FaHeartbeat style={{ color: "#FF69B4" }} /> },
    ],
  },
  {
    id: 6,
    name: "Shopping",
    icon: <FaShoppingCart style={{ color: "#0074D9" }} />,
    subCategories: [
      { id: 61, name: "Jewelry", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 62, name: "Clothing & Fashion", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 63, name: "Pharmacy & Medicines", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 64, name: "Kids & Baby Products", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 65, name: "Stationery & Office Supplies", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 66, name: "Pet Supplies", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 67, name: "Home & Garden", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 68, name: "Electronics & Gadgets", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
      { id: 69, name: "Beauty & Skincare", icon: <FaShoppingCart style={{ color: "#0074D9" }} /> },
    ],
  },
  {
    id: 7,
    name: "Income & Earnings",
    icon: <FaMoneyBillWave style={{ color: "#28A745" }} />,
    subCategories: [
      { id: 71, name: "Investments & Dividends", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
      { id: 72, name: "Salary & Wages", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
      { id: 73, name: "Rental Income", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
      { id: 74, name: "Business Profits", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
      { id: 75, name: "Gifts & Donations", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
      { id: 76, name: "Freelance & Side Hustles", icon: <FaMoneyBillWave style={{ color: "#28A745" }} /> },
    ],
  },
  {
    id: 8,
    name: "Financial & Banking",
    icon: <FaPiggyBank style={{ color: "#6F42C1" }} />,
    subCategories: [
      { id: 81, name: "Loans & Borrowings", icon: <FaPiggyBank style={{ color: "#6F42C1" }} /> },
      { id: 82, name: "Taxes & Government Fees", icon: <FaPiggyBank style={{ color: "#6F42C1" }} /> },
      { id: 83, name: "Bank Fees & Charges", icon: <FaPiggyBank style={{ color: "#6F42C1" }} /> },
      { id: 84, name: "EMIs & Installments", icon: <FaPiggyBank style={{ color: "#6F42C1" }} /> },
    ],
  },
  {
    id: 9,
    name: "Entertainment & Recreation",
    icon: <FaFilm style={{ color: "#FF851B" }} />,
    subCategories: [
      { id: 91, name: "Movies & Streaming", icon: <FaFilm style={{ color: "#FF851B" }} /> },
      { id: 92, name: "Concerts & Events", icon: <FaFilm style={{ color: "#FF851B" }} /> },
      { id: 93, name: "Gaming", icon: <FaFilm style={{ color: "#FF851B" }} /> },
      { id: 94, name: "Books & Magazines", icon: <FaFilm style={{ color: "#FF851B" }} /> },
    ],
  },
  {
    id: 10,
    name: "Miscellaneous",
    icon: <FaTools style={{ color: "#999999" }} />,
    subCategories: [
      { id: 101, name: "Uncategorized", icon: <FaTools style={{ color: "#999999" }} /> },
      { id: 102, name: "Unexpected Expenses", icon: <FaTools style={{ color: "#999999" }} /> },
    ],
  }
];

export default categoriesData;

  