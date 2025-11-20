import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

export default async function Createur() {
    const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return redirect('/createur/login');
  } else {
    redirect('/createur/dashboard');
  }
}