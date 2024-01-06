import express from 'express'
var app = express()
import fs from 'fs'
import path from 'path'
import { Logger } from "./../structures/logger.js"
import { f } from './../functions.js'
let logs = new Logger()
export const panel = express.Router().get('/api/v2/panel', async function (req, res) {
  res.send(`<!DOCTYPE html>
<html>
  <head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
    traffic - Karaoke
    </title>
    <style>
      body {
        margin: 0;
        padding: 0;
        text-align: center;
        background: #d8ddfc;
        scroll-behavior: smooth;
      }
      .title {
        margin: 0;
        color: #a9b6ff
      }
      .container {
        margin: 5px;
        border-radius: 5px;
        overflow: hidden;
        border: 2px solid #a9b6ff
      }
      .container .message {
       padding: 5px;
       overflow: hidden;
       word-wrap: break-word; 
       overflow-wrap: break-word;
       white-space: pre-line
      }
      .container .message #status200 {
        border-radius: 5px;
        display: inline-block;
        background: #1eff14;
        color: #b7ffb4;
        padding: 5px;
        font-weight: bold;
      }
      .container .message #status500 {
        border-radius: 5px;
        display: inline-block;
        background: #ff0f0f;
        color: #ff9999;
        padding: 5px;
        font-weight: bold;
      }
      .container .explain {
       background: #b4befd;
       padding: 5px;
       margin: 5px;
       border-radius: 5px;
       word-wrap: break-word;
       overflow-wrap: break-word;
       white-space: pre-line
      }
      .container .date {
        color: #8495fe;
        background: #ccd3fc;
        border-radius: 5px;
        padding: 2px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <h1 class="title">Karaoke Traffic</h1>
    Today is ${f(new Date(), true)}<br>
    <select onclick="alert(this.value)">
    <option value="#">...</option>
    ${logs.showLogs().sort((a, b) =>{
        a = new Date(a.date).getTime()
        b = new Date(b.date).getTime()
        return b - a
          }).
    map((x, i=0)=>{
      return `<option value="${i++}">${f(x.date)}</option>`
    }).join("")}
   </select>
    <h4 class='title'>traffic global</h4>
    <br><br><div class='container'>
    ${logs.showLogs().sort((a, b) =>{
  a = new Date(a.date).getTime()
  b = new Date(b.date).getTime()
  return b - a
    }).
      map((x, i=0)=>{
    return `<div class='message' id='${i++}'><div id='status${x.status}'>${x.status}</div><br>${x.route}<br><div class='date'>${f(x.date)}</div></div><div class='date'>${x.ip}</div><div class='explain'>${x.body? x.message + " " + JSON.stringify(x.body) : x.message}</div>
    `
    }).join("<hr>")
    }</div>
    </div>
    </div>
    </body>
    </html>`)
});