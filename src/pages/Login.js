import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
// bootstrap
import { Row, Col, Form, Button } from "react-bootstrap";

// graphql
import { gql, useMutation } from "@apollo/client";

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      username
      email
      token
    }
  }
`;

function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      dispatch({
        type: "LOGIN",
        payload: result.data.login,
      });
      window.location.href = "/";
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
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
    login({ variables });
    // setVariables({
    //   username: "",
    //   password: "",
    // });
  };

  return (
    <div>
      <Row className="py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Login</h1>
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
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Loading" : "Login"}
              </Button>
              <br />
              <small>
                Don't have an account? <Link to="/register">Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
