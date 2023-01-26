/* eslint-disable object-shorthand */
/* eslint-disable quote-props */
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import Server from 'socket.io'

import indexRoutes from './routes/indexRoutes'
import usersRoutes from './routes/usersRoutes'
import authRoutes from './routes/authRoutes'
import filesRoutes from './routes/filesRoutes'

class Service {
  public app: express.Application

  // The contructor will be the first code that is executed when an instance of the class is declared.
  constructor () {
    this.app = express()
    this.config()
    this.routes()
  }

  config () { 
    // MongoDB settings
    mongoose.Promise = require('bluebird');
    const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/cyber'
    mongoose.connect(MONGO_URI)
      .then(db => console.log('DB is connected'))
    
    // Settings
    this.app.set('port', process.env.PORT || 3000)

    // Middlewares
    this.app.use(morgan('dev')) // Allows to see by console the petitions that eventually arrive.
    this.app.use(express.json()) // So that Express parses JSON as the body structure, as it doens't by default.
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(helmet()) // Offers automatically security in front of some cracking attacks.
    this.app.use(compression()) // Allows to send the data back in a compressed format.
    this.app.use(cors()) // It automatically configures and leads with CORS issues and configurations.
  }

  routes () {
    this.app.use(indexRoutes)
    this.app.use('/api/users', usersRoutes)
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/files', filesRoutes)
  }

  start () {
    const httpServer = this.app.listen(this.app.get('port'), () => {
      console.log('Server listening on port', this.app.get('port'))
    })
    const io = new Server(httpServer)
      io.on('connection', (socket: any) => {
        console.log('Connected...', socket.id)
      
        socket.on('message', (message:any) => {
          io.emit('message', message);
        });
      
        socket.on('disconnect', () => {
          console.log('a user disconnected!');
        });
      });
  }
}

const service = new Service()
service.start()