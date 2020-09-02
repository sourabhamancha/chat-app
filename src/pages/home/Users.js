import React from "react";
// graphql
import { gql, useQuery } from "@apollo/client";
// bootstrap
import { Col, Image } from "react-bootstrap";

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

function Users({ setSelectedUser }) {
  const { loading, data } = useQuery(GET_USERS);

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
    <Col xs={4} className="p-0 bg-primary">
      {usersMarkup()}
    </Col>
  );
}

export default Users;
