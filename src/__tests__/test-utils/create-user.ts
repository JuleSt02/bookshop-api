import request from "supertest";
import { app } from "../../api";

export const CREDENTIALS = {
  email: "test-user@domain.com",
  password: "RandomPassword123*",
};

// Creates a user through the API
// Throws error if registration fails to stop the rest of the test
export async function createUser(
  overrides: {
    email?: string;
    password?: string;
  } = {},
) {
  const response = await request(app)
    .post("/authentication/signup")
    .send({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      ...overrides,
    });

  if (response.status !== 201) {
    throw new Error(
      `createUser failed with status ${response.status}: ${JSON.stringify(
        response.body,
      )}`,
    );
  }

  return response;
}

// signs  in through  API and returns the JWT access token.
export async function loginUser(
  overrides: {
    email?: string;
    password?: string;
  } = {},
) {
  const response = await request(app)
    .post("/authentication/signin")
    .send({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      ...overrides,
    });

  if (response.status !== 200) {
    throw new Error(
      `signinUser failed with status ${response.status}: ${JSON.stringify(
        response.body,
      )}`,
    );
  }

  return response.body.accessToken;
}
