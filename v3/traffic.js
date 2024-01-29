import express from 'express'
import { Logger } from './../structures/logger.js'
const logs = new Logger();
export const traffic = express.Router().get('/api/v3/traffic', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline'">
  <style>
  body {
    margin: 0;
    padding: 0;
    background: #2b2b2b;
    text-align: center;
  }
 .container {
   background: #464646;
   margin: 5px;
   padding: 4px;
   margin: 5px;
   border-radius: 5px;
 }
 .container .status {
   background: #28ff10;
   color: #0b6f00;
   font-weight: bold;
   padding: 4px;
   display: inline-block;
   border-radius: 5px
 }
 .container .status.error {
   background: #ff2525;
   color: #a60000;
   font-weight: bold;
   padding: 4px;
   display: inline-block;
   border-radius: 5px
 }
 .container .method {
   background: #505050;
   color: #b4b4b4;
   padding: 5px;
   font-weight: bold;
   border-radius: 5px;
   margin: 5px;
   display: inline-block;
 }
 .container .route {
   background: #606060;
   color: #fff;
   border-radius: 5px;
   padding: 5px;
   margin: 5px;
 }
 .container .route.smallInformation {
   background: #545454;
   color: #a2a2a2;
   margin: 2px;
   display: inline-block
 }
 .chart {
  border: 2px solid rgb(68,68,68);
  border-radius: 5px;
  margin: 5px;
  color: #fff;
  padding: 2px;
}
.chart .barContainer {
  display: flex;
  justify-content: center;
  align-items: center
}
.chart .barContainer .bar {
  height: 30px;
  width: 100%;
  margin-right: 5px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  color: #b2beff;
  align-items: center;
  justify-content: center;
  background: #425fff
}
.chart .barContainer .number {
  margin-left: auto;
}
</style>
<title>Karaoke API traffic</title>
</head>
<body>
<div class="chart">${logs.chartString()}</div>
${logs.showLogs().map(x=>`
<div class='container'>
  <div class='status ${x.status===500? "error" : ""}'>${x.status}</div><br>
  <div class='method'>${x.method}</div>
  <div class='route'>${x.route}</div>
  <div class='route smallInformation'>${x.ip}</div><br>
  <div class='route smallInformation'>${x.message}</div>
</div>
`).join(" ")}
</body>
</html>
`)
})