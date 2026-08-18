import connectDB from "@/lib/db/connect";
import { AdminUser, type AdminRole, type IAdminUser } from "@/models";
import { mapRepositoryDoc } from "./serialize";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreateAdminUserInput = {
  email: string;
  passwordHash: string;
  name: string;
  role?: AdminRole;
};

export async function findAdminByEmail(
  email: string
): Promise<IAdminUser | null> {
  try {
    await connectDB();
    const admin = await AdminUser.findOne({
      email: email.toLowerCase().trim(),
      active: true,
    });
    return admin ? (mapRepositoryDoc(admin.toObject()) as IAdminUser) : null;
  } catch (error) {
    handleRepositoryError(error, "find admin by email");
  }
}

export async function createAdminUser(
  data: CreateAdminUserInput
): Promise<IAdminUser> {
  try {
    await connectDB();

    const existing = await AdminUser.findOne({
      email: data.email.toLowerCase().trim(),
    });

    if (existing) {
      throw new RepositoryError("Admin user already exists", "CONFLICT");
    }

    const admin = await AdminUser.create({
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role ?? "admin",
      active: true,
    });

    return mapRepositoryDoc(admin.toObject()) as IAdminUser;
  } catch (error) {
    handleRepositoryError(error, "create admin user");
  }
}
