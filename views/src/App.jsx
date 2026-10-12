import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";
import { useLocation } from "react-router-dom";

const NO_NAV_PATHS = ["/login", "/register"];

function App() {
  const { pathname } = useLocation();
  const hideNav = NO_NAV_PATHS.includes(pathname);

  return (
    <div>
      <Navbar />
      <div className={hideNav ? "app-main app-main--nonav" : "app-main"}>
        <AllRoutes />
      </div>
    </div>
  );
}

export default App;
