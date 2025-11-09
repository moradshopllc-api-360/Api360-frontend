import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SupportRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  category: z.enum(["technical", "account", "billing", "general"]),
  message: z.string().min(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = SupportRequestSchema.parse(body);

    // In a real application, you would:
    // 1. Save the support request to your database
    // 2. Send an email notification to the support team
    // 3. Send a confirmation email to the user
    // 4. Generate a support ticket number

    // For demo purposes, we'll just log the data and simulate success
    console.log("Support request received:", {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ticketNumber: `SUP-${Date.now().toString(36).toUpperCase()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Support request submitted successfully",
      ticketNumber: `SUP-${Date.now().toString(36).toUpperCase()}`,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Support request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}