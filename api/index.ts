import { Hono } from "hono";
import { handle } from "hono/vercel";

const HUBSPOT_REDIRECT_URI = "http://localhost:3000/api/auth";
const HUBSPOT_CLIENT_ID = "60fe93da-295e-477d-ab30-6dcd4155fd73";
const HUBSPOT_CLIENT_SECRET = "eda86b3b-e714-43ab-ad32-6c1a58e76736";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

type Token = {
  token_type: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

// Hubspot hits this endpoint "/api/auth", sends along as part of the URL a query parameter called "code"
app.get("/auth", async (c) => {
  const code = c.req.query("code")!;

  const response = await fetch(
    `https://api.hubapi.com/oauth/v1/token?grant_type=authorization_code&client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URI}&client_secret=${HUBSPOT_CLIENT_SECRET}&code=${code}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { data }: { data: Token } = await response.json();
  console.log(data);

  // c.cookie("username", "JohnDoe", {
  //   maxAge: 60 * 60 * 24, // Expires in 1 day
  //   httpOnly: true, // Cookie is only accessible via HTTP(S), not JavaScript
  //   secure: true, // Cookie is sent only over HTTPS
  //   path: "/", // Cookie is accessible on the whole site
  //   sameSite: "strict", // Prevents CSRF attacks
  // });

  return c.json({ data: JSON.stringify(data) });
});

export default handle(app);

fetch("https://hubspot-example.vercel.app/api/about")
  .then((res) => res.json())
  .then(console.log);
