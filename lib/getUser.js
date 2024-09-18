import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserDataFromCookie() {
  const theCookie = cookies().get("ourhaikuapp");
  if (theCookie) {
    try {
      const decoded = jwt.verify(theCookie.value, process.env.JWTSECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}
