import React from "react";
import classNames from "classnames";
import { useMessageDispatch, useMessageState } from "../../context/message";
import { useAuthDispatch } from "../../context/auth";
// graphql
import { gql, useQuery } from "@apollo/client";
// bootstrap
import { Col, Image, Button } from "react-bootstrap";

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

function Users() {
  const authDispatch = useAuthDispatch();
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (result) =>
      dispatch({
        type: "SET_USERS",
        payload: result.getUsers,
      }),
    onError: (err) => console.log(err),
  });
  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading...</p>;
  } else if (users.length < 0) {
    usersMarkup = <p>No users</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames(
            "user-div d-flex justify-content-center justify-content-md-start p-3",
            {
              "bg-secondary": selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            // roundedCircle
            className="user-image"
            // style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <div className="d-none d-md-block text-light ml-2">
            <p className="m-0">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }

  const handleLogout = () => {
    authDispatch({
      type: "LOGOUT",
    });
    // history.push("/login");
    window.location.href = "/login";
  };

  return (
    <Col xs={2} md={4} className="p-0 bg-primary">
      <div className="d-flex justify-content-center">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      {usersMarkup}
    </Col>
  );
}

export default Users;
