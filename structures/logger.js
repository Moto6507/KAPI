import path from 'path'
import fs from 'fs'
import { id, f } from './../functions.js'
import chd from 'chokidar'
export class Logger {
  constructor () {
    this.filePath = path.resolve() + "/structures/logger.json";
    this.fileContent;
    this.writeToFile = (data) => {
    try {
      if(!data) {
        fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2));
        return "cleaned"
      }
      this.fileContent[id()] = data
      fs.writeFileSync(this.filePath, JSON.stringify(this.fileContent, null, 2));
      return true
    } catch(e) {
      throw e
    }
    }
    fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          this.fileContent = {};
          return;
        }
        throw err;
      }
      try {
        this.fileContent = JSON.parse(data);
      } catch (err) {
        console.error(`JSON ERROR ${this.filePath}: ${err}`);
        this.fileContent = {};
      }
    })
    chd.watch(this.filePath).on('change', () => {
        this.fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
         if(this.showLogs().length>550) this.archive()
  })
  }
 logs(obj) {
   /*
   {
     status,
     route,
     method,
     ip,
     path, 
     body,
     message,
     date
    }
   */
   obj.date = new Date().getTime()
   return this.writeToFile(obj)
 }
 showLogs() {
   return Object.keys(this.fileContent).map(y => this.fileContent[y])
 }
 archive() {
   const idLogger = id()
   this.fileContent["archive"] = "archived " + idLogger
   fs.writeFileSync(`${path.resolve()}/structures/archives/log${idLogger}.json`, JSON.stringify(this.fileContent, null, 2))
  return this.writeToFile()
 }
}