import express from "express";
import indexRoute from "./routes";
const app = express();

app.use(express.json());

app.use(indexRoute);

const port = process.env.PORT || 3000;

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res.status(501).json({
      status: false,
      message: "An error occurred - " + error,
      error: error,
    });
  }
);

// Start the express server on the relevant port
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
