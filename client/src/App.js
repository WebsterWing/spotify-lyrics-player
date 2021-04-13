import { useState, useEffect } from "react";

import Login from "./Login";
import Dashboard from "./Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";

function App() {
  const [accessKeys, setAccessKeys] = useState(() => {
    const storedAccessToken = sessionStorage.getItem("spotifyAccessToken");
    const storedRefreshToken = sessionStorage.getItem("spotifyRefreshToken");
    if (storedAccessToken && storedRefreshToken) {
      return {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        expiresIn: 61,
      };
    } else {
      return {};
    }
  });

  const [code, setCode] = useState();

  // get access tokens with code
  useEffect(() => {
    if (!code) return;
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((resp) => {
        const { accessToken, refreshToken, expiresIn } = resp.data;
        setAccessKeys({ accessToken, refreshToken, expiresIn });
      })
      .catch((err) => {
        console.error(err);
        setAccessKeys({});
      });
  }, [code]);

  // periodically refresh access tokens
  useEffect(() => {
    const { accessToken, refreshToken, expiresIn } = accessKeys;
    if (!accessToken || expiresIn <= 0) return;
    const timeout = setTimeout(() => {
      axios
        .post("http://localhost:3001/refresh", {
          accessToken,
          refreshToken,
        })
        .then((resp) => {
          console.log(resp);
          const { accessToken, expiresIn = 900 } = resp.data;
          setAccessKeys({
            ...accessKeys,
            accessToken,
            expiresIn,
          });
        })
        .catch((err) => {
          console.error(err);
          setAccessKeys({});
        });
    }, (expiresIn - 60) * 1000);
    return () => clearTimeout(timeout);
  }, [accessKeys]);

  // add accessKeys to sessionStore
  useEffect(() => {
    const { accessToken, refreshToken } = accessKeys;
    if (!accessToken || !refreshToken) return;
    sessionStorage.setItem("spotifyAccessToken", accessToken);
    sessionStorage.setItem("spotifyRefreshToken", refreshToken);
  }, [accessKeys]);

  return (
    <Router>
      <Container className="min-vh-100">
        <Switch>
          <Route path="/login">
            <Login setCode={setCode} accessToken={accessKeys.accessToken} />
          </Route>
          <Route exact path="/">
            {accessKeys.accessToken ? (
              <Dashboard accessToken={accessKeys.accessToken} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
