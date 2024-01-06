import express from 'express'
var app = express()
import fs from 'fs'
import path from 'path'
import { Logger } from './../structures/logger.js'
const logs = new Logger()
import Database from './../structures/db.js'
var data = new Database('user.data',false)
export const user = express.Router().get('/api/v2/users/:ide', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message: "Authorization empty!"
  });
  var
  keyMethod = req.headers.authorization.toString().split(' ')[0],
  d = new Date(),
  obj = data.all().find(x=>x.identifier==req.params.ide),
  keyCode = req.headers.authorization.toString().split(' ')[1];
  if(keyMethod !== "KKey" && keyMethod !== "KAdm") return res
  .status(404)
  .json({
    status: 404,
    message: "Authorization key not found"
  });
  logs.logs({
    status: 200,
    route: req.path,
    method: req.method,
    ip: req.ip,
    message: "access user"
  })
  data.load()
  if(keyMethod=='KAdm') {
  if(keyCode!==process.env["pkay"]) return res
  .status(403)
  .json({
    status: 403,
    message: "Invalid authorization key."
  });
  if(!data.has(req.params.ide, true)) return res
  .status(404)
  .json({
    status: 404,
    message: "User not found."
  });
  data.load()
  return res
  .status(200)
  .json({
    status: 200,
    user: obj
  });
  } 
  if(!data.all().find(x=>x.KKey==keyCode)) return res
  .status(403)
  .json({
    status: 403,
    message: "Invalid authorization key."
  });
  if(!data.has(req.params.ide, true)) return res
  .status(404)
  .json({
    status: 404,
    message: "User not found."
  });
  data.load()
  return res
  .status(200)
  .json({
    status: 200,
    user: {
      username: obj.username,
      identifier: obj.identifier,
      background: obj.background,
      avatar: "https://kapi.motg100.repl.co/api/v2/"+obj.avatar,
      biography: obj.biography,
      followers: obj.followers,
      band: obj.band
    }
  });
});