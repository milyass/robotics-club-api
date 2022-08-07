const locales = require("../config/locales/locales.json");

const helpers = {
  /**
   *  Formats A Joi Error To Current Service Format and Language
   * @param  - <String> Type: Joi Error Type ex: "array.min".
   * @param  - <Array> Path: Joi Element Path In Body.
   * @param  - <Object> Context: Joi Context Object.
   * @param  - <Lang> Local To Translate To, Usualy Provided In Request Lang Header.
   * @return - Returns One Formatted Error Object, Message Value Defaults to Not Found if No Translations Available 
   */
   errorFormatter: (type, path, context, lang, original_message ) => {
    return {
      message:
        (locales[lang] && locales[lang][type]) || original_message?.replaceAll('\"', '')?.replaceAll('ref:', ''),
      context,
      path,
    };
  },
  /**
   *  Creates Mongoose Compatible Query Object 
   * @param  - <value> Value To Query
   * @return - Returns Mongoose Compatible Query Object 
   */
  searchFormatter: (value) => {
    const search_queryRegex = new RegExp(`.*${value}.*`, "i");
    return {
      $or: [
        { title: search_queryRegex },
        { description: search_queryRegex }
      ],
    };
  },
  /**
   *  Split Query Array By Char <,>
   * @param  - <String> String To Convert
   * @return - Returns Array 
   */
  arrayFormatter: (value) => value.split(","),
  /**
   *  Creates and Formats Time Value to Current Timezone  
   * @param  - <Date> Time Value must be ISO8601 
   * @return - Returns Date
   */
  timeFormatter: (value) => moment(value).clone().tz(timezone),
  /**
   *  Checks Time Value with Current Timezone and Formats it 
   * @param  - <Date> Time Value must be ISO8601 
   * @return - Returns Date
   */
  timeFormatterWithCheck: (value) => { 
    const formatted_date = moment(value).clone().tz(timezone)
    const current_date = moment().clone().tz(timezone).startOf('day').format("YYYY-MM-DD HH:mm:ss")
    const provided_date = moment(value).clone().tz(timezone).startOf('day').format("YYYY-MM-DD HH:mm:ss")
    const isBefore =  moment(provided_date).isBefore(current_date, 'hours')
    if(isBefore) throw new Error(`provided date is before current date`)
    return formatted_date
  },
  /**
   *  Convert _id Value to String
   * @param  - <String> Value To Query
   * @return - Returns String 
   */
  _idFormatter: (value) => new String(value).toString(),
  /**
   * Creates An Array of Lookup Pipeline Stage From A Collection name array
   * Foreign Field Must Be _id Field.
   * @param  - <Array> Specifies Collection Names
   * @return - Returns Array Of Lookup Pipeline Stages
   */
  lookupFormatter: async (collections) => {
    let result = new Array()
    result = collections.map(collection => {
      return {
        $lookup: {
          from: collection,
          localField: collection,
          foreignField: "_id",
          as: collection
        }
      }
    })
    return result
  },
  /**
   *  Creates An Array of User Lookup/Unwind Pipeline, With A custom Fieldname
   *  Foreign Field Must Be _id Field. 
   * @param  - <String> fieldname: name of output/input field
   * @return - Returns Array with 2 piplines lookup and unwind for each fieldname
   */
  lookupUsersFormatter: (fieldnames) => {
    const pipeline_stages = fieldnames.map(fieldname => [
        {
          $lookup: {
           from: 'users',
           let: { user_id: `$${fieldname}` },
           pipeline: [
              { $match: { $expr: { $eq: [ "$_id", "$$user_id" ] } }, },
              { $project : {
                email: 1,
                name: 1,
                photo: 1,
                _id: 1,
                position: 1,
                place: 1,
             } }
           ],
           as: fieldname
          }
        },
        { $unwind: {
          path: `$${fieldname}` ,
          preserveNullAndEmptyArrays: true
        }}
      ]) 
    return pipeline_stages.flat()
  }
};

module.exports = helpers;
