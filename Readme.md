
# URL shortner API

This is an Express.js application that provides a URL shortening service. It allows users to shorten long URLs and generate QR codes for the shortened URLs. The application also includes Swagger documentation for the API endpoints.

## Features

- Shorten long URLs
- Generate QR codes for shortened URLs
- Redirect to the original URL using the short code
- Swagger documentation for API endpoints

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (for database storage)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
    Create a .env file in the root directory of the project with the following contents:

   ```bash
   BASE_URL=http://localhost:3001
   PORT=3001
   MONGO_URI=your_mongodb_connection_url
   ```
4. **Start the server:**

   ```bash
   npm run start
   ```

5. **API Documentation (Swagger):**
    
    You can view the API documentation using Swagger at the following URL once the          server is running:


   ```bash
   http://localhost:3001/api-docs
    ```
Swagger provides a user-friendly interface to explore the API endpoints. You can test the available routes directly through the documentation.


## Testing the application

 Run this command to test the express app:
```bash
   npm run test
   ```


## Available Endpoints

1. **POST /api/shorten:**
    
    Shorten a given URL and generate a QR code.


#### Request Body:


   ```bash
   {
    "originalUrl": "https://example.com"
   }
   ```


#### Response (201):


   ```bash
   {
  "shortUrl": "http://localhost:3001/api/abc123",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}

   ```


#### Response (400 - Invalid URL):


   ```bash
{
  "message": "Please provide a valid url"
}


   ```

#### Response (500 - Internal server error):


   ```bash
{
  "message": "Internal server error"
}



   ```


2. **GET /api/{shortCode}:**
    
    Redirect to the original URL using the short code.

    ## Parameters:
- shortCode (string) - The short code for the URL.


#### Response (302 - Redirect): Redirects the browser to the original URL.



#### Response (404 - URL Not Found):


   ```bash
   {
  "message": "Url not found"
}


   ```


#### Response (500 - Internal server error):


   ```bash
{
  "message": "Internal server error"
}

   ```


## Testing the API
To test the API, you can use tools such as:

- Postman: Import the API collection from Swagger docs.
- cURL: Use curl commands to send requests to the endpoints.

### Example cURL command to shorten a URL:

   ```bash
curl -X POST http://localhost:3001/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com"}'


   ```

### Example cURL command to test URL redirection:

   ```bash
curl -X GET http://localhost:3001/api/abc123

   ```
