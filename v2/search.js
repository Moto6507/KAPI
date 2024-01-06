import express from 'express'
import Database from './../structures/db.js'
import fs from 'fs'
import path from 'path'
let logs = new console.Console(fs.createWriteStream(path.join() + '/structures/logger.txt'));
var data = new Database('user.data')
var posts = new Database('posts.data',true)
export const search = express.Router().get('/api/v2/search/:term', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message: "authorization not found"
  });
  function getMatches(ts, ss){
  let result = []
  ss.map(x=>{
    
   if(x.lyrics) {
    if(x.title.toLowerCase().includes(ts.toLowerCase()) || x.description.toLowerCase().includes(ts.toLowerCase()) || x.lyrics.toLowerCase().includes(ts.toLowerCase())) return result.push(x)
   } else {
     if(x.title.toLowerCase().includes(ts.toLowerCase()) || x.description.toLowerCase().includes(ts.toLowerCase())) return result.push(x)
   }
  });
  if(result.length==0) return undefined
  else return result
}
  var 
  term = req.params.term,
  aut = req.headers.authorization,
  postins = posts.all().map(x=>{
    if(x.lyrics && !isNaN(x.lyrics)) x.lyrics = fs.readFileSync(path.resolve()+"/data/songs/lyrics/"+x.lyrics+".lrc","utf8")
    return x
  });
  let
  mapify = data.all(),
  post = getMatches(term, postins),
  keyMethod = aut.split(' ')[0],
  keyCode = aut.split(' ')[1],
  findKey = mapify.find(x=>x.KKey==keyCode) || process.env['pkay']
  if(keyMethod!=="KKey") return res
  .status(403)
  .json({
    status: 403,
    message: "Authorization code not found."
  });
  if(!findKey) return res
  .status(403)
  .json({
    status: 403,
    message: "Authorization not found."
  });
  if(!post) return res
  .status(404)
  .json({
    status: 404,
    message: "No found matches."
  });
  let d = new Date();
  logs.log("[ KAPI ]: received request (GET) : /search  - " + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('000' + d.getFullYear()).slice(-4) + " at " + new Date( new Date().getTime() + -3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" ).match(/\d\d:\d\d/)[0])
  return res
  .status(200)
  .json({
    tracks: post
  });
});