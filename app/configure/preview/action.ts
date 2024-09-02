"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/components/Validator";
import { db } from "@/db";
import { stripe } from "@/utils/Strapi";
import { auth } from "@clerk/nextjs/server";
import { Order as OrderType } from "@prisma/client";
import { config } from "process";

export const saveAllCofigAction = async ({ id }: { id: string }) => {
  const user = auth();
  console.log('id',user.userId);

  if (!user) {
    throw new Error("User Not Authenticated!Please sign In");
  }

  try {
    const cofigData = await db.configuration.findFirst({
      where: {
        id: id,
      },
    });

    if (!cofigData) {
      throw new Error("No Config Data Found");
    }
    const { finishes, metrials } = cofigData;

    let Subtotal = BASE_PRICE;
    if (finishes === "textured") Subtotal += PRODUCT_PRICES.finish.textured;
    if (metrials === "polycarbonate")
      Subtotal += PRODUCT_PRICES.material.polycarbonate;

    let order: OrderType | null | undefined= undefined;

    order = await db.order.findFirst({
        where: {
        configurationId: id,
          userId: user?.userId as string,
        },
    })


    if (!order) {
        order = await db.order.create({
          data: {
            configurationId: cofigData.id,
            userId: user?.userId as string,
            totalPrice: 100,           
          },
        });
    }
  //  console.log("orderrrrrrrr",order);
   
    const product = await stripe.products.create({
        name: "cofigData.name",
       images:[cofigData.imageUrl],
       default_price_data:{
        currency:'USD',
        unit_amount: Subtotal
       }
      })
   // console.log("orderrrrrrrr",product);
    
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{price: product.default_price as string, quantity: 1}],
        mode: 'payment',
        success_url: `${process.env.SITE_ORIGIN}/thank-you?id=${order.id}`,
         cancel_url:  `${process.env.SITE_ORIGIN}/configure/preview?id=${cofigData.id}`,
         shipping_address_collection:{allowed_countries: ['US']},
        metadata: {
          userID: user.userId,
          orderID: order.id
        },
      });
      //console.log("session",session)
      return {url:session.url}

  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Somthing is Wrong",
    };
  }
};
