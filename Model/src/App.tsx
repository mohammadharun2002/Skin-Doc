import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import AboutUs from "./about_us";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
