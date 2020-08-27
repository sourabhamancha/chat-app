import React, { Fragment } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

// graphql
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
    }
  }
`;

function Home({ history }) {
  const dispatch = useAuthDispatch();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/login");
  };

  const { loading, data } = useQuery(GET_USERS);

  const usersMarkup = () => {
    if (!data || loading) {
      return <p>Loading...</p>;
    } else if (data.getUsers.length < 0) {
      return <p>No users</p>;
    } else if (data.getUsers.length > 0) {
      return data.getUsers.map((user) => (
        <div key={user.username}>
          <p>{user.username}</p>
        </div>
      ));
    }
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
        <Col xs={4}>
          <h3>Users</h3>
          {usersMarkup()}
        </Col>
        <Col xs={8}>
          <h3>Messages</h3>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Home;
