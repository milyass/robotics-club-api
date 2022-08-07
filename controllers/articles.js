const Article = require("../models/article");
const {
  validateCreate,
  validateRead,
  validateUpdate,
  validateDelete,
} = require("../validators/articles");
const {
  Types: { ObjectId },
} = require("mongoose");
const { lookupUsersFormatter } = require("../helpers");

module.exports = {
  create: async (body) => {
    const data = await validateCreate.validateAsync(
      { ...body },
      { abortEarly: false, stripUnknown: true }
    );
    const newArticle = new Article(data);
    return newArticle.save();
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

    const user_lookup_stages = await lookupUsersFormatter(["created_by"]);

    const pipeline = [
      data.id && { $match: { _id: ObjectId(data.id) } },
      data.created_by && { $match: { created_by: ObjectId(data.created_by) } },
      data.search_query && { $match: data.search_query },
      data.tags && { $match: { tags: { $in: data.tags } } },
      { $sort: { created_at: data.sort } },
      ...user_lookup_stages,
    ].filter((pipeline) => pipeline);

    const aggregation = Article.aggregate(pipeline);
    return Article.aggregatePaginate(aggregation, options);
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
    await Article.updateOne({ created_by, _id }, { $set: data });
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
    return Article.deleteOne(data);
  },
};
