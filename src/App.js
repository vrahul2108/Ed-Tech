import { Route, Router } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"; 

function App() {
  return (
    <Router>
      <Route path="\" element = {<Home/>} />
    </Router>
  );
}

export default App;
