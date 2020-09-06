import React from "react";
import classNames from "classnames";
import moment from "moment";
import { useAuthState } from "../../context/auth";
// bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";
function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;
  return (
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
        className={classNames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": recieved,
        })}
      >
        <div
          className={classNames("pt-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": recieved,
          })}
        >
          <p className="text-white" key={message.uuid}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default Message;
