import { getUserDataFromCookie } from "../../lib/getUser";
import { redirect } from "next/navigation";
import HaikuForm from "../../components/HaikuForm";

export default async function Page() {
  // dont show this page if the user is not logged in
  // redirect the user to homepage
  const user = await getUserDataFromCookie;
  if (!user) {
    redirect("/");
  }

  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Create Haiku</h2>
      <HaikuForm />
    </>
  );
}
