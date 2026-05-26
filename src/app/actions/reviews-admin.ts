"use server";

import { revalidatePath } from "next/cache";
import { getDashboardUser } from "@/lib/dashboard-user";
import { prisma } from "@/lib/prisma";
import { syncWordpressReviewApproval } from "@/lib/wordpress-sync";

export async function setReviewApproved(formData: FormData): Promise<void> {
  const user = await getDashboardUser();
  if (!user) {
    return;
  }
  const id = String(formData.get("id") ?? "").trim();
  const approved = formData.get("approved") === "true";
  if (!id) {
    return;
  }
  await prisma.review.update({
    where: { id },
    data: { approved },
  });
  try {
    await syncWordpressReviewApproval(id, approved);
  } catch {
    // Keep local moderation working even when WP is unavailable.
  }
  revalidatePath("/reviews");
  revalidatePath("/dashboard/reviews");
}

export async function deleteReview(formData: FormData): Promise<void> {
  const user = await getDashboardUser();
  if (!user) {
    return;
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  await prisma.review.delete({ where: { id } });
  revalidatePath("/reviews");
  revalidatePath("/dashboard/reviews");
}
