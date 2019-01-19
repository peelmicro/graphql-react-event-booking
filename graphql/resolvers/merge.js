const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const transformEvent = event => {
  if (event) {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event._doc.creator)
    };
  }
  return null;
};

const transformBooking = booking => {
  if (booking) {
    return {
      ...booking._doc,
      _id: booking.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt)
    };
  }
  return null;
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
