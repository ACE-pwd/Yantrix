import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ResearchPaperRepository } from "../../infrastructure/repositories/ResearchPaper.repository.js";
import { ResearchPaperService } from "../../application/services/ResearchPaper.service.js";
import { AppResponse } from "../../shared/response/AppResponse.js";

const prisma = new PrismaClient();
const researchPaperRepository = new ResearchPaperRepository(prisma);
const researchPaperService = new ResearchPaperService(researchPaperRepository);

export class ResearchPaperController {
  private getUserId(req: Request): string | undefined {
    return req.user?.user_id;
  }

  private getParamId(req: Request): string {
    const { id } = req.params;
    return Array.isArray(id) ? id[0] : id;
  }

  createPaper = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(401).json(new AppResponse(401, null, "Unauthorized"));
        return;
      }

      const paper = await researchPaperService.createPaper(userId, req.body);

      res
        .status(201)
        .json(new AppResponse(201, paper, "Research paper created successfully"));
    } catch (error) {
      next(error);
    }
  };

  getPaperById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const paperId = this.getParamId(req);
      const userId = this.getUserId(req);

      const paper = await researchPaperService.getPaperById(paperId, userId);

      res
        .status(200)
        .json(new AppResponse(200, paper, "Research paper fetched successfully"));
    } catch (error) {
      next(error);
    }
  };

  listMyPapers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(401).json(new AppResponse(401, null, "Unauthorized"));
        return;
      }

      const papers = await researchPaperService.listUserPapers(userId);

      res
        .status(200)
        .json(new AppResponse(200, papers, "Research papers fetched successfully"));
    } catch (error) {
      next(error);
    }
  };

  updatePaper = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const paperId = this.getParamId(req);
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(401).json(new AppResponse(401, null, "Unauthorized"));
        return;
      }

      const paper = await researchPaperService.updatePaper(
        paperId,
        userId,
        req.body,
      );

      res
        .status(200)
        .json(new AppResponse(200, paper, "Research paper updated successfully"));
    } catch (error) {
      next(error);
    }
  };

  deletePaper = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const paperId = this.getParamId(req);
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(401).json(new AppResponse(401, null, "Unauthorized"));
        return;
      }

      await researchPaperService.deletePaper(paperId, userId);

      res
        .status(200)
        .json(new AppResponse(200, null, "Research paper deleted successfully"));
    } catch (error) {
      next(error);
    }
  };
}