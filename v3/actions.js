import express from 'express'
import { Logger } from './../structures/logger.js'
import Database from './../structures/db.js'
var data = new Database('user.data',false)
var post = new Database('posts.data',true)
var logs = new Logger();
export const actions = express.Router().post('/api/v3/actions', (req, res) => {
  const body = req.body
  console.log(body)
  if(body.action==="createAccount") {
    const { username, identifier, password, email, biography } = body
    logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "account created, new user is called " + username
  })
  data.insert(email, {
      "adm": true,
      "accessKey": "",
      "avatar": "user",
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
      "playlists": [],
      "theme": 0,
      "username": username
  })
  return res.json({ status: 200 });
  }
  if(body.action==="database") {
    const { type, dataReceived, isPost } = body;
    let results;
    if(isPost) results = post[type](dataReceived);
    else results = data[type](dataReceived);
  return res.json({ status: 200, results });
  }
})