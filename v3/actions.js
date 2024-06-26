import express from 'express'
import { Logger } from './../structures/logger.js'
import Database from './../structures/db.js'
import fs from 'fs'
import path from 'path'
var data = new Database('user.data',false)
var dataPost = new Database('posts.data',true)
var logs = new Logger();
export const actions = express.Router().post('/api/v3/actions', (req, res) => {
  const body = req.body
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
      "adm": false,
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
      "email": email,
      "follow": [],
      "followers": [],
      "identifier": identifier,
      "notifications": [],
      "password": password,
      "playlists": [],
      "theme": 0,
      "username": username
  })
  return res.json({ status: 200 });
  }
  if(body.action==="database") {
    const { type, collection, path, isPost } = body;
   logs.logs({
    status: "unknow",
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "resolving request for database..."
  })
if(Array.isArray(path) && ["update",'updateCertainObject'].includes(type)) {
  const [ path1, path2 ] = path
  const outData = isPost? dataPost[type](collection, path1, path2) : data[type](collection, path1, path2);
  logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: `function ${type} resolved in database ${isPost? "postData" : "userData"}`
  })
  return ["get","all","robustSearch"].includes(type)? res.status(200).json({ status: 200, data: outData }) : res.status(200).json({ status: 200 });
}
const outData = isPost? dataPost[type](collection, path) : data[type](collection, path);
logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: `function ${type} resolved in database ${isPost? "postData" : "userData"}`
  })
 return["get","all","robustSearch"].includes(type)? res.status(200).json({ status: 200, data: outData }) : res.status(200).json({ status: 200 });
}
if(body.action==="unlink") {
console.log(path.resolve()+"/media/" + body.id)
  if(!fs.existsSync(path.resolve()+"/media/" + body.id)) return;
fs.unlinkSync("media/" + body.id)
  return res
    .status(200)
}
  })