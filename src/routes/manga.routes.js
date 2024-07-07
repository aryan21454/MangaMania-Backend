import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addManga, deleteManga, getManga, updateManga } from "../controllers/manga.controller.js";
const router = Router();
router.route("/addManga").post(verifyJWT, addManga);
router.route("/deleteManga/:id").delete(verifyJWT,deleteManga);
router.route("/updateManga/:id").put(verifyJWT,updateManga);
router.route("/getMangaList").get(verifyJWT,getManga);



export default router;