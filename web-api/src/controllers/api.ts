"use strict";

import { Response, Request, NextFunction } from "express";

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response): void => {
  res.json({
    title: "API Examples",
  });
};
