import { Request, Response, NextFunction } from "express";
import Bookings from "../models/booking.model";
import { validateBookingDates } from "../utils/booking.validator.dates";
import mongoose, { Types } from "mongoose";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";

export const createReservation = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    room,
    user,
    hotel,
    userName,
    amount,
    booking_dates,
    checkInDate,
    checkOutDate,
  } = req.body;

  // Validate booking dates
  if (!validateBookingDates(booking_dates)) {
    return res.status(400).json({ message: "Invalid booking dates" });
  }

  try {
    // Check if the room is available for the given dates
    const isRoomAvailable = await isRoomAvailableForDates(room, booking_dates);
    if (!isRoomAvailable) {
      return res
        .status(400)
        .json({ message: "Room is not available for the specified dates" });
    }

    const reservation = new Bookings({
      room,
      user,
      hotel,
      booking_dates,
      userName,
      checkInDate,
      checkOutDate,
      amount,
    });
    const newReservation = await reservation.save();

    res.status(201).json(newReservation);
    console.log(newReservation);
  } catch (error: any) {
   return next(new ErrorHandler(error.message, 400));
  }
});

//change in future
const isRoomAvailableForDates = async (
  roomId: string,
  bookingDates: Date[]
) => {
  try {
    const existingBookings = await Bookings.find({ room: roomId });

    for (const booking of existingBookings) {
      if (datesOverlap(booking.booking_dates, bookingDates)) {
        return false;
      }
    }

    return true;
  } catch (error:any) {
    console.error("Error checking room availability:", error);
    return next(new ErrorHandler(error.message, 400));
  }
};

const datesOverlap = (dates1: Date[], dates2: Date[]) => {
  for (const date1 of dates1) {
    for (const date2 of dates2) {
      if (
        new Date(date1) <= new Date(date2) &&
        new Date(date2) <= new Date(date1)
      ) {
        return true;
      }
    }
  }
  return false;
};


// Update Booking

export const updateBooking = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, userId, status } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(bookingId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid bookingId or userId" });
    }

    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.user = new Types.ObjectId(userId);;
    booking.status = status;

    await booking.save();

    console.log(booking)
    return res.json({ message: "Booking updated successfully", booking });
  } catch (error:any) {
    console.error(error);
  return next(new ErrorHandler(error.message, 500));
  }
});


// Validate Hotel
export const validateHotel = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ error: 'Invalid roomId or hotelId' });
    }

    const isRoomInHotelResult = await isRoomInHotel(roomId, hotelId);

    if (isRoomInHotelResult) {
      return res.json({ message: 'Room belongs to the specified hotel' });
    } else {
      return res.status(404).json({ error: 'Room does not belong to the specified hotel' });
    }
  } catch (error:any) {
    console.error(error);
   return next(new ErrorHandler(error.message, 500));
  }
})

// Function to validate whether a room belongs to a specific hotel
const isRoomInHotel = async (roomId: string, hotelId: string): Promise<boolean> => {
  try {
 
    const bookingWithRoom = await Bookings.findOne({ hotel: hotelId, room: roomId });

    return !!bookingWithRoom; 
  } catch (error) {
    console.error('Error validating hotel:', error);
    throw new Error('Error validating hotel');
  }
};


function next(arg0: ErrorHandler) {
  throw new Error("Function not implemented.");
}

