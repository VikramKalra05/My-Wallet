// import './App.css';

import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{paddingTop:"60px"}}><AllRoutes /></div>
      
    </ div>
  );
}

export default App;
