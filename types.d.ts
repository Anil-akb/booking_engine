import { Types } from "mongoose";

export type BookingsType = {
    hotel: Types.ObjectId;
    room: Types.ObjectId;
    user: Types.ObjectId;
    userName: String;
    amount: Number;
    payment: Types.ObjectId;
    booking_dates: Date[];
    status: string;
    checkInDate: Date;
    checkOutDate: Date;
    reviews: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}