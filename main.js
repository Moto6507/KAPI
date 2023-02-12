import express from 'express'
var app = express();
var router = express.Router();
import cors from 'cors'
import path from 'path'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { up } from './v2/uploader.js'
import { user } from './v2/user.js'
import { search } from './v2/search.js'
import { media } from './v2/media.js'
import { 
  create,
  db
} from './v2/adm.js'
/* ___________ importing files and modules __________ */
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cors())
app.disable('x-powered-by')
app.set('trust proxy', 1)
const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 10,
  message: "Multiple requests, wait 10 minutes.",
})
app.use(helmet())
process.on('uncaughtException', err => { 
  console.log(err.stack)
  });
/* ___________ configuring __________ */
app.get('/',router.get('/',async function(req, res){res.redirect('https://karaoke.motg100.repl.co/profile/developer')}));
app.get('/api/v2/users/:ide', user);
app.get('/api/v2/search/:term',search)
app.get('/api/v2/media/:type/:file', media)
app.post('/api/v2/upload',up);
app.post('/api/v2/create',create)
app.post('/api/v2/db',db)
/* ____________ configuring API routes ____________*/
app.listen('3000',()=>console.log("\x1b[34m","[ KAPI ]", "\x1b[0m",": API is online, running on port :", "\x1b[32m", "(3000)"))