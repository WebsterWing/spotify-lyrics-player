import { useEffect } from "react";

import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

// URL for logging in to spotify API. Parameters docuemted here:
// https://developer.spotify.com/documentation/general/guides/authorization-guide/
// TODO: SECURITY: use state param to prevent CSRF attacks

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read",
];

// URLSearchParams replaces ' ' with '+', not '%20', so scopes needed to be added seperately
const params = new URLSearchParams({
  client_id: "94cf0f5b2eee46bf8015e851573f2348",
  response_type: "code",
  redirect_uri: "http://localhost:3000/login/return",
});
const URL =
  "https://accounts.spotify.com/authorize?" +
  params.toString() +
  "&scope=" +
  scopes.join("%20");

export default function Login({ setCode, accessToken }) {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) setCode(code);
  }, [setCode]);

  const { path } = useRouteMatch();

  return (
    // Div Centers button in screen
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      {accessToken ? <Redirect to="/" /> : null}
      <Switch>
        <Route exact path={path}>
          <Button variant="success" href={URL}>
            Login To Spotify
          </Button>
        </Route>
        <Route path={`${path}/return`}>
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Loading...
          </Button>
        </Route>
      </Switch>
    </div>
  );
}
