import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};

/**
 * Not found middleware
 */
export const notFound = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    error: `Not found - ${req.originalUrl}`
  });
};