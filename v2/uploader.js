import express from 'express'
let router = express.Router();
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { Logger } from "./../structures/logger.js"
let logs = new Logger()
import node from 'node-id3'
export const up = router.post('/api/v2/upload', async function(req, res) {
  if (!req.headers.authorization && req.headers.authorization == process.env['pkay']) return res.status(404).json({
    status: 404,
    message: "Not authorized."
  })
  let
    body = req.body,
    d = new Date();
  let
    song = body.song,
    background = body.background,
    avatar = body.avatar,
    thumbnail = body.thumbnail,
    lyrics = body.lyrics;
  logs.logs({
    status: 200,
    route: req.path,
    method: req.method,
    ip: req.ip,
    body: 
      song? "song" : "" + 
      background? "background" : "" + 
      avatar? "avatar" : "" + 
      thumbnail? "thumbnail" : "" + 
      lyrics? "lyrics" : "",
    message: "upload method"
  })
    if(avatar) {
      let { file, last, id } = avatar;
      file = file
        .replace(/^data:image\/jpeg;base64,/, "")
        .replace(/^data:image\/png;base64,/, "")
        .replace(/^data:audio\/mpeg;base64,/, "")
      file += file.replace('+', ' ');
      if (file.includes("data:image/jpeg;base64,")) {
      let buffer = new Buffer(file, 'base64')
        if (last !== "media/avatars/user") fs.unlinkSync("data/" + last + ".png")
        return sharp(buffer)
          .toFile("data/media/avatars/" + id + ".png")
      }
     let buffer = new Buffer(file, 'base64').toString('binary');
      if (last !== "media/avatars/user") fs.unlinkSync("data/" + last + ".png")
      fs.writeFileSync("data/media/avatars/" + id + ".png", buffer, "binary", function(err) {
        console.log(err);
      });
    }
    if(background) {
      let { file, last, id } = background
        file = file.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "").replace(/^data:audio\/mpeg;base64,/, "")
        file += file.replace("+", " ")
      if (file.includes("data:image/jpeg;base64,")) {
        let buffer = new Buffer(bfile, 'base64')
        if (last) fs.unlinkSync("data/" + last + ".png")
        return sharp(buffer)
          .toFile("data/media/backgrounds/" + uuid + ".png")
      }
        let buffer = new Buffer(file, 'base64').toString('binary');
      if (last) fs.unlinkSync("data/" + last + ".png")
      fs.writeFileSync("data/media/backgrounds/" + id + ".png", buffer, "binary", function(err) {
        console.log(err);
      });
    }
    if(thumbnail) {
      let { file, id } = thumbnail
      file = file
        .replace(/^data:image\/jpeg;base64,/, "")
        .replace(/^data:image\/png;base64,/, "")
        .replace(/^data:audio\/mpeg;base64,/, "")
        file += file.replace("+", " ")
      if (file.includes("data:image/jpeg;base64,")) {
        let buffer = new Buffer(file, 'base64')
        return sharp(buffer)
          .toFile("data/media/thumbnails/" + id + ".png")
      }
        let buffer = new Buffer(file, 'base64').toString('binary');
      fs.writeFileSync("data/media/thumbnails/" + id + ".png", buffer, "binary", function(err) {
        console.log(err);
      });
    }
    if(song) {
    let { file, id, username, title } = song
      file = file
        .replace(/^data:audio\/mpeg;base64,/, "")
        file += file.replace("+", " ")
     const buffer = Buffer.from(file, "base64").toString("binary")
  fs.writeFileSync("data/songs/tracks/" + id + ".mp3", buffer, 'binary',  function(err) {
  if(err) return console.log(err);
  node.write({
    title: title,
    artist: username
  }, "./data/songs/tracks/" + id + ".mp3", function(err) {
    if(err) return console.log(err)
  })
    })
    }
    if(lyrics) {
      fs.writeFile('data/songs/lyrics/' + lyrics.id + ".lrc", lyrics.content, (err) => {
        if (err) {
          console.log("cannot create lyrics " + err)
        }
      });
    }
  return res.status(200).json({
    status: 200,
    message: "sent"
  })
});