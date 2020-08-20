import React, { useState } from "react";

// bootstrap
import { Row, Col, Form, Button } from "react-bootstrap";

// graphql
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $imageUrl: String!
  ) {
    registerUser(
      input: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        imageUrl: $imageUrl
      }
    ) {
      username
      email
      token
    }
  }
`;

function Register(prop) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      // console.log(res);
      prop.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
      console.log(errors);
    },
  });

  const handleChange = (e) => {
    setVariables({
      ...variables,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    variables.imageUrl = "";
    registerUser({ variables });
    setVariables({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <Row className="py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className={errors.username && "text-danger"}>
                {errors.username ?? "Username"}
              </Form.Label>
              <Form.Control
                name="username"
                type="text"
                value={variables.username}
                onChange={handleChange}
                className={errors.username && "is-invalid"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.email && "text-danger"}>
                {errors.email ?? "Email address"}
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={variables.email}
                onChange={handleChange}
                className={errors.email && "is-invalid"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.password && "text-danger"}>
                {errors.password ?? "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={variables.password}
                onChange={handleChange}
                className={errors.password && "is-invalid"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.confirmPassword && "text-danger"}>
                {errors.confirmPassword ?? "Confirm Password"}
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={variables.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword && "is-invalid"}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Loading" : "Register"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
