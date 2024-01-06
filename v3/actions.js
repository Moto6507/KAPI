import express from 'express'
import { Logger } from './../structures/logger.js'
import { Database } from './../structures/database.js'
var data = new Database();
var logs = new Logger();
export const actions = express.Router().post('/api/v3/actions', (req, res) => {
  const body = req.body
  if(body.action==="createAccount") {
    const { username, identfier, password, email, biography } = body
    logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "account created, new user is called " + username
  })
  data.insert(email, {
      "adm": true,
      "acessKey": "",
      "avatar": "",
      "background": "",
      "verified": false,
      "blockedUsers": [],
      "stars": [],
      "bands": {},
      "biography": biography,
      "createdAt": new Date().getTime(),
      "devices": [],
      "judged": false,
      "emailEncripted": email,
      "follow": [],
      "followers": [],
      "identifier": identifier,
      "notifications": "",
      "password": password,
      "playlists": "",
      "theme": 0,
      "username": username
  })
  }
  if(body.action==="database") {
    const { type, dataReceived } = body;
    data[type](dataReceived);
  }
})