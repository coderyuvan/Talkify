class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
      super(message)
      this.statusCode=statusCode
      this.data=null // read this.data field
      this.errors=errors
      this.message=message
      this.success=false;

      if(stack){
        this.stack=stack
      } else{
        Error.captureStackTrace(this,this.constructor)
      }

    }
}

export {ApiError}