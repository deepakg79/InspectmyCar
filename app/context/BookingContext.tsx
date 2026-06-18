//app/context/BookingContext.tsx

"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import ChatBot from "../components/ChatBot";

// Add "Standard-OBD" to the allowed plan types
export type PlanType = "Basic" | "Standard" | "Standard-OBD" | "Luxury";
interface BookingContextType {
    openBooking: (plan?: PlanType) => void;
    closeBooking: () => void;
    isBotOpen: boolean;
    selectedPlan: PlanType | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

    const openBooking = (plan?: PlanType) => {
        if (plan) setSelectedPlan(plan);
        setIsBotOpen(true);
    };

    const closeBooking = () => {
        setIsBotOpen(false);
        setSelectedPlan(null);
    };

    return (
        <BookingContext.Provider value={{ openBooking, closeBooking, isBotOpen, selectedPlan }}>
            {children}
            {/* ChatBot now globally receives selected plan */}
            <ChatBot
                forceOpen={isBotOpen}
                setForceOpen={setIsBotOpen}
                initialPlan={selectedPlan}
            />
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error("useBooking must be used within a BookingProvider");
    return context;
};