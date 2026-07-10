declare namespace Express {
  //for TS adding  type  to Express Reqiest type
  interface Request {
    userId?: number;
  }
}
