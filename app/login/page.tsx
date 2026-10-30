"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type LoginMode = "admin" | "inspector";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<LoginMode>("inspector");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      if (mode === "admin") {
        // The admin password is validated on the server.
        // Do not use NEXT_PUBLIC_ADMIN_KEY in client-side code.
        const response = await fetch("/api/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          setError(result.message || "Invalid admin password.");
          return;
        }

        // Redirect after the server confirms the password.
        router.push("/admin/bookings");
        return;
      }

      // Inspector login remains based on the existing Firestore records.
      if (!mobile.trim() || !password) {
        setError("Please enter your mobile number and password.");
        return;
      }

      const inspectorsQuery = query(
        collection(db, "inspectors"),
        where("mobile", "==", mobile.trim()),
        where("password", "==", password)
      );

      const snapshot = await getDocs(inspectorsQuery);

      if (snapshot.empty) {
        setError("Invalid inspector mobile number or password.");
        return;
      }

      const inspectorDoc = snapshot.docs[0];
      const inspectorData = inspectorDoc.data();

      const inspector = {
        id: inspectorDoc.id,
        name: inspectorData.name,
        mobile: inspectorData.mobile,
      };

      localStorage.setItem("pdi_inspector", JSON.stringify(inspector));

      // Keep the existing compatibility keys for inspector pages.
      localStorage.setItem("inspectorName", inspectorData.name ?? "");
      localStorage.setItem("inspectorMobile", inspectorData.mobile ?? "");

      router.push("/inspector");
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            InspectMyCar
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("inspector");
              setPassword("");
              setError("");
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === "inspector"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Inspector Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setMobile("");
              setPassword("");
              setError("");
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === "admin"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {mode === "inspector" && (
            <div>
              <label
                htmlFor="mobile"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>

              <input
                id="mobile"
                type="tel"
                autoComplete="username"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="Enter mobile number"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {mode === "admin" ? "Admin Password" : "Inspector Password"}
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          InspectMyCar PDI Booking System
        </p>
      </div>
    </main>
  );
}