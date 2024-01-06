import express from 'express'
var app = express()
import fs from 'fs'
import path from 'path'
import { Logger } from "./../structures/logger.js"
let logs = new Logger()
import Database from './../structures/db.js'
import ffmetadata from 'ffmetadata';
var data = new Database('user.data',false)
var posts = new Database('posts.data',true)
export let
  create = express.Router().post('/api/v2/create', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message:"Not authorized"
  });
var 
  aut = req.headers.authorization,
  body = req.body,
  d = new Date();
  var h = new Date(d).getHours();
  var m = new Date(d).getMinutes();

h = (h<10) ? '0' + h : h;
m = (m<10) ? '0' + m : m;
  if(aut.split(' ')[0]!=="KAdm" || aut.split(' ')[1]!==process.env['pkay']) return res
  .status(403)
  .json({
    status: 403,
    message:"Incorrect administrative key."
  });
  if(data.has(body.enc)) return res
  .status(500)
  .json({
    status: 500,
    message:"The user already exits."
  });
  logs.logs({
    status: 200,
    route: req.path,
    method: req.method,
    ip: req.ip,
    message: "create account"
  })
  const date = data.insert(body.enc, {
    "infos": {
      "adm": "",
      "KKey": "",
      "avatar": "media/avatars/user",
      "background": "",
      "badges": "",
      "blocks": "",
      "stars":"",
      "biography": body.bio,
      "gender": "",
      "band": "",
      "createdAt": new Date().getTime(),
      "devices": "",
      "judged": false,
      "emailEncripted": body.enc,
      "follow": "",
      "followers": "",
      "identifier": body.id,
      "notifications": "",
      "password": body.password,
      "playlists": "",
      "stars": "",
      "theme": 0,
      "username": body.username
    }
  })
if(!date) {
  logs.logs({
    status: 500,
    route: req.path,
    method: req.method,
    ip: req.ip,
    message: "server error, create account"
  })
  return res.status(500).json({
    status: 500
  })
}
return res.status(200).json({
   status:200
})
}),
 db = express.Router().post('/api/v2/db', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message:"Not authorized"
  });
var 
  aut = req.headers.authorization,
  body = req.body,
  d = new Date();
if(aut.split(' ')[0]!=="KAdm" || aut.split(' ')[1]!==process.env['pkay']) return res
  .status(403)
  .json({
    status: 403,
    message:"Incorrect administrative key."
  });
   logs.logs({
    status: 200,
    route: req.path,
    method: req.method,
    ip: req.ip,
    body: body,
    message: "db method"
  })
  if(!body.type) return res
  .status(404)
  .json({
    status: 404,
    message:"undeclared type."
  });
 if(body.post) {
   if(body.type=="set") {
   const rs = posts.insert(body.name, body.struct)
    if(rs) return res
  .status(200)
  .json({
    status: 200
  });
  else return res
  .status(500)
  .json({
    status: 500
  });
 }
 if(body.type=="update") {
   const rs = posts.update(body.name, body.path, body.struct)
   if(rs) return res
  .status(200)
  .json({
    status: 200
  });
  else return res
  .status(500)
  .json({
    status: 500
  });
 }
 if(body.type=="get") {
   return res
  .status(200)
  .json({
    status: 200,
    data: posts.get(body.struct)
  });
 }
 if(body.type=="has") {
   return res
  .status(200)
  .json({
    status: 200,
    has: posts.has(body.struct)
  });
 }
 if(body.type=="remove") {
   posts.remove(body.struct)
   return res
  .status(200)
  .json({
    status: 200,
    finish: true
  });
 }
 if(body.type=="all") {
   return res
  .status(200)
  .json({
    status: 200,
    data: posts.all()
  });
 }
 }
 if(body.type=="set") {
   const rs = data.update(body.name, body.path, body.struct)
   if(rs) return res
  .status(200)
  .json({
    status: 200
  });
  else return res
  .status(500)
  .json({
    status: 500
  });
 }
 if(body.type=="get") {
   return res
  .status(200)
  .json({
    status: 200,
    data: data.get(body.struct).infos
  });
 }
 if(body.type=="has") {
   return res
  .status(200)
  .json({
    status: 200,
    has: data.has(body.struct)
  });
 }
 if(body.type=="remove") {
   data.remove(body.struct, body.struct2, body.struct3)
   return res
  .status(200)
  .json({
    status: 200,
    finish: true
  });
 }
 if(body.type=="all") {
   return res
  .status(200)
  .json({
    status: 200,
    data: data.all()
  });
 }
}),
  editFil = express.Router().post('/api/v2/editFil', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message:"Not authorized"
  });
var 
  aut = req.headers.authorization,
  body = req.body,
  d = new Date();
  var h = new Date(d).getHours();
  var m = new Date(d).getMinutes();

h = (h<10) ? '0' + h : h;
m = (m<10) ? '0' + m : m;
  if(aut.split(' ')[0]!=="KAdm" || aut.split(' ')[1]!==process.env['pkay']) return res
  .status(403)
  .json({
    status: 403,
    message:"Incorrect administrative key."
  });
if(body.type==="unlink") {
  if(!fs.existsSync(path.resolve()+"/data/" + body.id)) return;
fs.unlinkSync("data/" + body.id)
  return res
    .status(200)
} else {
ffmetadata.write("data/songs/tracks/" + body.id + ".mp3", { title: body.title }, function(err) {
	if (err) console.error("Error writing metadata", err);
	else console.log("Data written");
 });
}
}); 