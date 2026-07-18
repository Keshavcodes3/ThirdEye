
export const apiSuccessResponse = (
  code: number,
  message: string,
  data: any = null
) => {
  return {
    code,
    message,
    data,
    success: true
  }
}

export const apiFailedResponse = (
  code: number,
  message: string,
  data: any = null
) => {
  return {
    code,
    message,
    data,
    success: false,
    timestamp: new Date().toISOString()
  };
};

