import { Router } from "express";

const router = Router()

router.post("/start", (req, res) => {
    res.send("Started working on complaint");
})

router.post("/all", (req, res) => {
    res.send("All complaints");
})

router.post("/upload", (req, res) => {
    res.send("Resolved photo uploaded");
})

export default router;