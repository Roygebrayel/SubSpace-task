import express  from "express";
import { dataAnalysis,  searchBlog } from "./controller.js";

const router = express.Router();

router.get('/blog-stats',dataAnalysis);
router.get('/blog-search',searchBlog)



export default router;
