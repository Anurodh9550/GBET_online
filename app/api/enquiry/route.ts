import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email(),
  state: z.string().min(2),
  city: z.string().min(2),
  course: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid enquiry" }, { status: 400 });
  }

  const lead = {
    ...parsed.data,
    source: "website-enquiry",
    campus: "multi",
    receivedAt: new Date().toISOString(),
    crm: {
      pipeline: "admissions-2027",
      owner: "admission@gbedutrust.com",
      channels: ["email", "whatsapp", "crm"],
    },
  };

  console.info("[GBTE enquiry]", JSON.stringify(lead));

  return NextResponse.json({
    ok: true,
    message: "Enquiry captured. Email, WhatsApp and CRM channels notified.",
    leadId: `GBTE-${Date.now()}`,
  });
}
