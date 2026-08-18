import { handleInquirySubmission } from "@/lib/api/inquiries-handler";

export async function POST(request: Request) {
  return handleInquirySubmission(request);
}
