import express from 'express'
import cookie from "cookie-parser"
import authRoutes from './modules/auth/auth.routes.js'
import workflowRouter from './modules/workflow/workflow.routes.js'


const app = express()
app.use(express.json())
app.use(cookie())


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/workflow', workflowRouter)

export default app