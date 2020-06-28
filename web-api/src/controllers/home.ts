import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response): void => {
  res.json({
    title: "Home",
  });
};
