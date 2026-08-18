import connectDB from "@/lib/db/connect";
import {
  BookingRequest,
  Inquiry,
  PaymentRecord,
  Quote,
} from "@/models";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import { handleApiError, jsonResponse } from "@/lib/api/response";

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    await connectDB();

    const [
      totalBookings,
      newBookings,
      needsQuoteBookings,
      totalInquiries,
      newInquiries,
      totalQuotes,
      pendingPayments,
      paidPayments,
      recentBookings,
      recentInquiries,
    ] = await Promise.all([
      BookingRequest.countDocuments(),
      BookingRequest.countDocuments({ status: "New" }),
      BookingRequest.countDocuments({ status: "Needs Quote" }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "New" }),
      Quote.countDocuments(),
      PaymentRecord.countDocuments({ status: "Pending" }),
      PaymentRecord.countDocuments({ status: "Paid" }),
      BookingRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("reference status mode createdAt tripDetails.contactName")
        .lean(),
      Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email inquiryType status createdAt")
        .lean(),
    ]);

    return jsonResponse({
      stats: {
        bookings: {
          total: totalBookings,
          new: newBookings,
          needsQuote: needsQuoteBookings,
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
        },
        quotes: {
          total: totalQuotes,
        },
        payments: {
          pending: pendingPayments,
          paid: paidPayments,
        },
      },
      recent: {
        bookings: recentBookings,
        inquiries: recentInquiries,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
