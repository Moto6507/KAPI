import express from 'express'
import Database from './../structures/db.js'
var data = new Database('user.data',false)
var dataPosts = new Database('posts.data', true);
import { Logger } from "./../structures/logger.js"
let logs = new Logger()
export const getInfos = express.Router().get('/api/v3/get/infos/:identifier', async(req, res) => {
  const id = req.params.identifier;
  if(!data.has(id)) return res.json({ status: 500, message: "key not recognized" })
  const user = data.robustSearch(id);
  logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "infos of " + id + " will be required."
  })
  return res.json({ status: 200, user })
})