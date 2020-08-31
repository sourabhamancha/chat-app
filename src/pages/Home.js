import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

// graphql
import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

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

  const { loading, data } = useQuery(GET_USERS);
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData);

  const usersMarkup = () => {
    if (!data || loading) {
      return <p>Loading...</p>;
    } else if (data.getUsers.length < 0) {
      return <p>No users</p>;
    } else if (data.getUsers.length > 0) {
      return data.getUsers.map((user) => (
        <div
          className="d-flex p-3"
          key={user.username}
          onClick={() => setSelectedUser(user.username)}
        >
          <Image
            src={user.imageUrl}
            roundedCircle
            className="mr-2"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <div className="text-light">
            <p className="m-0">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
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
        <Col xs={4} className="p-0 bg-primary">
          {usersMarkup()}
        </Col>
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
