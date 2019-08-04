// Imports
const axios = require("axios");
const jwt = require("njwt");
const jwt_decode = require("jwt-decode");
const express = require("express");
const router = express.Router();

// Constants
const secretPhase = process.env.SECRET_PHRASE;
const tokenURL = 'https://accounts.spotify.com/api/token';
const baseURL = 'https://api.spotify.com/v1/';
const userData = {};

// Axios Interceptors
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(request => {
  return request;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.config && error.response && error.response.status === 401 && error.config.headers.jwt) {
    jwt.verify(error.config.headers.jwt, secretPhase, (err, verifiedJwt) => {
      if (err) {
        return Promise.reject(error);
      } else {
        if (userData[verifiedJwt.sub]) {
          axios({
            method: 'post',
            url: tokenURL,
            params: {
              client_id: '1dcb962ce1c5437baecc403b9fa1ae5e',
              client_secret: process.env.CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: userData[verifiedJwt.sub].refresh_token
            }
          })
            .then((response) => {
              userData[verifiedJwt.sub].access_token = response.data.access_token;
              return axios.request(error.config);
            }).catch((error) => {
            return Promise.reject(error);
          });
        }
      }
    });
  }
  return Promise.reject(error);
});

// Router interceptors
router.use(function (req, res, next) {
  let error = false;
  if (req.url !== "/login" && req.headers.jwt) {
    jwt.verify(req.headers.jwt, secretPhase, (err, verifiedJwt) => {
      if (err) {
        res.status(401);
        res.json({message: "Missing JSON Web Token"});
        error = true;
      }
    });
  }
  if (!error) {
    next();
  }
});

// Login to spotify
router.get('/login', (req, res, next) => {
  let accessInfo;
  axios({
    method: 'post',
    url: tokenURL,
    params: {
      client_id: '1dcb962ce1c5437baecc403b9fa1ae5e',
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:8080/login'
    }
  })
    .then((response) => {
      accessInfo = response.data;
      return axios({
        method: 'get',
        url: baseURL + 'me',
        headers: {
          Authorization: 'Bearer ' + accessInfo['access_token']
        }
      });
    })
    .then((response) => {
      userData[response.data.id] = accessInfo;
      const claims = {
        iss: 'lyrical',
        sub: `${response.data.id}`
      };
      const token = jwt.create(claims, secretPhase);
      token.setExpiration();
      res.json({jwt: token.compact()});
    })
    .catch((error) => {
      console.error(error);
      res.json(error);
    });
});

// Get user information
router.get('/me', (req, res, next) => {
  let userID = '';
  try {
    userID = jwt_decode(req.get('JWT')).sub;
  } catch (ex) {}
  if (userData[userID]) {
    return axios({
      method: 'get',
      url: baseURL + 'me',
      headers: {
        Authorization: 'Bearer ' + userData[jwt_decode(req.get('JWT')).sub].access_token
      }
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error.response.data);
      });
  } else {
    res.status(401);
    res.json({message: "User is not logged in"});
  }
});

// Get the user's library tracks
router.get('/me/tracks', (req, res, next) => {
  const userID = jwt_decode(req.get('JWT')).sub;
  if (userData[userID]) {
    return axios({
      method: 'get',
      url: baseURL + 'me/tracks',
      headers: {
        Authorization: 'Bearer ' + userData[jwt_decode(req.get('JWT')).sub].access_token
      }
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error.response.data);
      });
  } else {
    res.status(401);
    res.json({message: "User is not logged in"});
  }
});

module.exports = router;
