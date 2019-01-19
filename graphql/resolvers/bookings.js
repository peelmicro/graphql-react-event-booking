const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated.");
      }
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated.");
      }
      const fectchedEvent = await Event.findById(args.eventId);
      if (!fectchedEvent) {
        throw new Error("Event Id does not exist");
      }
      const booking = new Booking({
        user: req.userId,
        event: fectchedEvent
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated.");
      }
      const booking = await Booking.findById(args.bookingId).populate("event");
      if (!booking) {
        throw new Error("Booking Id does not exist");
      }
      await Booking.deleteOne({ _id: args.bookingId });
      return transformEvent(booking.event);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
