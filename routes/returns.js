const expess = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const moment = require("moment");
const mongoose = require("mongoose");
const router = expess.Router();

const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");

router.post("/", auth, async (req, res) => {
  const { customerId, movieId } = req.body;

  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.dateReturned = new Date();

  // Start a sesssion to perform transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  // Update rentals data
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save({ session });

  // Increment movie stock
  await Movie.update(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } },
    { session }
  );

  // Commit transactions
  await session.commitTransaction();
  session.endSession();

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
