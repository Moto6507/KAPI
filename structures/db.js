import fs from 'fs'
import path from 'path'
import chd from 'chokidar'
class Database {
  constructor(databaseName, datatype) {
    this.databaseName = databaseName;
    this.filePath = `${path.resolve()}/structures/${databaseName}.json`;
    this.writeToFile = (data) => {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        return true
      } catch (_) {
        return false
      }
    }
    this.load();
    this.dataType = datatype;
    chd.watch(this.filePath).on('change', (event, filename) => {
      filename = path.resolve() + "/structures/" + filename
        let d = new Date()
        console.log("\x1b[34m", "[ KAPI ]", "\x1b[0m", ": database changed - " + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('000' + d.getFullYear()).slice(-4) + " at " + new Date(new Date().getTime() + -3 * 3600 * 1000).toUTCString().replace(/ GMT$/, "").match(/\d\d:\d\d/)[0])
        this.load();
    });
  }
  load() {
    fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          this.db = {};
          return;
        }
        throw err;
      }
      try {
        this.db = JSON.parse(data);
      } catch (err) {
        console.error(`JSON ERROR ${this.filePath}: ${err}`);
        this.db = {};
        this.load();
      }
    });
  }

  get(collection) {
    const records = this.db[collection];
    if (!records) return false
    return records
  }

  insert(collection, data) {
    if (this.dataType) {
      if (!this.db[collection]) {
        this.db[collection] = [];
      }
      this.db[collection] = data
      return this.writeToFile(this.db);
    }
    if (!this.db[collection]) {
        this.db[collection] = "";
      }
      this.db[collection] = data;
      return this.writeToFile(this.db);
   }
  updateCertainObject(collection, path, value) {
      this.db[collection][path] = value
      this.writeToFile(this.db);
      }
  update(collection, path, value) {
    this.load()
    const keys = path.split('.');
    let curr = this.db[collection];
    let i;
    for (i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!curr.hasOwnProperty(key)) {
        curr[key] = {};
      }
      curr = curr[key];
    }
    curr[keys[i]] = value;
    const rs = this.writeToFile(this.db)
    this.load()
    return rs
  }
  delete(collection, query) {
    if (!query) {
      this.db[collection] = null
      return this.writeToFile(this.db);
    }
    let records = this.db[collection];
    if (records.length == 0 || !query) {
      delete this.db[collection]
      return this.writeToFile(this.db);
    }
    if (this.dataType) {
      if (!records) return false;
      const keys = Object.keys(query);
      const remainingRecords = records.filter((record) => {
        return !keys.every((key) => query[key] === record[key]);
      });
      if (remainingRecords.length === records.length) {
        return false;
      } else {
        this.db[collection] = remainingRecords;
        return this.writeToFile(this.db);
      }
    } else {
      if (!records) return false;
      const keys = Object.keys(query);
      let remainingRecords;
      if (keys.every((key) => query[key] === records[key])) remainingRecords = Object.assign({}, records);
      if (remainingRecords.length === records.length) {
        return false;
      } else {
        this.db[collection] = remainingRecords;
        return this.writeToFile(this.db);
      }
    }
  }
  all() {
    let mapify = Object.keys(this.db).map(y => this.db[y])
    if (this.dataType) mapify = Object.keys(this.db).map(y => this.db[y]).flat(1)
    if (mapify) return mapify
  }
  has(key) {
    const data = this.all();
    let checkingAllKeysTheKeyIsIncluded;
  data.map((y) =>{
    const keys = Object.keys(y);
      keys.map(x=>{
        if(y[x] == key) checkingAllKeysTheKeyIsIncluded = true;
      })
    });
    if(!checkingAllKeysTheKeyIsIncluded) return false
    return true
  } 
  robustSearch(key) {
    const data = this.all();
    let checkingAllKeysTheKeyIsIncluded;
  data.map((y) =>{
    const keys = Object.keys(y);
      keys.map(x=>{
        if(y[x] == key) checkingAllKeysTheKeyIsIncluded = y;
      })
    });
    if(checkingAllKeysTheKeyIsIncluded) return checkingAllKeysTheKeyIsIncluded
    return false
  } 
}
export default Database