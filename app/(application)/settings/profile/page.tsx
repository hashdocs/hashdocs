"use client";
import {
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../_components/userProvider";
import { formatDate } from "@/app/_utils/dateFormat";
import Loader from "@/app/_components/navigation/loader";

/*=========================================== TYPES ===========================================*/

/*=========================================== CONSTANTS ===========================================*/

export default function AnalyticsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const _userContext = useContext(UserContext);

  if (!_userContext) {
    return <Loader />;
  }

  const { user } = _userContext;

  const handleLogout = async (e: any) => {
    const loginPromise = new Promise(async (resolve, reject) => {
      e.preventDefault();

      const { error } = await supabase.auth.signOut();

      if (error) {
        reject(false);
      } else {
        resolve(true);
        router.replace("/", { forceOptimisticNavigation: true });
      }
    });

    toast.promise(loginPromise, {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Sign out failed! Please try again",
    });
  };

  return (
    <main className="flex flex-col space-y-4">
      <div className="flex w-full flex-1 flex-col items-center gap-y-8 rounded-md bg-white p-8 text-shade-pencil-light shadow-sm ">
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Email
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-shade-line bg-shade-overlay p-2 font-semibold shadow-inner">
            {user?.email}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-1/2 text-sm font-semibold">
            Last Sign In
          </div>
          <div className="flex h-10 flex-1 basis-1/2 rounded-md border border-shade-line bg-shade-overlay p-2 font-semibold shadow-inner">
            {formatDate(user?.last_sign_in_at ?? "", "MMM DD, YYYY")}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-row items-center">
          <div className="flex flex-1 basis-3/4 text-sm font-semibold"></div>
          <button
            className="rounded-md border border-red-500 bg-red-50 p-2 font-semibold text-red-700 shadow-inner"
            onClick={handleLogout}
          >
            Logout of all sessions
          </button>
        </div>
      </div>
    </main>
  );
}
