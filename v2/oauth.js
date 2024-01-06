import express from 'express'
var app = express()
import { 
  get
} from './../functions.js'
export const auth = express.Router().get('/api/v2/autenticator', async function (req, res) {
  if(!req.headers.authorization) return res
  .status(403)
  .json({
    status: 403,
    message:"Not authorized"
  });
var 
  aut = req.
});