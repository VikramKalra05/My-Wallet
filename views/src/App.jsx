// import './App.css';
import Navbar from './components/Navbar';
import AllRoutes from './routes/AllRoutes';
import PrivateRoutes from './routes/PrivateRoutes';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main">
        <AllRoutes /> 
      </div>
    </div>
  );
}

export default App;
