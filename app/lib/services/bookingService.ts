import { db } from "@/app/lib/firebase"
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore"

const BOOKINGS = "bookings"

// 🔥 Get bookings + availability
export const getBookingsAndAvailability = async () => {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
        collection(db, BOOKINGS),
        where("date", ">=", today)
    );

    const snapshot = await getDocs(q);


    const availabilityMap: Record<string, string[]> = {}

    snapshot.forEach(doc => {
        const data = doc.data()



        if (!availabilityMap[data.date]) {
            availabilityMap[data.date] = []
        }

        availabilityMap[data.date].push(
            data.slot?.toString().trim().replace(/^0/, "")
        )
    })

    return {

        bookings: availabilityMap,
    }
}

// 🔥 Create booking
export const createBooking = async (data: {
    name: string
    mobile: string
    date: string
    slot: string
    location?: string
    fullAddress: string
    brand?: string
    model?: string
    price?: number
}) => {
    // 🚨 Prevent double booking
    const q = query(
        collection(db, BOOKINGS),
        where("date", "==", data.date),
        where("slot", "==", data.slot)
    )

    const existing = await getDocs(q)

    if (!existing.empty) {
        throw new Error("Slot already booked")
    }

    await addDoc(collection(db, BOOKINGS), {
        ...data,
        fullAddress: data.fullAddress || "",
        status: "Confirmed",
        assignedTo: "",
        createdAt: serverTimestamp(),
    })
}