import { Router } from "express";

const workflowRouter = Router();

workflowRouter.get("/", (req, res) => {
    res.send("Workflow API");
});

export default workflowRouter;