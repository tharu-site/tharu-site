import { NextResponse } from "next/server";

import { Resend } from "resend";

import { supabase } from "@/lib/supabase";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      phone,
    } = body;

    /* SAVE TO SUPABASE */
    await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          name,
          email,
          phone,
        },
      ]);

    /* SEND EMAIL TO THARU */
    await resend.emails.send({

      from:
        "THARU <onboarding@resend.dev>",

      to:
        "tharuwatch@gmail.com",

      subject:
        "New THARU Newsletter Subscriber",

      html: `
        <div style="font-family:sans-serif;padding:20px;">

          <h2>
            New Newsletter Subscriber
          </h2>

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone}
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}