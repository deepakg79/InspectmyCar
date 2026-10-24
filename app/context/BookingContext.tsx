// app/context/BookingContext.tsx

"use client";

import { usePathname } from "next/navigation";
import BookingChooserModal from "@/app/components/BookingChooserModal";
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import NewCarChatBot from "@/app/components/chatbots/NewCarChatBot";
import UsedCarChatBot from "@/app/components/chatbots/UsedCarChatBot";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type NewCarPlan =
    | "Basic"
    | "Standard"
    | "Standard-OBD"
    | "Luxury";

export type UsedCarPlan =
    | "Standard"
    | "Luxury";

interface BookingContextType {
    /* ---------------- NEW CAR ---------------- */

    openNewCarBooking: (plan?: NewCarPlan) => void;
    closeNewCarBooking: () => void;

    isNewCarBotOpen: boolean;
    selectedNewCarPlan: NewCarPlan | null;

    /* ---------------- USED CAR ---------------- */

    openUsedCarBooking: (plan?: UsedCarPlan) => void;
    closeUsedCarBooking: () => void;

    isUsedCarBotOpen: boolean;
    selectedUsedCarPlan: UsedCarPlan | null;

    /* ---------------- BOOKING CHOOSER ---------------- */

    openBookingChooser: () => void;
    closeBookingChooser: () => void;

    isBookingChooserOpen: boolean;
}

const BookingContext = createContext<
    BookingContextType | undefined
>(undefined);

/* -------------------------------------------------------------------------- */
/*                               PROVIDER                                     */
/* -------------------------------------------------------------------------- */

export function BookingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    /* ---------------------------------------------------------------------- */
    /*                           CHATBOT VISIBILITY                           */
    /* ---------------------------------------------------------------------- */

    /**
     * Chatbots are hidden only on the Home page.
     */
    const hideChatBots = pathname === "/";

    const showNewCarBot =
        pathname.startsWith("/new-cars") ||
        pathname.startsWith("/car-pdi") ||
        pathname.startsWith("/info/pricing") ||
 pathname.endsWith("/new-cars");
    const showUsedCarBot =
        pathname.startsWith("/used-cars")||
        pathname.startsWith("/info/pricing") ||
pathname.endsWith("/used-cars");
    /* ---------------------------------------------------------------------- */
    /*                               NEW CAR                                  */
    /* ---------------------------------------------------------------------- */

    const [isNewCarBotOpen, setIsNewCarBotOpen] =
        useState(false);

    const [selectedNewCarPlan, setSelectedNewCarPlan] =
        useState<NewCarPlan | null>(null);

    /* ---------------------------------------------------------------------- */
    /*                              USED CAR                                  */
    /* ---------------------------------------------------------------------- */

    const [isUsedCarBotOpen, setIsUsedCarBotOpen] =
        useState(false);

    const [selectedUsedCarPlan, setSelectedUsedCarPlan] =
        useState<UsedCarPlan | null>(null);

    /* ---------------------------------------------------------------------- */
    /*                          BOOKING CHOOSER                               */
    /* ---------------------------------------------------------------------- */

    const [isBookingChooserOpen, setIsBookingChooserOpen] =
        useState(false);

    /* ---------------------------------------------------------------------- */
    /*                           NEW CAR FUNCTIONS                            */
    /* ---------------------------------------------------------------------- */

    const openNewCarBooking = (plan?: NewCarPlan) => {
        // Close Used Car chatbot when opening New Car.
        setIsUsedCarBotOpen(false);

        setSelectedNewCarPlan(plan ?? null);
        setIsNewCarBotOpen(true);
    };

    const closeNewCarBooking = () => {
        setIsNewCarBotOpen(false);
        setSelectedNewCarPlan(null);
    };

    /* ---------------------------------------------------------------------- */
    /*                          USED CAR FUNCTIONS                            */
    /* ---------------------------------------------------------------------- */

    const openUsedCarBooking = (plan?: UsedCarPlan) => {
        // Close New Car chatbot when opening Used Car.
        setIsNewCarBotOpen(false);

        setSelectedUsedCarPlan(plan ?? null);
        setIsUsedCarBotOpen(true);
    };

    const closeUsedCarBooking = () => {
        setIsUsedCarBotOpen(false);
        setSelectedUsedCarPlan(null);
    };

    /* ---------------------------------------------------------------------- */
    /*                        BOOKING CHOOSER                                 */
    /* ---------------------------------------------------------------------- */

    const openBookingChooser = () => {
        setIsBookingChooserOpen(true);
    };

    const closeBookingChooser = () => {
        setIsBookingChooserOpen(false);
    };

    /* ---------------------------------------------------------------------- */
    /*                               RENDER                                   */
    /* ---------------------------------------------------------------------- */

    return (
        <BookingContext.Provider
            value={{
                /* New Car */
                openNewCarBooking,
                closeNewCarBooking,
                isNewCarBotOpen,
                selectedNewCarPlan,

                /* Used Car */
                openUsedCarBooking,
                closeUsedCarBooking,
                isUsedCarBotOpen,
                selectedUsedCarPlan,

                /* Booking Chooser */
                openBookingChooser,
                closeBookingChooser,
                isBookingChooserOpen,
            }}
        >
            {children}

            <BookingChooserModal
                open={isBookingChooserOpen}
                onClose={closeBookingChooser}
            />

            {!hideChatBots && (
                <>
                    {showNewCarBot && (
                        <NewCarChatBot
                            forceOpen={isNewCarBotOpen}
                            setForceOpen={setIsNewCarBotOpen}
                            initialPlan={selectedNewCarPlan}
                        />
                    )}

                    {showUsedCarBot && (
                        <UsedCarChatBot
                            forceOpen={isUsedCarBotOpen}
                            setForceOpen={setIsUsedCarBotOpen}
                            initialPlan={selectedUsedCarPlan}
                        />
                    )}
                </>
            )}
        </BookingContext.Provider>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   HOOK                                     */
/* -------------------------------------------------------------------------- */

export function useBooking() {
    const context = useContext(BookingContext);

    if (!context) {
        throw new Error(
            "useBooking must be used within BookingProvider"
        );
    }

    return context;
}