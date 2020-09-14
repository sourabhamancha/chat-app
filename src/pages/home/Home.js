import React, { Fragment, useEffect } from "react";
import { Row } from "react-bootstrap";
import { useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import { gql, useSubscription } from "@apollo/client";
// components
import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

function Home({ history }) {
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);

  return (
    <Fragment>
      {/* <Row className="justify-content-around">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={handleLogout}>
          Logout
        </Button>
      </Row> */}
      <Row className="mt-2 border rounded">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}

export default Home;
