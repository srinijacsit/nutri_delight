"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("nutri_auth_phone");

    if (!storedPhone) {
      router.replace("/auth/login");
      return;
    }

    setPhone(storedPhone);
  }, [router]);

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!phone || !otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp.trim(),
      type: "sms",
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    sessionStorage.removeItem("nutri_auth_phone");

    router.push("/auth/profile");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Verify your number</h1>

          <p className="mt-2 text-gray-600">
            Enter the OTP sent to {phone}
          </p>
        </div>

        <form
          onSubmit={handleVerifyOtp}
          className="space-y-5 rounded-2xl border p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium"
            >
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border px-4 py-3 text-center tracking-widest outline-none focus:ring-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
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