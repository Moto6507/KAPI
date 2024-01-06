import express from 'express'
var app = express()
import fs from 'fs'
import path from 'path'
import { Logger } from "./../structures/logger.js"
let logs = new Logger()
export const media = express.Router().get('/api/v2/media/:type/:file', async function (req, res) {
var 
  aut = req.headers.authorization,
  d = new Date(),
  param = [req.params.type, req.params.file];
 if(!["backgrounds","avatars","thumbnails"].includes(param[0])) {
   logs.logs({
    status: 403,
    route: req.path,
    method: req.method,
    ip: req.ip,
    message: "insistent parameter"
  });
   return res
  .status(403)
  .json({
    status: 403,
    message:"parameter 1 needs to be one eu of the three options for file types, they are backgrounds, avatars and thumbnails."
  });
 }
  if(!fs.existsSync(path.resolve()+"/data/media/"+param[0]+"/"+param[1]+".png")) return res
.sendFile(path.resolve()+"/data/media/pendrive_why.png")
  logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "media content"
  })
 res
.sendFile(path.resolve()+"/data/media/"+param[0]+"/"+param[1]+".png")
});