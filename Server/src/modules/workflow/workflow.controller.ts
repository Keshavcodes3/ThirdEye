import { Request, Response } from 'express';

export const create = (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Not Implemented',
  });
};

export const getAll = (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Not Implemented',
  });
};

export const getById = (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Not Implemented',
  });
};

export const update = (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Not Implemented',
  });
};

export const deleteWorkflow = (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Not Implemented',
  });
};
