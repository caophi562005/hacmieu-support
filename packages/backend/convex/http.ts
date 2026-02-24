import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/sepay-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const isValid = await validateRequest(request);

      if (!isValid) {
        return new Response("Unauthorized", { status: 401 });
      }

      const data = await request.json();

      if (data.transferType === "in") {
        const amountIn = data.transferAmount;
        const paymentCode = data.code
          ? String(data.code)
          : String(data.content);

        if (!paymentCode) {
          return new Response("Missing payment code", { status: 400 });
        }

        await ctx.runMutation(internal.system.payments.processWebhook, {
          code: paymentCode,
          transferAmount: amountIn,
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: "Webhook processed" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error: any) {
      console.error("Error processing SePay Webhook:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error?.message || "Internal Error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

async function validateRequest(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  const expectedKey = process.env.SEPAY_WEBHOOK_KEY;

  if (!authHeader || !expectedKey) {
    return false;
  }

  // SePay sends the token as: 'Apikey {key}'
  const [, token] = authHeader.split(" ");

  return token === expectedKey;
}

export default http;
