import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "STRIPE_SECRET_KEY environment variable is not configured on this server",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { packageId, name, price, credits, currency = "USD" } = body;

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const unitAmount = Math.round(Number(price || 49) * 100);

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append(
      "success_url",
      `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&package=${encodeURIComponent(
        name || "Assessment Credits"
      )}&credits=${credits || 50}&amount=${price || 49}&currency=${currency}`
    );
    params.append(
      "cancel_url",
      `${origin}/payment/cancel?package=${encodeURIComponent(name || "Assessment Credits")}`
    );
    params.append("line_items[0][price_data][currency]", currency.toLowerCase());
    params.append("line_items[0][price_data][unit_amount]", String(unitAmount));
    params.append(
      "line_items[0][price_data][product_data][name]",
      `AssessmentForces - ${name || "Recruiter Pack"} (${credits || 50} Credits)`
    );
    params.append(
      "line_items[0][price_data][product_data][description]",
      `${credits || 50} Assessment Invitations with Automated Proctoring & Cloud Code Execution`
    );
    params.append("line_items[0][quantity]", "1");
    params.append("payment_method_types[0]", "card");
    if (packageId) {
      params.append("metadata[packageId]", String(packageId));
    }
    if (credits) {
      params.append("metadata[credits]", String(credits));
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: session?.error?.message || "Failed to create Stripe Checkout session",
        },
        { status: stripeRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error during checkout initiation",
      },
      { status: 500 }
    );
  }
}
