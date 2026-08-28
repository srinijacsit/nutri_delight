"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      setPhone(user.phone ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFullName(
          profile.full_name === "Customer" ? "" : profile.full_name ?? ""
        );
        setPhone(profile.phone ?? user.phone ?? "");
      }

      const { data: address } = await supabase
        .from("addresses")
        .select(
          "label, address_line, city, state, pincode, landmark, is_default"
        )
        .eq("user_id", user.id)
        .eq("is_default", true)
        .maybeSingle();

      if (address) {
        setAddressLine(address.address_line ?? "");
        setCity(address.city ?? "");
        setState(address.state ?? "");
        setPincode(address.pincode ?? "");
        setLandmark(address.landmark ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !addressLine.trim() || !city.trim()) {
      setMessage("Please enter your name, address and city.");
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Update customer profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: user.phone ?? phone,
      })
      .eq("id", user.id);

    if (profileError) {
      setSaving(false);
      setMessage(profileError.message);
      return;
    }

    // Check for an existing default address
    const { data: existingAddress, error: addressCheckError } =
      await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .maybeSingle();

    if (addressCheckError) {
      setSaving(false);
      setMessage(addressCheckError.message);
      return;
    }

    const addressData = {
      label: "Home",
      address_line: addressLine.trim(),
      city: city.trim(),
      state: state.trim() || null,
      pincode: pincode.trim() || null,
      landmark: landmark.trim() || null,
      is_default: true,
    };

    // Update existing address or create the first one
    const { error: addressError } = existingAddress
      ? await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", existingAddress.id)
          .eq("user_id", user.id)
      : await supabase.from("addresses").insert({
          ...addressData,
          user_id: user.id,
        });

    if (addressError) {
      setSaving(false);
      setMessage(addressError.message);
      return;
    }

    router.replace("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Complete your profile
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your details for Nutri Delight delivery.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <textarea
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="House no., street, area"
              rows={3}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              City
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full rounded-lg border px-4 py-3 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="rounded-lg border px-4 py-3 outline-none"
            />

            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode"
              inputMode="numeric"
              className="rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Landmark <span className="text-gray-500">(Optional)</span>
            </label>

            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue"}
          </button>

          {message && (
            <p className="text-center text-sm text-red-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}