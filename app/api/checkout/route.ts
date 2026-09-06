import { NextResponse } from "next/server";

import { Resend } from "resend";

import {
  createClient,
} from "@supabase/supabase-js";

/*
 * RESEND
 */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/*
 * SUPABASE SERVICE CLIENT
 *
 * This route runs on the server.
 *
 * IMPORTANT:
 *
 * SUPABASE_SERVICE_ROLE_KEY must NEVER
 * be exposed to the browser.
 */

const supabase =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

/*
 * EXTRACT REAL PRODUCT UUID
 *
 * Cart IDs can look like:
 *
 * productUUID
 * productUUID-black
 * productUUID-brown
 *
 * order_items.product_id must receive
 * only the real product UUID.
 */

const getProductId = (
  id: unknown
) => {
  if (
    typeof id !== "string"
  ) {
    return null;
  }

  const match =
    id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );

  return match
    ? match[0]
    : null;
};

/*
 * POST
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * READ REQUEST BODY
     */

    const body =
      await request.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      country,
      cart,
      reference,
    } = body;

    /*
     * BASIC VALIDATION
     */

    if (
      !email ||
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !state ||
      !cart ||
      !Array.isArray(cart) ||
      cart.length === 0 ||
      !reference
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required order information.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * LOAD CURRENT STORE SETTINGS
     *
     * The browser does NOT decide:
     *
     * - delivery fee
     * - whether orders are open
     * - currency
     *
     * Those values come directly
     * from Supabase.
     */

    const {
      data: storeSettings,
      error: settingsError,
    } =
      await supabase
        .from("store_settings")
        .select(
          "delivery_fee, accepting_orders, currency"
        )
        .limit(1)
        .maybeSingle();

    /*
     * SETTINGS DATABASE ERROR
     */

    if (settingsError) {
      console.error(
        "Store settings error:",
        settingsError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load store settings.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * SETTINGS RECORD DOES NOT EXIST
     */

    if (!storeSettings) {
      return NextResponse.json(
        {
          error:
            "Store settings are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * CHECK WHETHER STORE ACCEPTS ORDERS
     *
     * This is the server-side protection.
     *
     * Even if somebody tries to bypass
     * the checkout button in the browser,
     * the API will not create an order
     * while the store is paused.
     */

    if (
      storeSettings.accepting_orders !==
      true
    ) {
      return NextResponse.json(
        {
          error:
            "Orders are currently paused. Please check back later.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * DEFAULT DELIVERY FEE
     *
     * This is used only when the selected
     * state does not have an active
     * state-specific delivery fee.
     */

    const defaultDeliveryFee =
      Number(
        storeSettings.delivery_fee
      ) || 0;

    /*
     * FIND STATE-SPECIFIC DELIVERY FEE
     *
     * The state comes from the checkout
     * form.
     *
     * IMPORTANT:
     *
     * We query the database directly on
     * the server instead of trusting any
     * delivery fee sent by the browser.
     */

    const normalizedState =
      String(state)
        .trim();

    const {
  data: stateDeliveryFee,
  error: stateDeliveryFeeError,
} =
  await supabase
    .from("delivery_fees")
    .select(
      "state, fee, active"
    )
    .ilike(
      "state",
      normalizedState
    )
    .eq(
      "active",
      true
    )
    .maybeSingle();

    /*
     * DELIVERY FEE DATABASE ERROR
     */

    if (
      stateDeliveryFeeError
    ) {
      console.error(
        "State delivery fee error:",
        stateDeliveryFeeError
      );

      return NextResponse.json(
        {
          error:
            "Unable to determine the delivery fee for this state.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * SERVER-AUTHORITATIVE DELIVERY FEE
     *
     * State-specific fee takes priority.
     *
     * Otherwise use the default fee.
     */

    const deliveryFee =
      stateDeliveryFee &&
      stateDeliveryFee.active
        ? Number(
            stateDeliveryFee.fee
          )
        : defaultDeliveryFee;

    /*
     * VALIDATE DELIVERY FEE
     */

    if (
      !Number.isFinite(
        deliveryFee
      ) ||
      deliveryFee < 0
    ) {
      console.error(
        "Invalid delivery fee:",
        {
          state:
            normalizedState,

          stateDeliveryFee,

          defaultDeliveryFee,

          deliveryFee,
        }
      );

      return NextResponse.json(
        {
          error:
            "Invalid delivery fee configuration.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * VERIFY PAYMENT WITH PAYSTACK
     */

    const paystackResponse =
      await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json",
          },

          cache: "no-store",
        }
      );

    const paystackData =
      await paystackResponse.json();

    /*
     * PAYMENT VERIFICATION FAILED
     */

    if (
      !paystackResponse.ok ||
      !paystackData.status ||
      paystackData.data?.status !==
        "success"
    ) {
      console.error(
        "Paystack verification failed:",
        paystackData
      );

      return NextResponse.json(
        {
          error:
            "Payment could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * VERIFY PAYMENT EMAIL
     */

    const paystackEmail =
      paystackData.data
        ?.customer?.email;

    if (
      paystackEmail &&
      paystackEmail
        .toLowerCase() !==
        String(email)
          .trim()
          .toLowerCase()
    ) {
      console.error(
        "Payment email mismatch:",
        {
          paystackEmail,
          checkoutEmail:
            email,
          reference,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment customer information could not be verified.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * PREVENT DUPLICATE ORDERS
     *
     * If the same Paystack reference
     * has already been processed,
     * return the existing order instead
     * of creating another one.
     */

    const {
      data: existingOrder,
      error:
        existingOrderError,
    } =
      await supabase
        .from("orders")
        .select(
          "id, order_number, total"
        )
        .eq(
          "payment_reference",
          reference
        )
        .maybeSingle();

    /*
     * DUPLICATE CHECK FAILED
     */

    if (existingOrderError) {
      console.error(
        "Existing order check error:",
        existingOrderError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify existing order.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ORDER ALREADY EXISTS
     */

    if (existingOrder) {
      return NextResponse.json({
        success: true,

        orderId:
          existingOrder.id,

        orderNumber:
          existingOrder.order_number,

        total:
          existingOrder.total,

        alreadyExists: true,
      });
    }

    /*
     * PREPARE CART ITEMS
     */

    const preparedItems =
      cart.map(
        (item: any) => {

          /*
           * EXTRACT REAL PRODUCT UUID
           */

          const productId =
            getProductId(
              item.id
            );

          if (!productId) {
            throw new Error(
              `Invalid product ID: ${item.id}`
            );
          }

          /*
           * CONVERT PRICE TO NUMBER
           */

          const numericPrice =
            Number(
              String(
                item.price
              ).replace(
                /[₦,]/g,
                ""
              )
            );

          /*
           * CONVERT QUANTITY TO NUMBER
           */

          const quantity =
            Number(
              item.quantity
            ) || 1;

          /*
           * VALIDATE PRICE
           */

          if (
            !Number.isFinite(
              numericPrice
            ) ||
            numericPrice < 0
          ) {
            throw new Error(
              `Invalid product price: ${item.price}`
            );
          }

          /*
           * VALIDATE QUANTITY
           */

          if (
            !Number.isInteger(
              quantity
            ) ||
            quantity < 1
          ) {
            throw new Error(
              `Invalid quantity for product: ${item.name}`
            );
          }

          /*
           * PREPARED ITEM
           */

          return {
            productId,

            productName:
              item.name,

            quantity,

            unitPrice:
              numericPrice,

            totalPrice:
              numericPrice *
              quantity,

            imageUrl:
              item.image ||
              null,
          };
        }
      );

    /*
     * SERVER CALCULATES SUBTOTAL
     *
     * We deliberately do not use
     * subtotal from the browser.
     */

    const calculatedSubtotal =
      preparedItems.reduce(
        (
          sum,
          item
        ) =>
          sum +
          item.totalPrice,
        0
      );

    /*
     * SERVER CALCULATES TOTAL
     *
     * This uses:
     *
     * calculatedSubtotal
     * +
     * state-specific delivery fee
     *
     * or the default delivery fee
     * if no active state fee exists.
     */

    const expectedTotal =
      calculatedSubtotal +
      deliveryFee;

    /*
     * PAYSTACK VERIFIED AMOUNT
     *
     * Paystack returns the amount
     * in kobo.
     *
     * Example:
     *
     * ₦187,000
     * =
     * 18,700,000 kobo
     */

    const verifiedAmount =
      Number(
        paystackData.data.amount
      ) / 100;

    /*
     * VALIDATE CALCULATED AMOUNTS
     */

    if (
      !Number.isFinite(
        verifiedAmount
      ) ||
      !Number.isFinite(
        calculatedSubtotal
      ) ||
      !Number.isFinite(
        deliveryFee
      ) ||
      !Number.isFinite(
        expectedTotal
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * VERIFY PAYSTACK AMOUNT
     *
     * Compare Paystack's verified
     * payment against the amount
     * calculated by our server.
     */

    if (
      Math.round(
        verifiedAmount * 100
      ) !==
      Math.round(
        expectedTotal * 100
      )
    ) {
      console.error(
        "Payment amount mismatch:",
        {
          verifiedAmount,

          expectedTotal,

          calculatedSubtotal,

          deliveryFee,

          state:
            normalizedState,

          stateDeliveryFee,

          reference,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment amount does not match the order.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * GENERATE ORDER NUMBER
     */

    const orderNumber =
      `THR-${Date.now()
        .toString()
        .slice(-8)}`;

    /*
     * CREATE ORDER
     */

    const {
      data: order,
      error: orderError,
    } =
      await supabase
        .from("orders")
        .insert({
          order_number:
            orderNumber,

          customer_email:
            String(email)
              .trim()
              .toLowerCase(),

          first_name:
            String(firstName)
              .trim(),

          last_name:
            String(lastName)
              .trim(),

          phone:
            String(phone)
              .trim(),

          address:
            String(address)
              .trim(),

          city:
            city
              ? String(city)
                  .trim()
              : null,

          state:
            normalizedState,

          country:
            country
              ? String(country)
                  .trim()
              : "Nigeria",

          /*
           * SERVER-CALCULATED VALUES
           */

          subtotal:
            calculatedSubtotal,

          delivery_fee:
            deliveryFee,

          total:
            verifiedAmount,

          /*
           * PAYMENT STATUS
           */

          payment_status:
            "paid",

          /*
           * INITIAL ORDER STATUS
           */

          order_status:
            "pending",

          /*
           * PAYSTACK REFERENCE
           */

          payment_reference:
            reference,
        })
        .select()
        .single();

    /*
     * ORDER CREATION FAILED
     */

    if (orderError) {
      console.error(
        "Create order error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create order.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * CREATE ORDER ITEMS
     */

    const orderItems =
      preparedItems.map(
        (item) => ({
          order_id:
            order.id,

          product_id:
            item.productId,

          product_name:
            item.productName,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          total_price:
            item.totalPrice,

          image_url:
            item.imageUrl,
        })
      );

    const {
      error: itemsError,
    } =
      await supabase
        .from("order_items")
        .insert(
          orderItems
        );

    /*
     * ORDER ITEMS FAILED
     */

    if (itemsError) {
      console.error(
        "Create order items error:",
        itemsError
      );

      /*
       * Remove the incomplete order.
       */

      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      return NextResponse.json(
        {
          error:
            "Unable to create order items.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * SEND ADMIN EMAIL
     */

    const emailResult =
      await resend.emails.send({
        from:
          "THARU <onboarding@resend.dev>",

        to:
          "tharuwatch@gmail.com",

        subject:
          `New THARU Order — ${orderNumber}`,

        html: `
          <h2>New THARU Order</h2>

          <p>
            <strong>Order:</strong>
            ${orderNumber}
          </p>

          <p>
            <strong>Name:</strong>
            ${firstName} ${lastName}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

          <p>
            <strong>Address:</strong>
            ${address}
          </p>

          <p>
            <strong>City:</strong>
            ${city || "N/A"}
          </p>

          <p>
            <strong>State:</strong>
            ${normalizedState}
          </p>

          <p>
            <strong>Country:</strong>
            ${
              country ||
              "Nigeria"
            }
          </p>

          <hr />

          <h3>Items</h3>

          ${preparedItems
            .map(
              (item) => `
                <p>
                  <strong>
                    ${item.productName}
                  </strong>
                  —
                  Qty:
                  ${item.quantity}
                  —
                  ₦${item.unitPrice.toLocaleString(
                    "en-NG"
                  )}
                </p>
              `
            )
            .join("")}

          <hr />

          <p>
            <strong>Subtotal:</strong>
            ₦${calculatedSubtotal.toLocaleString(
              "en-NG"
            )}
          </p>

          <p>
            <strong>Delivery:</strong>
            ₦${deliveryFee.toLocaleString(
              "en-NG"
            )}
          </p>

          <p>
            <strong>Delivery State:</strong>
            ${normalizedState}
          </p>

          <h2>
            Total:
            ₦${verifiedAmount.toLocaleString(
              "en-NG"
            )}
          </h2>

          <p>
            <strong>
              Payment Reference:
            </strong>
            ${reference}
          </p>
        `,
      });

    /*
     * DO NOT DELETE THE ORDER
     * IF EMAIL FAILS.
     *
     * Payment has already been verified
     * and the order has been saved.
     */

    if (
      emailResult.error
    ) {
      console.error(
        "Order email error:",
        emailResult.error
      );
    }

    /*
     * SUCCESS
     */

    return NextResponse.json({
      success: true,

      orderId:
        order.id,

      orderNumber:
        order.order_number,

      total:
        verifiedAmount,
    });

  } catch (
    error
  ) {

    console.error(
      "Checkout API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}