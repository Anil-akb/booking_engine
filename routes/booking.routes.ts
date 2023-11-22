import { Router } from "express";
import { createReservation, updateBooking, validateHotel } from "../controllers/bookings.controller";

const router = Router()

router.route('/createreservation').post(createReservation);
router.route('/updateBooking/:bookingId/:userId/:status').put(updateBooking);
router.route('/validateHotel/:roomId/:hotelId').get(validateHotel) 


export default router;