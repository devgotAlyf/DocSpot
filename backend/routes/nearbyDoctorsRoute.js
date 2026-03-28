import express from 'express';
import { getNearbyDoctors, getPlacePhoto } from '../controllers/nearbyDoctorsController.js';

const nearbyDoctorsRouter = express.Router();

nearbyDoctorsRouter.get('/', getNearbyDoctors);
nearbyDoctorsRouter.get('/photo', getPlacePhoto);

export default nearbyDoctorsRouter;
