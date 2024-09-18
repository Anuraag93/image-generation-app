import RegisterForm from "../components/RegisterForm";
import { getUserDataFromCookie } from "../lib/getUser";
import Dashboard from "../components/Dashboard";

export default async function Page() {
  const user = await getUserDataFromCookie();

  return (
    <>
      {user && <Dashboard user={user} />}
      {!user && (
        <>
          <p className="text-center text-2xl text-gray-600 mb-5">
            Don't have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </>
      )}
    </>
  );
}
