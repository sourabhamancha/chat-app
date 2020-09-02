import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";

// graphql
import { gql, useLazyQuery } from "@apollo/client";

// components
import Users from "./Users";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

function Home({ history }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useAuthDispatch();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/login");
  };

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

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
        <Users setSelectedUser={setSelectedUser} />
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <h3>Messages</h3>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}

export default Home;
