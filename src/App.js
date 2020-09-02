import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";

// bootstrap
import { Container } from "react-bootstrap";

// components
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import ProtectedRoute from "./util/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <Container>
            <Switch>
              <ProtectedRoute exact path="/" component={Home} authenticated />
              <ProtectedRoute
                exact
                path="/register"
                component={Register}
                guest
              />
              <ProtectedRoute exact path="/login" component={Login} guest />
            </Switch>
          </Container>
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
