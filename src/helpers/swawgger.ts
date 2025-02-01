// src/swagger.ts
import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import data from "../../package.json" with {type: "json"}

import dotenv from "dotenv";
dotenv.config();

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "API for shortening URLs and generating QR codes",
      },
      servers: [
        {
          url: process.env.BASE_URL || "http://localhost:3000",
          description: "Production Server",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger documentation is available at ${process.env.BASE_URL}/api-docs`);
}

export default swaggerDocs;
