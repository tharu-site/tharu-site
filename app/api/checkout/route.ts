import { NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      cart,
      total,
    } = body;

    await resend.emails.send({
      from:
        "THARU <onboarding@resend.dev>",

      to: "tharuwatch@gmail.com",

      subject:
        "New THARU Checkout Order",

      html: `
        <h2>New Order</h2>

        <p><strong>Name:</strong> ${firstName} ${lastName}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone}</p>

        <p><strong>Address:</strong> ${address}</p>

        <p><strong>City:</strong> ${city}</p>

        <p><strong>State:</strong> ${state}</p>

        <hr />

        <h3>Cart</h3>

        ${cart
          .map(
            (item: any) => `
            <p>
              ${item.name}
              —
              Qty: ${item.quantity}
              —
              ${item.price}
            </p>
          `
          )
          .join("")}

        <hr />

        <h2>Total: ₦${total.toLocaleString()}</h2>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}