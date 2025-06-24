import type { APIRoute } from "astro";
import type { APIPersonalization } from "../../../types";
import { addNetworkJitter } from "~/lib/util.ts";

export const GET: APIRoute = async ({ request }) => {
  const fail = await addNetworkJitter();
  if (fail) {
    return new Response(null, {
      status: 500,
    });
  }
  const trackingId = request.headers.get("Cookie")?.split("; ")?.find(cookie => cookie.startsWith("tracking-id="))?.split("=")[1];
  if (!trackingId) {
    return new Response(null, {
      status: 401,
    });
  }

  const personalizations: APIPersonalization[] = [
    {
      type: "replaceHtml",
      selector: "header.breakout h1",
      html: `<h1 class="max-w-sm">Special Deal for You!</h1>
             <p class="text-xl font-semibold mt-2 max-w-md">Limited time offer - Don't miss out!</p>`,
      css: `
        header.breakout {
          background-image: url('https://api.unsplash.com/photos/random/?orientation=landscape&query=business');
          background-size: cover;
          background-position: center;
          background-blend-mode: overlay;
          background-color: rgba(0, 0, 0, 0.4);
        }
        header.breakout h1 {
          color: #fff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        header.breakout p {
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
      `
    }
  ];

  return new Response(JSON.stringify(personalizations), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
