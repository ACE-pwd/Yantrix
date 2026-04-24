import { Router } from "express";
import { ResearchPaperController } from "../controllers/ResearchPaper.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

const researchPaperController = new ResearchPaperController();

router.post("/papers", authenticate, researchPaperController.createPaper);

router.get("/my-papers", authenticate, researchPaperController.listMyPapers);

router.get("/papers/:id", authenticate, researchPaperController.getPaperById);

router.patch("/papers/:id", authenticate, researchPaperController.updatePaper);

router.delete("/papers/:id", authenticate, researchPaperController.deletePaper);

export default router;