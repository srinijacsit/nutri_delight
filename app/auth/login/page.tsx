"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const cleanedPhone = phone.trim();

    if (!cleanedPhone) {
      setMessage("Please enter your phone number.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      phone: cleanedPhone,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    sessionStorage.setItem("nutri_auth_phone", cleanedPhone);

    router.push("/auth/verify");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Nutri Delight</h1>

          <p className="mt-2 text-gray-600">
            Login or create your account
          </p>
        </div>

        <form
          onSubmit={handleSendOtp}
          className="space-y-5 rounded-2xl border p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 9876543210"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}