"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewerAuth() {
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const { link_id } = useParams();

  const handleAuthorizeViewer = async () => {
    const res = await fetch(`/api/viewer/${link_id}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    console.log(res.status);
  };

  const handleCheckSession = async () => {
    const res = await fetch(`/api/viewer/${link_id}`);

    const view_data = await res.json();
    console.log(view_data);
  };

  return (
    <section className="flex flex-1 flex-col items-center">
      <div className="flex h-full w-full flex-1 items-center justify-center space-x-4 rounded-lg text-center ">
        <input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="rounded-md border border-gray-300 p-2"
        />

        <button
          className="rounded-lg bg-stratos-default px-3 py-2 text-white"
          onClick={handleAuthorizeViewer}
        >
          Authorize Viewer
        </button>
        <button
          className="rounded-lg bg-stratos-default px-3 py-2 text-white"
          onClick={handleCheckSession}
        >
          Check Session
        </button>
      </div>
    </section>
  );
}
