import React, { useEffect, Fragment, useState } from "react";
import { useMessageDispatch, useMessageState } from "../../context/message";
// graphql
import { gql, useLazyQuery, useMutation } from "@apollo/client";
// bootstrap
import { Col, Form } from "react-bootstrap";
// components
import Message from "./Message";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
      reactions {
        uuid
        content
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(input: { to: $to, content: $content }) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;
function Messages() {
  const [content, setContent] = useState("");
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    // onCompleted: (data) =>
    //   dispatch({
    //     type: "ADD_MESSAGE",
    //     payload: {
    //       username: selectedUser.username,
    //       message: data.sendMessage,
    //     },
    //   }),
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    sendMessage({
      variables: {
        to: selectedUser.username,
        content,
      },
    });
    setContent("");
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text my-auto">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text my-auto">Loading...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === message.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className="info-text my-auto">Send your first message</p>
    );
  }
  return (
    <Col xs={10} md={8} className="messages-container">
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="rounded-pill"
              placeholder="Type your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              className="fas fa-paper-plane fa-2x text-primary ml-1"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}

export default Messages;
