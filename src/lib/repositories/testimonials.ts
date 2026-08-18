import connectDB from "@/lib/db/connect";
import { sanitizeMediaItem } from "@/lib/media/sanitize";
import { mapRepositoryDoc } from "./serialize";
import { Testimonial, type ITestimonial } from "@/models";
import { handleRepositoryError } from "./errors";

function sanitizePublicTestimonial(testimonial: ITestimonial): ITestimonial {
  return {
    ...testimonial,
    image: sanitizeMediaItem(testimonial.image),
  } as ITestimonial;
}

export async function getPublishedTestimonials(): Promise<ITestimonial[]> {  try {
    await connectDB();
    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return (mapRepositoryDoc(testimonials) as ITestimonial[]).map(
      sanitizePublicTestimonial
    );  } catch (error) {
    handleRepositoryError(error, "get published testimonials");
  }
}
