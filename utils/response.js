class Response {
    success(response, statusCode, values, message) {
        let data = {
            success: true,
            message: message,
            data: values
        }
        response.status(statusCode).json(data)
        response.end()
    }

    error(response, statusCode, message, error) {
        let data = {
            success: false,
            message: message,
            error: error
        }
        response.status(statusCode).json(data)
        response.end()
    }
}

module.exports = new Response()