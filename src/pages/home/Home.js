import React, { Fragment } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";

// components
import Users from "./Users";
import Messages from "./Messages";

function Home({ history }) {
  const dispatch = useAuthDispatch();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/login");
  };

  return (
    <Fragment>
      <Row className="justify-content-around">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={handleLogout}>
          Logout
        </Button>
      </Row>
      <Row>
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}

export default Home;
