import axios from "axios";
import { IUser } from "@/models/user.model";

export async function fetchUserProfile(): Promise<IUser> {
  const res = await axios.get("/api/user/profile", {
    withCredentials: true,
  });
  return res.data.user;
}
