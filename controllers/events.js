const Event = require("../models/event");
const {
  validateCreate,
  validateRead,
  validateUpdate,
  validateDelete,
} = require("../validators/events");
const { Types: { ObjectId } } = require('mongoose');
const { lookupUsersFormatter } = require("../helpers");

module.exports = {
  create: async (body) => {
    const data = await validateCreate.validateAsync(
      { ...body },
      { abortEarly: false, stripUnknown: true }
    );
    const newEvent = new Event(data);
    return newEvent.save();
  },
  read: async (query) => {
    const data = await validateRead.validateAsync(query, {
      abortEarly: false,
      stripUnknown: true,
    });

    const options = {
      page: data.page,
      limit: data.limit,
      allowDiskUse: true,
    };

    const user_lookup_stages = await lookupUsersFormatter([
      "created_by",
      "members",
    ]);

    const pipeline = [
      data.id && { $match: { _id: ObjectId(data.id) } },
      data.created_by && { $match: { created_by: ObjectId(data.created_by) } },
      data.search_query && { $match: data.search_query },
      data.visibility && { $match: { visibility: { $in: data.visibility } } },
      data.start_at && { $match: { start_at: { $gte: data.start_at } } },
      data.end_at && { $match: { end_at: { $lte: data.end_at } } },
      data.members && { $match: { members: { $in: data.members } } },
      data.time_restricted && {
        $match: { time_restricted: data.time_restricted },
      },
      data.finished && { $match: { finished: data.finished } },
      { $sort: { created_at: data.sort } },
      ...user_lookup_stages,
    ].filter((pipeline) => pipeline);

    const aggregation = Event.aggregate(pipeline);
    return Event.aggregatePaginate(aggregation, options);
  },
  update: async (body, created_by, _id) => {
    const data = await validateUpdate.validateAsync(
      { ...body, _id, created_by },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );
    data.last_updated = new Date();
    delete data._id
    delete data.created_by
    await Event.updateOne({ created_by, _id }, { $set: data });
    const { docs } = await module.exports.read({ id: String(_id) });
    return docs[0];
  },
  delete: async (created_by, _id) => {
    const data = await validateDelete.validateAsync(
      { _id, created_by },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );
    return Event.deleteOne(data);
  },
};
