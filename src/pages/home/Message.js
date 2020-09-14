import React, { useState } from "react";
import classNames from "classnames";
import moment from "moment";
import { useAuthState } from "../../context/auth";
// bootstrap
import { OverlayTrigger, Tooltip, Button, Popover } from "react-bootstrap";
// graphql
import { gql, useMutation } from "@apollo/client";
const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`;
function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = message.from !== user.username;
  const [showReactions, setShowReactions] = useState(false);
  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => console.log(data),
  });
  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
    setShowReactions(false);
  };
  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showReactions}
      onToggle={setShowReactions}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content>
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="react-icon-button"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );
  return (
    <div
      className={classNames("d-flex my-3", {
        "ml-auto": sent,
        "mr-auto": recieved,
      })}
    >
      {/* {sent && reactButton} */}
      <OverlayTrigger
        placement={
          //   sent ? "right" : "left"
          "bottom"
        }
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
      >
        <div
          className={classNames(
            "mb-2 pt-2 px-3 rounded-pill position-relative",
            {
              "bg-secondary": recieved,
              "bg-primary": sent,
            }
          )}
        >
          {message.reactions.length > 0 && (
            <div
              className={classNames("p-1 rounded-pill", {
                "reactions-div-left": recieved,
                "reactions-div-right": sent,
              })}
            >
              {message.reactions.map((r) => r.content)}
            </div>
          )}
          <p className="text-white" key={message.uuid}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {recieved && reactButton}
    </div>
  );
}

export default Message;
