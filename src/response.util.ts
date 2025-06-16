// response.util.ts
export interface ApiResponse<T> {
    status: number;
    message: string;
    result?: T;  // Optional field, only used if there's a result (data)
  }
  
  export function createResponse<T>(status: number, message: string, result?: T): ApiResponse<T> {
    return {
      status,
      message,
      result,
    };
  }
  