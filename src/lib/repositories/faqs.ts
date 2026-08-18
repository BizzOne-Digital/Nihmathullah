import connectDB from "@/lib/db/connect";
import { mapRepositoryDoc } from "./serialize";
import { FAQ, type IFAQ } from "@/models";
import { handleRepositoryError } from "./errors";

export async function getPublishedFaqs(): Promise<IFAQ[]> {
  try {
    await connectDB();
    const faqs = await FAQ.find({ published: true })
      .sort({ order: 1, question: 1 })
      .lean();
    return mapRepositoryDoc(faqs) as IFAQ[];
  } catch (error) {
    handleRepositoryError(error, "get published FAQs");
  }
}

export async function getFaqsByCategory(category: string): Promise<IFAQ[]> {
  try {
    await connectDB();
    const faqs = await FAQ.find({ published: true, category })
      .sort({ order: 1, question: 1 })
      .lean();
    return mapRepositoryDoc(faqs) as IFAQ[];
  } catch (error) {
    handleRepositoryError(error, "get FAQs by category");
  }
}
