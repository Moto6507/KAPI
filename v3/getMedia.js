import express from 'express';
import fs from 'fs';
import path from 'path'
import { Logger } from "./../structures/logger.js"
let logs = new Logger()
export const getMedia = express.Router().get('/api/v3/get/media/:type/:opcionalParam', async(req, res) => {
  const type = req.params.type;
  const opcionalParam = req.params.opcionalParam;
  const isImage = (type==="avatars" || type==="backgrounds" || type==="thumbnails");
  logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "media " + type + " is required"
  })
  if(isImage) {
  const image = path.resolve() + "/media/" + type + "/" + opcionalParam + ".png";
  if(!fs.existsSync(image)) res.sendFile(path.resolve() + "/media/mediaNoFound.svg")
  return res.sendFile(image)
  }
  if(type==="songs") {
    const song = path.resolve() + "/media/" + type + "/" + opcionalParam + '.mp3'
    console.log(song)
    if(!fs.existsSync(song)) return res.send("no sound");
    var stat = fs.statSync(song);
    const total = stat.size
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(song, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        readStream.pipe(res);
        return;
     } else {
        res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': 'audio/mpeg' });
        const readStream = fs.createReadStream(song)
        readStream.pipe(res);
        return;
    }
  }
console.log(type)
  if(type==="lyrics") {
    const lyrics = path.resolve() + "/media/" + type + "/" + opcionalParam + '.lrc';
    if(!fs.existsSync(lyrics)) return res.send("No lyrics")
    return res.sendFile(lyrics)
  }
  return res.send("no media allowed")
});