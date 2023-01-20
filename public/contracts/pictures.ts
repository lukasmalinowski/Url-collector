interface Request {
  query: {
    from: string;
    to: string;
  };
}

interface SuccessResponse {
  urls: string[];
}

interface ErrorResponse {
  error?: string;
}
