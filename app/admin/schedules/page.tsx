
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  CalendarDays,
  CalendarCheck,
  CarFront,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  UserRound,
  Phone,
  UserCheck,
} from "lucide-react";
import { db } from "@/app/lib/firebase";

interface Booking {
  id: string;
  name?: string;
  mobile?: string;
  date?: string | Date | { toDate?: () => Date };
  slot?: string;
  location?: string;
  fullAddress?: string;
  brand?: string;
  model?: string;
  status?: string;
  type?: string;
  assignedTo?: string;
  year?: string;
}

type DateView = "today" | "tomorrow" | "custom";

function localDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function normalizeBookingDate(value: Booking["date"]): string {
  if (!value) return "";

  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? ""
      : localDateString(parsed);
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ""
      : localDateString(value);
  }

  if (typeof value.toDate === "function") {
    const parsed = value.toDate();
    return Number.isNaN(parsed.getTime())
      ? ""
      : localDateString(parsed);
  }

  return "";
}

function slotToMinutes(slot?: string): number {
  if (!slot) return Number.MAX_SAFE_INTEGER;

  const value = slot.trim();
  const match = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2] || 0);
    const period = match[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes > 59) {
      return Number.MAX_SAFE_INTEGER;
    }

    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;

    return hours * 60 + minutes;
  }

  const twentyFourHour = value.match(/^(\d{1,2}):(\d{2})$/);

  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);

    if (hours <= 23 && minutes <= 59) {
      return hours * 60 + minutes;
    }
  }

  return Number.MAX_SAFE_INTEGER;
}

function formatDate(dateString: string): string {
  if (!dateString) return "Date unavailable";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status?: string): string {
  switch (status) {
    case "Confirmed":
      return "border-indigo-100 bg-indigo-50 text-indigo-700";
    case "Assigned":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "Completed":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "border-red-100 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

export default function AdminSchedulesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateView, setDateView] = useState<DateView>("today");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Initialize date-dependent UI after hydration.
  useEffect(() => {
    setMounted(true);
    setSelectedDate(getDateOffset(0));

const unsubscribe = onSnapshot(
  collection(db, "bookings"),
  (snapshot) => {
    const data: Booking[] = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<Booking, "id">),
    }));

    setBookings(data);
    setError("");
    setLoading(false);
  },
  (listenerError) => {
    console.error("Failed to load schedule bookings:", listenerError);
    setError("Unable to load bookings. Please check your connection and permissions.");
    setLoading(false);
  }
);

    return () => unsubscribe();
  }, []);

  const today = getDateOffset(0);
  const tomorrow = getDateOffset(1);

  const displayedBookings = useMemo(() => {
    if (!selectedDate) return [];

    return bookings
      .filter(
        (booking) =>
          normalizeBookingDate(booking.date) === selectedDate &&
          booking.status !== "Cancelled"
      )
      .sort((a, b) => {
        const timeDifference =
          slotToMinutes(a.slot) - slotToMinutes(b.slot);

        if (timeDifference !== 0) return timeDifference;

        return (a.name || "").localeCompare(b.name || "");
      });
  }, [bookings, selectedDate]);

  const confirmedCount = displayedBookings.filter(
    (booking) =>
      booking.status === "Confirmed" || booking.status === "Assigned"
  ).length;

  const completedCount = displayedBookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const setPresetDate = (preset: "today" | "tomorrow") => {
    const date = getDateOffset(preset === "today" ? 0 : 1);

    setDateView(preset);
    setSelectedDate(date);
    setExpanded({});
  };

  const changeDate = (value: string) => {
    const currentToday = getDateOffset(0);
    const currentTomorrow = getDateOffset(1);

    setDateView(
      value === currentToday
        ? "today"
        : value === currentTomorrow
          ? "tomorrow"
          : "custom"
    );

    setSelectedDate(value);
    setExpanded({});
  };

  const moveDate = (days: number) => {
    if (!selectedDate) return;

    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + days);
    changeDate(localDateString(date));
  };

  const toggleCard = (id: string) => {
    setExpanded((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const expandAll = () => {
    setExpanded(
      Object.fromEntries(
        displayedBookings.map((booking) => [booking.id, true])
      )
    );
  };

  const collapseAll = () => setExpanded({});

  const selectedDateLabel = selectedDate
    ? formatDate(selectedDate)
    : "Select a date";

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <CalendarCheck size={16} />
                InspectMyCar Admin
              </div>

              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                My Schedules
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Your daily inspection appointments at a glance.
              </p>
            </div>

            <Link
              href="/admin/bookings"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 sm:px-4 sm:text-sm"
            >
              All Bookings
            </Link>
          </div>
        </header>

        {/* Date selector */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setPresetDate("today")}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                dateView === "today"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarDays size={17} />
              Today
            </button>

            <button
              type="button"
              onClick={() => setPresetDate("tomorrow")}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                dateView === "tomorrow"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clock3 size={17} />
              Tomorrow
            </button>

            <label
              className={`col-span-2 flex min-h-12 items-center gap-2 rounded-xl border px-3 sm:col-span-1 ${
                dateView === "custom"
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <CalendarDays
                size={17}
                className="shrink-0 text-slate-500"
              />

              <input
                aria-label="Choose schedule date"
                type="date"
                value={selectedDate}
                onChange={(event) => changeDate(event.target.value)}
                className="min-w-0 w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => moveDate(-1)}
              disabled={!mounted || !selectedDate}
              aria-label="Previous day"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={19} />
            </button>

            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-black text-slate-800">
                {selectedDateLabel}
              </p>
              <p className="text-xs text-slate-400">
                Appointments in time order
              </p>
            </div>

            <button
              type="button"
              onClick={() => moveDate(1)}
              disabled={!mounted || !selectedDate}
              aria-label="Next day"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
              Total
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {loading ? "—" : displayedBookings.length}
            </p>
            <p className="text-[10px] text-slate-400 sm:text-xs">
              Appointments
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500 sm:text-xs">
              Upcoming
            </p>
            <p className="mt-1 text-2xl font-black text-indigo-700">
              {loading ? "—" : confirmedCount}
            </p>
            <p className="text-[10px] text-indigo-500 sm:text-xs">
              Confirmed / assigned
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:text-xs">
              Completed
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {loading ? "—" : completedCount}
            </p>
            <p className="text-[10px] text-emerald-600 sm:text-xs">
              Inspections
            </p>
          </div>
        </section>

        {/* Appointment list heading */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 sm:text-lg">
              Scheduled Inspections
            </h2>
            <p className="text-xs text-slate-500">
              Earliest appointment first
            </p>
          </div>

          {displayedBookings.length > 0 && (
            <div className="flex shrink-0 gap-1 sm:gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="rounded-lg px-2 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
              >
                Expand all
              </button>

              <button
                type="button"
                onClick={collapseAll}
                className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200"
              >
                Collapse
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-14">
            <RefreshCw
              size={28}
              className="mb-3 animate-spin text-indigo-600"
            />
            <p className="text-sm font-bold text-slate-700">
              Loading schedules...
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Syncing appointments from Firebase
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayedBookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={26} />
            </div>

            <h3 className="font-black text-slate-800">
              No inspections scheduled
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
              There are no active bookings for {selectedDateLabel}. Select
              another date to view its schedule.
            </p>

            {dateView !== "today" && (
              <button
                type="button"
                onClick={() => setPresetDate("today")}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                View today&apos;s schedule
              </button>
            )}
          </div>
        )}

        {/* Collapsible appointment cards */}
        {!loading && !error && displayedBookings.length > 0 && (
          <div className="space-y-3 pb-10">
            {displayedBookings.map((booking, index) => {
              const isExpanded = Boolean(expanded[booking.id]);

              return (
                <article
                  key={booking.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                    isExpanded
                      ? "border-indigo-200 shadow-md shadow-indigo-100/50"
                      : "border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleCard(booking.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`booking-details-${booking.id}`}
                    className="flex w-full min-w-0 items-start gap-3 p-3 text-left sm:gap-4 sm:p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-black text-indigo-600 sm:h-11 sm:w-11">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-sm font-black text-slate-900 sm:text-base">
                          {booking.name || "Customer name unavailable"}
                        </h3>

                        {booking.status && (
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[9px] font-extrabold uppercase ${getStatusStyle(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-sm font-extrabold text-indigo-700">
                        <Clock3 size={15} className="shrink-0" />
                        <span>{booking.slot || "Time not specified"}</span>
                      </div>

                      <div className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-slate-600">
                        <CarFront
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span className="break-words font-semibold">
                          {[booking.brand, booking.model]
                            .filter(Boolean)
                            .join(" ") || "Vehicle not specified"}
                        </span>
                      </div>

                      <div className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-slate-500">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span className="break-words">
                          {booking.location || "Location not specified"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isExpanded
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      id={`booking-details-${booking.id}`}
                      className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5"
                    >
                      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                        <UserRound size={15} />
                        Appointment Details
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Customer
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {booking.name || "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3">
                          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            <Phone size={12} />
                            Mobile
                          </p>
                          {booking.mobile ? (
                            <a
                              href={`tel:${booking.mobile}`}
                              onClick={(event) => event.stopPropagation()}
                              className="mt-1 inline-block break-words text-sm font-bold text-indigo-700 hover:underline"
                            >
                              {booking.mobile}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm font-bold text-slate-800">
                              Not provided
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Date
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {formatDate(normalizeBookingDate(booking.date))}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Appointment Time
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {booking.slot || "Not specified"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3 sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Inspection Location
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {booking.location || "Not provided"}
                          </p>

                          {booking.fullAddress && (
                            <p className="mt-1 break-words text-xs leading-relaxed text-slate-500">
                              {booking.fullAddress}
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-3 sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Car Brand &amp; Model
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-800">
                            {[booking.brand, booking.model]
                              .filter(Boolean)
                              .join(" ") || "Not provided"}
                          </p>

                          {booking.year && (
                            <p className="mt-1 text-xs text-slate-500">
                              Year: {booking.year}
                            </p>
                          )}
                        </div>

                        {booking.assignedTo && (
                          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 sm:col-span-2">
                            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-500">
                              <UserCheck size={12} />
                              Assigned Inspector
                            </p>
                            <p className="mt-1 text-sm font-bold text-indigo-800">
                              {booking.assignedTo}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">
                          Booking ID: {booking.id.slice(0, 10)}
                        </span>

                        <Link
                          href="/admin/bookings"
                          className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-indigo-600 ring-1 ring-slate-200 hover:bg-indigo-50"
                        >
                          Manage booking
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <footer className="pb-4 pt-2 text-center text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live schedule sync enabled
          </span>
        </footer>
      </div>
    </main>
  );
}
