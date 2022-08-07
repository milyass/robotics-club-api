const express = require("express")
const eventsRouter = new express.Router()
const eventsController = require("../controllers/events")

eventsRouter.post("/", async (req, res, next) => {
  try {
    
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    const body = {
      ...req.body,
      created_by: user_id
    }
    const result = await eventsController.create(body)
    return res.json({
      result,
    })
  } catch (error) {
    next(error)
  }
});

eventsRouter.get("/", async (req, res, next) => {
  try {
    const query = { ...req.query }
    const result = await eventsController.read(query)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

eventsRouter.patch("/:id", async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    const _id = req.params.id
    const result = await eventsController.update(req.body, user_id, _id)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

eventsRouter.delete("/:id", async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    const _id = req.params.id
    const result = await eventsController.delete(user_id, _id)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

module.exports = eventsRouter;