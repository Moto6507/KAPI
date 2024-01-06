import express from 'express'
import fs from 'fs'
import path from 'path'
import { Logger } from "./../structures/logger.js"
const logs = new Logger()
export let 
  song = express.Router().get('/api/v2/soundFile/:file', async function (req, res) {
var 
  filePath = path.resolve()+"/data/songs/tracks/"+req.params.file+".mp3";
  if(!fs.existsSync(filePath)) {
    logs.logs({
      status: 404,
      method: req.method,
      ip: req.ip,
      route: req.path,
      message: "song file not found"
    })
    return res
  .status(404)
  .json({
    status:404,
    message:"song file not found"
  })
  }
    var stat = fs.statSync(filePath);
    logs.logs({
    status: 200,
    route: req.path,
    method: req.method,
    ip: req.ip,
    message: "song content"
  })
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        readStream.pipe(res);
     } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
     }
}),
  lyrics = express.Router().get('/api/v2/lrcFile/:file', async function (req, res) {
var 
  aut = req.headers.authorization,
  d = new Date(),
  file = path.resolve()+"/data/songs/lyrics/"+req.params.file+".lrc";
if(!fs.existsSync(file)) {
  logs.logs({
      status: 404,
      method: req.method,
      route: req.path,
      message: "song file not found"
    })
  return res
  .status(404)
  .json({
    status:404,
    message:"lrc file not found"
  })
}
    logs.logs({
      status: 200,
      route: req.path,
      method: req.method,
      ip: req.ip,
      message: "lyrics content"
    })
  res.send(fs.readFileSync(file,"utf8"))
});