class AppError extends Error {
    constructor(message, statusCode) {
     super(message);

     this.statusCode = statusCode;
     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
     //if status code start with 4 then status becomes 'fail' otherwise 'error'
     this.isOperational = true;
     //bcoz all these error handled are operational errors

     Error.captureStackTrace(this, this.constructor);
  
    }
}

module.exports = AppError;