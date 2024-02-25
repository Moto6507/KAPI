import express from 'express'
import timeout from 'connect-timeout'
import Database from './../structures/db.js'
import fs from 'fs'
import path from 'path'
import { Logger } from "./../structures/logger.js"
var data = new Database('user.data',false)
var dataPosts = new Database('posts.data', true);
let logs = new Logger();

export const getInfos = express.Router().get('/api/v3/get/infos/:identifier', async(req, res) => {
  const id = req.params.identifier
  if(id==='search') {
    const text = req.query.q;
    const track = req.query.track;
    const findPosts = (x) => (x.title.toLowerCase().includes(text) ||  x.gender.toLowerCase().includes(text) || x.lyrics.toLowerCase().includes(text))
    let
    results = [],
    posts = dataPosts.all();
    posts = posts.map(x=>{
      if(!x.lyrics) return x
      const musicLyrics = fs.readFileSync(path.resolve() + '/media/lyrics/' + x.lyrics + '.lrc');
      x['lyrics'] = musicLyrics
    })
    posts.map(x=>findPosts(x)? results.push(x) : '')
    if(results.length < 1) return res.status(404).json({ status: 404, message: 'key not found' });
    if(track) {
    results.map(x=>{
    const musicFile = fs.readFileSync(path.resolve() + '/media/songs/' + x.musicFile + '.mp3');
    x['track'] = new Buffer(musicFile).toString('base64')
    x['comments'] = null
  })
    return res.status(200).json({ data: results })
    }
    return res.status(200).json({ data: results })
  }
  if(id==='all') {
    const isPostDB = req.query.post
    if(isPostDB) return res.status(200).json(dataPosts.all())
    else return res.status(200).json(data.all())
  }
  const isPost = req.params.post;
  const user = isPost? dataPosts.get(id) : data.robustSearch(id) || dataPosts.robustSearch(id)
  if(!user) return res.json({ status: 500, message: "key not recognized" })
  logs.logs({
    status: 200,
    route: req.path, 
    method: req.method,
    ip: req.ip,
    message: "infos of " + id + " will be required."
  })
  res.status(200).json({ status: 200, user });
})