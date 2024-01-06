import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { getMedia } from './v3/getMedia.js'
import { getInfos } from './v3/getInfos.js'
import { traffic } from './v3/traffic.js'
const apiVersion = "/api/v3/"
const app = express();
// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: 'http://karaoke.motg100.repl.co',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(compression());
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
process.on('uncaughtException', (err) => {
	console.log(err.stack);
});

// Routes
app.get('/', (req, res) =>res.redirect('https://karaoke.motg100.repl.co/'))
app.get(apiVersion + "get/media/:type/:opcionalParam", getMedia);
app.get(apiVersion + "get/infos/:identifier", getInfos)
app.get(apiVersion + "traffic", traffic)

// API Configuration
const PORT = 3000;
app.listen(PORT, () => {
	console.log("\x1b[34m", "[ KAPI ]", "\x1b[0m", ": API is online, running on port :", "\x1b[32m", `(${PORT})`);
});