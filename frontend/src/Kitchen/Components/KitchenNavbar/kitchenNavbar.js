import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const KitchenNavBar = () => {
  const navigate = useNavigate();
  const goToStocks = () => {
    navigate("/kitchenStocks");
  };
  const goToOrders = () => {
    navigate("/kitchenPage");
  };
  const goToAdmin = () => {
    navigate("/stocks");
  }; const goToServer = () => {
    navigate("/server");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand>
        <i class="fa-solid fa-kitchen-set"></i> Kitchen Page
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Button variant="outline-light" className="mr-2" onClick={goToStocks}>
            Stocks
          </Button>
          <Button variant="outline-light" onClick={goToOrders}>
            Orders
          </Button>
          <Button variant="outline-light" onClick={goToAdmin}>
            Admin
          </Button>
          <Button variant="outline-light" onClick={goToServer}>
            Server
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default KitchenNavBar;