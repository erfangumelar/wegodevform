import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body.umur)
    res.json({
        title: `Hello ${req.query.nama}`
    })
});

router.post('/', (req, res) => {
    console.log(req.body)
    res.json({
        title: `Hello ${req.query.nama}`
    })
});

export default router