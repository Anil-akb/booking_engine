import  { Model, Schema, model } from "mongoose";
import { validateBookingDates } from "../utils/booking.validator.dates";

import { BookingsType } from "../types";

type BookingsModelType = Model<BookingsType>;

const bookingSchema = new Schema<BookingsType>({
    room_id: {
        type: Schema.Types.ObjectId,
        ref: 'Rooms',
        required: [true, 'Room id is required field']
    },
     customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User id is required field']
    },
    booking_dates: {
        type: [Date],
        required: [true, 'Booking `booking_dates` is required field'],
        validate: [validateBookingDates, 'Please provide valid future dates for `booking_dates`']
    },      
    
    property_id :{
        type: Schema.Types.ObjectId,
        required: [true, 'property id is required ']
    },
    payment_id: {
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'cancel', 'approved', 'rejected', 'in-reviews', 'completed'],
        required: [true, 'Room status is required field.']
    },
   
  
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// updatedAt' field before saving or updating a document
bookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Bookings = model<BookingsType, BookingsModelType>("Bookings", bookingSchema);

export default Bookings; 
