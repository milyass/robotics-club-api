const express = require("express")
const articlesRouter = new express.Router()
const articlesController = require("../controllers/articles")

articlesRouter.post("/", async (req, res, next) => {
  try {
    
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    console.log(user_id)
    const body = {
      ...req.body,
      created_by: user_id
    }
    const result = await articlesController.create(body)
    return res.json({
      result
    })
  } catch (error) {
    next(error)
  }
});

articlesRouter.get("/", async (req, res, next) => {
  try {
    const query = { ...req.query }
    const result = await articlesController.read(query)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

articlesRouter.patch("/:id", async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    const _id = req.params.id
    const result = await articlesController.update(req.body, user_id, _id)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || '6154757679bf152efa091005'
    const _id = req.params.id
    const result = await articlesController.delete(user_id, _id)
    return res.json({ status: "success", result });
  } catch (error) {
    next(error)
  }
});

module.exports = articlesRouter;