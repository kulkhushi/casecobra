import { db } from "@/db";
import { stripe } from "@/utils/Strapi";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const signature = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.SRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  if (!signature) {
    throw new Error("signature is missing");
  }

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing User Email Address");
      }
      const session = event.data.object as Stripe.Checkout.Session;
      const { userID, orderID } = session.metadata || {
        userID: null,
        orderID: null,
      };
      if (!userID || !orderID) {
        throw new Error("Missing User or Order ID");
      }

      // Access billing and shipping address from the session
      const billingAddress = session!.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      // Save the order details to your database
      await db.order.update({
        where: {
          id: orderID,
        },
        data: {
          isPaid: true,
          shippmentAdress: {
            create: {
              name: session.customer_details?.name!,
              street: shippingAddress!.line1!,
              city: shippingAddress!.city!,
              postalCode: shippingAddress!.postal_code!,
              country: shippingAddress!.country!,
              state: shippingAddress!.state!,
            },
          }, //
          BillingAddress: {
            create: {
              name: session.customer_details?.name!,
              street: billingAddress!.line1!,
              city: billingAddress!.city!,
              postalCode: billingAddress!.postal_code!,
              country: billingAddress!.country!,
              state: billingAddress!.state!,
            },
          }, //
        },
      });
    }
    return NextResponse.json(
      { message: "Webhook received", OK: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Somthing went wrong" },
      { status: 500 }
    );
  }
};
