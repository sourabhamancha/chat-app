import React from "react";
import "./App.scss";

// bootstrap
import { Container } from "react-bootstrap";

// components
import Register from "./pages/Register";

function App() {
  return (
    <Container>
      <Register />
    </Container>
  );
}

export default App;
