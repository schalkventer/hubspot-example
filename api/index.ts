import { Hono } from "hono";
import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Schalk" });
});

app.get("/about", (c) => {
  return c.json({ message: "This is about info" });
});

export default handle(app);
