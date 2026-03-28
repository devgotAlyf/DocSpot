import express from 'express'
import cors from 'cors'
import './config/env.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import nearbyDoctorsRouter from './routes/nearbyDoctorsRoute.js'
import { supabase } from './config/supabase.js'

// app config
const app = express()
const port = process.env.PORT || 4000

connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)
app.use('/api/nearby-doctors', nearbyDoctorsRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase.from('users').select('id').limit(1)
  if (!error) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database is NOT connected: ' + error.message);
  }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))
