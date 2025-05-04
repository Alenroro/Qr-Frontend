import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./Routes/appRoutes";
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
