import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
    };

    const user = await User.findById(decoded.id);

    return user;
  } catch {
    return null;
  }
}