"use client";

import {
    useState,
    useEffect,
    useMemo,
    useRef,
} from "react";

import checklist from "@/app/lib/checklist";

import { useRouter } from "next/navigation";

// Firebase
import {
    collection,
    addDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";


// ============================================================
// TYPES
// ============================================================
type ChecklistItem =
    | string
    | {
        text: string;
        label?: string;
        notFor?: string[];
        type?: string;
    };


type ResultValue =
    | number
    | {
        value?: number;
        comment?: string;
    }
    | {
        week?: string;
        year?: string;
        depth?: string;
        manufacturer?: string;
        condition?: string;
        score?: number;
        available?: boolean;
    };


// ============================================================
// TYRE CONDITION
// ============================================================

const getTyreCondition = (
    depthValue: string | number
): {
    condition: string;
    score: number;
} => {

    const depth =
        Number(depthValue);


    if (
        !Number.isFinite(depth) ||
        depth <= 0
    ) {
        return {
            condition: "No Tread",
            score: 0,
        };
    }


    // 6.5 mm and above
    if (depth >= 6.5) {
        return {
            condition: "Excellent",
            score: 100,
        };
    }


    // 5.5 mm to below 6.5 mm
    if (depth >= 5.5) {
        return {
            condition: "Good",
            score: 80,
        };
    }


    // 4.5 mm to below 5.5 mm
    if (depth >= 4.5) {
        return {
            condition: "Average",
            score: 60,
        };
    }


    // 3.5 mm to below 4.5 mm
    if (depth >= 3.5) {
        return {
            condition: "Fair",
            score: 40,
        };
    }


    // 2.5 mm to below 3.5 mm
    if (depth >= 2.5) {
        return {
            condition: "Poor",
            score: 20,
        };
    }


    // 1.0 mm to below 2.5 mm
    // The original requested range had a small gap
    // between 2.0 and 2.5 mm. This keeps that range
    // covered under the Critical condition.
    if (depth >= 1.0) {
        return {
            condition: "Critical",
            score: 10,
        };
    }


    // 0.1 mm to below 1.0 mm
    return {
        condition: "Unsafe",
        score: 0,
    };
};


// ============================================================
// COMPONENT
// ============================================================

export default function InspectionForm() {

    const router = useRouter();


    // ========================================================
    // BASIC STATE
    // ========================================================

    const [loading, setLoading] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const searchInputRef =
        useRef<HTMLInputElement>(null);

    const [toast, setToast] =
        useState<string | null>(null);


    // ========================================================
    // INSPECTOR COMMENTS
    // ========================================================

    const [
        inspectorComments,
        setInspectorComments,
    ] = useState<string[]>([""]);


    // ========================================================
    // META
    // ========================================================

    const [meta, setMeta] = useState({
        bookingId: "",
        mobile: "",
        name: "",
        date: new Date().toLocaleDateString(
            "en-GB"
        ),
        inspector: "",
        vin: "",
        odometer: "",
        brand: "",
        model: "",
        year: "",
        month: "",
        vehicleType: "",
    });


    // ========================================================
    // CHECKLIST RESULTS
    // ========================================================

    const [results, setResults] =
        useState<
            Record<
                string,
                ResultValue
            >
        >({});

    // Fuel and transmission are independent selections.
    // Petrol/Diesel/CNG alone means manual; adding Automatic
    // marks that fuel variant as automatic too.
    const [selectedVehicleTypes, setSelectedVehicleTypes] =
        useState<string[]>([]);

    const handleVehicleTypeToggle = (type: string) => {
        if (["Petrol", "Diesel", "CNG", "EV"].includes(type)) {
            setMeta(prev => ({ ...prev, vehicleType: type }));
            setSelectedVehicleTypes(prev =>
                prev.includes("Automatic") ? [type, "Automatic"] : [type]
            );
            return;
        }

        if (type === "Automatic") {
            setSelectedVehicleTypes(prev => {
                const next = prev.includes("Automatic")
                    ? prev.filter(value => value !== "Automatic")
                    : [...prev, "Automatic"];
                setMeta(current => ({
                    ...current,
                    vehicleType: next.find(value => ["Petrol", "Diesel", "CNG", "EV"].includes(value)) || (next.includes("Automatic") ? "Automatic" : ""),
                }));
                return next;
            });
        }
    };


    // ========================================================
    // LOAD ACTIVE JOB
    // ========================================================

    useEffect(() => {

        const loadData = () => {

            const jobStr =
                localStorage.getItem(
                    "active_pdi"
                );


            if (!jobStr) {

                setTimeout(
                    loadData,
                    300
                );

                return;
            }


            try {

                const job =
                    JSON.parse(jobStr);


                setMeta(prev => ({
                    ...prev,

                    bookingId:
                        job.id || "",

                    name:
                        job.name || "",

                    mobile:
                        job.mobile || "",

                    brand:
                        job.brand || "",

                    model:
                        job.model || "",

                    inspector:
                        job.inspector ||
                        job.assignedTo ||
                        "",
                }));

            } catch (error) {

                console.error(
                    "Failed to load active PDI:",
                    error
                );

            }
        };


        loadData();

    }, []);


    // ========================================================
    // TOUCH HANDLING
    // ========================================================

    const handleTouchStart = (
        e: React.TouchEvent
    ) => {

        if (
            searchInputRef.current &&
            !searchInputRef.current.contains(
                e.target as Node
            )
        ) {

            searchInputRef.current.blur();
        }
    };





    // ========================================================
    // FILTER CHECKLIST
    // ========================================================

    const filteredChecklist =
        useMemo(() => {
            // Match every search word independently, regardless of order.
            // Example: "fuel corrosion" matches "Fuel Tank: Check for corrosion".
            const queryWords = searchQuery
                .toLowerCase()
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            return checklist
                .map(section => {
                    // Keep each checkpoint's original position. The index
                    // must not change when search hides earlier checkpoints.
                    const indexedItems = section.items.map((item, originalIndex) => ({
                        item,
                        originalIndex,
                    }));

                    const visibleItems = queryWords.length
                        ? indexedItems.filter(({ item }) => {
                            const checkpointText =
                                typeof item === "object" ? item.text : String(item);
                            const searchableText = checkpointText
                                .toLowerCase()
                                .replace(/[^\p{L}\p{N}]+/gu, " ")
                                .trim();

                            return queryWords.every(word =>
                                searchableText.includes(word.replace(/[^\p{L}\p{N}]+/gu, ""))
                            );
                        })
                        : indexedItems;

                    return {
                        ...section,
                        items: visibleItems.map(({ item }) => item),
                        originalIndices: visibleItems.map(({ originalIndex }) => originalIndex),
                    };
                })
                .filter(section => section.items.length > 0);
        }, [searchQuery]);

    // ========================================================
    // STATUS CHANGE
    // ========================================================

    const handleStatusChange = (
        id: string,
        value: number
    ) => {
        // Once a searched checkpoint is marked, return to the full checklist.
        setSearchQuery("");

        setResults(prev => {

            const existing =
                prev[id];


            // Never modify tyre objects
            if (
                typeof existing ===
                "object" &&
                existing &&
                "week" in existing
            ) {

                return prev;
            }


            return {

                ...prev,

                [id]: {

                    // IMPORTANT:
                    // Preserve an existing finding/comment
                    // when changing PASSED <-> ISSUE.
                    ...(typeof existing ===
                        "object" &&
                        existing &&
                        "value" in existing
                        ? existing
                        : {}),

                    value,
                },
            };
        });
    };


    // ========================================================
    // COMMENT / FINDING CHANGE
    // ========================================================

    const handleCommentChange = (
        id: string,
        comment: string
    ) => {

        setResults(prev => {

            const existing =
                prev[id];


            let value =
                1;


            if (
                typeof existing ===
                "number"
            ) {

                value =
                    existing;

            } else if (
                typeof existing ===
                "object" &&
                existing &&
                "value" in existing
            ) {

                value =
                    existing.value ??
                    1;
            }


            return {

                ...prev,

                [id]: {

                    // IMPORTANT:
                    // Always retain the selected
                    // PASSED / ISSUE status.
                    ...(typeof existing ===
                        "object" &&
                        existing &&
                        "value" in existing
                        ? existing
                        : {}),

                    value,

                    // IMPORTANT:
                    // Finding is saved even for PASSED.
                    comment: String(comment ?? ""),
                },
            };
        });
    };


    // ========================================================
    // HEALTH SCORE
    // ========================================================

    const calculateScore = (
        arr: number[]
    ) => {

        if (
            arr.length === 0
        ) {

            return 0;
        }


        const passed =
            arr.filter(
                v => v === 1
            ).length;


        return Math.round(
            (
                passed /
                arr.length
            ) *
            100
        );
    };


    // ========================================================
    // WEEKS
    // ========================================================

    const weeks =
        Array.from(
            {
                length: 52,
            },
            (_, i) =>
                String(i + 1)
                    .padStart(
                        2,
                        "0"
                    )
        );


    // ========================================================
    // UPDATE TYRE FIELD
    // ========================================================

    const updateTyreField = (
        id: string,
        field:
            | "week"
            | "year"
            | "depth"
            | "manufacturer",
        value: string
    ) => {

        setResults(prev => {

            const existing =
                prev[id];


            const current =
                typeof existing ===
                    "object" &&
                    existing &&
                    "week" in existing
                    ? existing
                    : {};


            return {

                ...prev,

                [id]: {

                    ...current,

                    [field]:
                        value,
                },
            };
        });
    };


    // ========================================================
    // UPDATE SPARE TYRE AVAILABILITY
    // ========================================================

    const updateSpareTyreAvailability = (
        available: boolean
    ) => {
        setResults(prev => {
            const existing = prev["E"];
            const current =
                typeof existing === "object" &&
                existing &&
                "week" in existing
                    ? existing
                    : {};

            return {
                ...prev,
                E: {
                    ...current,
                    available,
                    week: available ? (current.week || "") : "",
                    year: available ? (current.year || "") : "",
                    depth: available ? (current.depth || "") : "",
                    manufacturer: available ? (current.manufacturer || "") : "",
                },
            };
        });
    };


    // ========================================================
    // GET TYRE DATA FROM RESULT
    // ========================================================

    const getTyreData = (
        id: string
    ) => {

        const value =
            results[id];


        if (
            typeof value ===
            "object" &&
            value &&
            "week" in value
        ) {

            return value as {
                week?: string;
                year?: string;
                depth?: string;
                manufacturer?: string;
                available?: boolean;
            };
        }


        return {
            week: "",
            year: "",
            depth: "",
            manufacturer: "",
            available: true,
        };
    };


    // ========================================================
    // FIREBASE SUBMIT
    // ========================================================

    const handleSubmit =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();


            setLoading(true);


            if (
                selectedVehicleTypes.length === 0
            ) {

                alert(
                    "Please select vehicle type"
                );

                setLoading(false);

                return;
            }


            // ====================================================
            // IDS
            // ====================================================

            const idSequence = [

                ...Array.from(
                    {
                        length: 400,
                    },
                    (_, i) =>
                        (
                            i + 1
                        ).toString()
                ),

                "A",
                "B",
                "C",
                "D",
                "E",
            ];


            // ====================================================
            // OUTPUT DATA
            // ====================================================

            const checklistResults: Record<
                string,
                number
            > = {};


            const checklistComments: Record<
                string,
                string
            > = {};


            const tyreData: Record<
                string,
                {
                    week: string;
                    year: string;
                    depth: string;
                    manufacturer: string;
                    condition: string;
                    score: number;
                    available: boolean;
                }
            > = {};


            // ====================================================
            // PROCESS
            // ====================================================

            idSequence.forEach(
                id => {

                    const item =
                        results[id];


                    // ============================================
                    // TYRE DATA
                    // ============================================

                    if (
                        typeof item ===
                        "object" &&
                        item &&
                        "week" in item
                    ) {

                        const depth =
                            item.depth ||
                            "";


                        const tyreCondition =
                            getTyreCondition(
                                depth
                            );


                        tyreData[id] = {

                            week:
                                item.week ||
                                "",

                            year:
                                item.year ||
                                "",

                            depth,

                            manufacturer:
                                item.manufacturer ||
                                "",

                            available:
                                id === "E"
                                    ? item.available !== false
                                    : true,

                            condition:
                                depth
                                    ? tyreCondition.condition
                                    : "",

                            score:
                                depth
                                    ? tyreCondition.score
                                    : 0,
                        };


                        return;
                    }


                    // ============================================
                    // FIND CHECKLIST ITEM
                    // ============================================

                    let checklistItem:
                        ChecklistItem | undefined;


                    for (
                        const section
                        of checklist
                    ) {

                        const found =
                            section.items.find(
                                (
                                    it:
                                        ChecklistItem,
                                    idx:
                                        number
                                ) => {

                                    const lbl =
                                        typeof it ===
                                            "object" &&
                                            it.label
                                            ? it.label
                                            : String(
                                                section.startNo +
                                                idx
                                            );


                                    return (
                                        lbl ===
                                        id
                                    );
                                }
                            );


                        if (found) {

                            checklistItem =
                                found;

                            break;
                        }
                    }


                    // ============================================
                    // AUTOMATIC NA LOGIC
                    // ============================================

                    const isNA =
                        typeof checklistItem ===
                        "object" &&
                        Array.isArray(
                            checklistItem.notFor
                        ) &&
                        selectedVehicleTypes.some(type =>
                            checklistItem.notFor!.includes(type)
                        );


                    if (isNA) {

                        checklistResults[
                            id
                        ] = -1;


                        checklistComments[
                            id
                        ] =
                            "Not Applicable";


                        return;
                    }


                    // ============================================
                    // NUMBER RESULT
                    // ============================================

                    if (
                        typeof item ===
                        "number"
                    ) {

                        checklistResults[
                            id
                        ] = item;


                        checklistComments[
                            id
                        ] =
                            item === 0
                                ? "ISSUE"
                                : "Condition Verified";


                        return;
                    }


                    // ============================================
                    // OBJECT RESULT
                    // ============================================

                    if (
                        typeof item ===
                        "object" &&
                        item &&
                        "value" in item
                    ) {

                        const value =
                            item.value ??
                            1;


                        checklistResults[
                            id
                        ] = value;


                        const comment =
                            item.comment
                                ?.trim() ||
                            "";


                        // ----------------------------------------
                        // ISSUE
                        // ----------------------------------------

                        if (
                            value === 0
                        ) {

                            checklistComments[
                                id
                            ] =
                                comment
                                    ? `ISSUE - ${comment}`
                                    : "ISSUE";


                            return;
                        }


                        // ----------------------------------------
                        // PASSED + FINDING
                        // ----------------------------------------

                        checklistComments[
                            id
                        ] =
                            comment
                                ? `Condition Verified - Findings - ${comment}`
                                : "Condition Verified";


                        return;
                    }


                    // ============================================
                    // DEFAULT PASSED
                    // ============================================

                    checklistResults[
                        id
                    ] = 1;


                    checklistComments[
                        id
                    ] =
                        "Condition Verified";
                }
            );


            // ====================================================
            // HEALTH SCORE
            // ====================================================

            const numericValues =
                Object.values(
                    checklistResults
                ).filter(
                    (
                        v
                    ): v is number =>
                        typeof v ===
                        "number" &&
                        v !== -1
                );


            const healthScore =
                calculateScore(
                    numericValues
                );


            // ====================================================
            // INSPECTOR COMMENTS
            // ====================================================

            const finalComments =
                inspectorComments
                    .map(
                        comment =>
                            comment.trim()
                    )
                    .filter(
                        Boolean
                    );


            // ====================================================
            // SAVE
            // ====================================================

            try {

                const reportRef = await addDoc(
                    collection(
                        db,
                        "reports"
                    ),
                    {

                        ...meta,
                        vehicleTypes: selectedVehicleTypes,

                        bookingId:
                            meta.bookingId,

                        // Numeric checklist
                        checklistResults,

                        // Findings / remarks
                        checklistComments,

                        // Tyres
                        tyreData,

                        // Overall checklist score
                        healthScore,

                        // Inspector comments
                        inspectorComments:
                            finalComments,

                        createdAt:
                            new Date(),

                        status:
                            "Completed",

                        approved:
                            false,
                    }
                );
                const reportId = reportRef.id;
                await updateDoc(reportRef, {
                    reportId,
                });
                // ====================================================
                // UPDATE BOOKING
                // ====================================================

                await updateDoc(

                    doc(
                        db,
                        "bookings",
                        meta.bookingId
                    ),

                    {
                        status:
                            "Completed",
                    }
                );


                // ====================================================
                // SUCCESS RESULT
                // ====================================================

                // This payload is useful for the Android/app side.
                // It is only sent AFTER both Firebase writes succeed.
                const submissionResult = {
                    success: true,
                    status: "success",
                    message: "Inspection submitted successfully",
                    bookingId: meta.bookingId,
                    reportId,
                    healthScore,
                };

                const android = (
                    window as any
                ).Android;

                // Preferred native callback: receives a JSON result.
                if (
                    android?.onSubmitSuccess
                ) {
                    android.onSubmitSuccess(
                        JSON.stringify(
                            submissionResult
                        )
                    );
                }
                // Backward compatibility with the existing Android bridge.
                else if (
                    android?.onSubmitClicked
                ) {
                    android.onSubmitClicked();
                }

                // Keep a browser/app-readable success result as well.
                localStorage.setItem(
                    "pdi_submission_result",
                    JSON.stringify(
                        submissionResult
                    )
                );

                localStorage.removeItem(
                    "active_pdi"
                );

                // Redirect only after Firebase has confirmed the submission.
                router.push(
                    `/inspector?submission=success&bookingId=${encodeURIComponent(
                        String(meta.bookingId || "")
                    )}`
                );


            } catch (err) {

                console.error(
                    err
                );

                alert(
                    "Submission failed."
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    // ============================================================
    // UI
    // ============================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-50
                pb-40
                font-sans
            "
            onTouchStart={
                handleTouchStart
            }
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    bg-slate-900
                    p-8
                    text-white
                    rounded-b-[3rem]
                    shadow-lg
                    sticky
                    top-0
                    z-50
                "
            >

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-4
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/inspector"
                            )
                        }
                        className="
                            text-[10px]
                            font-black
                            text-indigo-400
                            uppercase
                            tracking-widest
                        "
                    >
                        ← Back
                    </button>


                    <h1
                        className="
                            text-xl
                            font-black
                            italic
                        "
                    >
                        PDI INSPECTION
                    </h1>


                    <span
                        className="
                            text-[10px]
                            font-black
                            text-indigo-400
                        "
                    >
                        {meta.date}
                    </span>

                </div>


                <div className="relative">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search words, e.g. Fuel corrosion or Dickey repainted..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Escape") {
                                setSearchQuery("");
                                searchInputRef.current?.blur();
                            }
                        }}
                        className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 pr-20 text-sm text-white placeholder:text-white/60"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                searchInputRef.current?.focus();
                            }}
                            aria-label="Clear checkpoint search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
                        >
                            Clear ×
                        </button>
                    )}
                </div>

            </div>


            {/* ==================================================
                FORM
            ================================================== */}

            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    max-w-lg
                    mx-auto
                    p-6
                    space-y-6
                "
            >

                {/* ==================================================
                    CUSTOMER + VEHICLE
                ================================================== */}

                {!searchQuery && (

                    <div
                        className="
                            space-y-4
                        "
                    >

                        {/* CUSTOMER */}

                        <div
                            className="
                                bg-white
                                p-6
                                rounded-[2.5rem]
                                shadow-sm
                                border
                                space-y-4
                            "
                        >

                            <input
                                required
                                placeholder="Inspector Name"
                                className="
                                    w-full
                                    p-4
                                    bg-slate-50
                                    rounded-2xl
                                "
                                value={
                                    meta.inspector
                                }
                                onChange={e =>
                                    setMeta({
                                        ...meta,
                                        inspector:
                                            e.target
                                                .value,
                                    })
                                }
                            />


                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >

                                <input
                                    required
                                    placeholder="Customer Name"
                                    className="
                                        p-4
                                        bg-slate-50
                                        rounded-2xl
                                    "
                                    value={
                                        meta.name
                                    }
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            name:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />


                                <input
                                    required
                                    placeholder="Mobile"
                                    className="
                                        p-4
                                        bg-slate-50
                                        rounded-2xl
                                    "
                                    value={
                                        meta.mobile
                                    }
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            mobile:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />

                            </div>

                        </div>


                        {/* VEHICLE */}

                        <div
                            className="
                                bg-white
                                p-6
                                rounded-[2.5rem]
                                shadow-sm
                                border
                                space-y-4
                            "
                        >

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >

                                <input
                                    required
                                    placeholder="Brand"
                                    className="
                                        p-4
                                        bg-slate-50
                                        rounded-2xl
                                    "
                                    value={
                                        meta.brand
                                    }
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            brand:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />


                                <input
                                    required
                                    placeholder="Model"
                                    className="
                                        p-4
                                        bg-slate-50
                                        rounded-2xl
                                    "
                                    value={
                                        meta.model
                                    }
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            model:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />

                            </div>


                            <input
                                required
                                placeholder="VIN"
                                className="
                                    w-full
                                    p-4
                                    bg-slate-100
                                    rounded-2xl
                                "
                                value={
                                    meta.vin
                                }
                                onChange={e =>
                                    setMeta({
                                        ...meta,
                                        vin:
                                            e.target
                                                .value
                                                .toUpperCase(),
                                    })
                                }
                            />


                            <div
                                className="
                                    grid
                                    grid-cols-3
                                    gap-3
                                "
                            >

                                <input
                                    required
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    step="1"
                                    placeholder="Odo"
                                    className="
                                        p-4
                                        bg-slate-50
                                        rounded-2xl
                                    "
                                    value={meta.odometer}
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            odometer: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    step="1"
                                    placeholder="Year"
                                    className="
                                        p-4
                                        bg-indigo-50
                                        rounded-2xl
                                        text-center
                                        font-bold
                                    "
                                    value={meta.year}
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            year: e.target.value,
                                        })
                                    }
                                />


                                <select
                                    className="
                                        p-4
                                        bg-indigo-50
                                        rounded-2xl
                                        text-center
                                        font-bold
                                    "
                                    value={
                                        meta.month
                                    }
                                    onChange={e =>
                                        setMeta({
                                            ...meta,
                                            month:
                                                e.target
                                                    .value,
                                        })
                                    }
                                >

                                    <option value="">
                                        Month
                                    </option>

                                    <option>
                                        January
                                    </option>

                                    <option>
                                        February
                                    </option>

                                    <option>
                                        March
                                    </option>

                                    <option>
                                        April
                                    </option>

                                    <option>
                                        May
                                    </option>

                                    <option>
                                        June
                                    </option>

                                    <option>
                                        July
                                    </option>

                                    <option>
                                        August
                                    </option>

                                    <option>
                                        September
                                    </option>

                                    <option>
                                        October
                                    </option>

                                    <option>
                                        November
                                    </option>

                                    <option>
                                        December
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* VEHICLE TYPE */}

                        <div
                            className="
                                bg-white
                                p-6
                                rounded-[2.5rem]
                                shadow-sm
                                border
                                space-y-4
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-black
                                    uppercase
                                    tracking-widest
                                    text-slate-400
                                "
                            >
                                Vehicle Type / Transmission
                            </p>
                            <p className="text-xs text-slate-500">Choose Petrol, Diesel, CNG or EV for manual transmission. Then select Automatic as well for an automatic variant.</p>


                            <div
                                className="
                                    flex
                                    gap-2
                                    flex-wrap
                                "
                            >

                                {[
                                    "Petrol",
                                    "Diesel",
                                    "CNG",
                                    "EV",
                                    "Automatic",
                                ].map(
                                    type => (

                                        <button
                                            key={
                                                type
                                            }
                                            type="button"
                                            onClick={() => handleVehicleTypeToggle(type)}
                                            className={`
                                                flex-1
                                                min-w-[80px]
                                                px-4
                                                py-3
                                                rounded-2xl
                                                text-xs
                                                font-black
                                                border
                                                transition-all
                                                ${selectedVehicleTypes.includes(type)
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                                }
                                            `}
                                        >
                                            {
                                                type
                                            }
                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </div>
                )}


                {/* ==================================================
                    INSPECTOR COMMENTS
                ================================================== */}

                <div
                    className="
                        bg-white
                        p-6
                        rounded-[2.5rem]
                        shadow-sm
                        border
                        space-y-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-widest
                                text-slate-400
                            "
                        >
                            Inspector Comments
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                setInspectorComments(
                                    prev => [
                                        ...prev,
                                        "",
                                    ]
                                )
                            }
                            className="
                                px-4
                                py-2
                                rounded-xl
                                bg-indigo-600
                                text-white
                                text-[10px]
                                font-black
                                uppercase
                            "
                        >
                            + Add Comment
                        </button>

                    </div>


                    {inspectorComments.map(
                        (
                            comment,
                            index
                        ) => (

                            <textarea
                                key={
                                    index
                                }
                                rows={2}
                                placeholder={`Comment ${index + 1
                                    }`}
                                value={
                                    comment
                                }
                                onChange={e => {

                                    const updated =
                                        [
                                            ...inspectorComments,
                                        ];


                                    updated[
                                        index
                                    ] =
                                        e.target.value;


                                    setInspectorComments(
                                        updated
                                    );
                                }}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    p-4
                                    text-sm
                                    resize-none
                                "
                            />

                        )
                    )}

                </div>


                {/* ==================================================
                    CHECKLIST
                ================================================== */}

                {filteredChecklist.map(
                    (
                        section,
                        sIdx
                    ) => (

                        <div
                            key={
                                sIdx
                            }
                            className="
                                space-y-3
                            "
                        >

                            {/* SECTION TITLE */}

                            <h3
                                className="
                                    font-black
                                    text-slate-400
                                    text-[10px]
                                    uppercase
                                    tracking-widest
                                    ml-4
                                "
                            >
                                {
                                    section.section
                                }
                            </h3>


                            {/* CARD */}

                            <div
                                className="
                                    bg-white
                                    rounded-[2rem]
                                    shadow-sm
                                    border
                                    border-slate-100
                                    divide-y
                                    divide-slate-50
                                    overflow-hidden
                                "
                            >

                                {(
                                    section.items as ChecklistItem[]
                                ).map(
                                    (
                                        item,
                                        iIdx
                                    ) => {

                                        // ========================================
                                        // ID
                                        // ========================================

                                        const label =
                                            typeof item ===
                                                "object" &&
                                                "label" in
                                                item &&
                                                item.label
                                                ? item.label
                                                : String(
                                                    section.startNo +
                                                    (section.originalIndices?.[iIdx] ?? iIdx)
                                                );


                                        // ========================================
                                        // TEXT
                                        // ========================================

                                        const text =
                                            typeof item ===
                                                "object" &&
                                                "text" in
                                                item
                                                ? item.text
                                                : String(
                                                    item
                                                );


                                        // ========================================
                                        // TYRE
                                        // ========================================

                                        const isTyre =
                                            typeof item ===
                                            "object" &&
                                            "type" in
                                            item &&
                                            item.type ===
                                            "TYRE";


                                        // ========================================
                                        // AUTOMATIC NA
                                        // ========================================

                                        const notApplicable =
                                            typeof item ===
                                            "object" &&
                                            "notFor" in
                                            item &&
                                            Array.isArray(
                                                item.notFor
                                            ) &&
                                            selectedVehicleTypes.some(type =>
                                                item.notFor!.includes(type)
                                            );


                                        // ========================================
                                        // CURRENT STATUS
                                        // ========================================

                                        let currentVal =
                                            1;


                                        if (
                                            typeof results[
                                            label
                                            ] ===
                                            "number"
                                        ) {

                                            currentVal =
                                                results[
                                                label
                                                ] as number;

                                        } else if (
                                            typeof results[
                                            label
                                            ] ===
                                            "object" &&
                                            results[
                                            label
                                            ] &&
                                            "value" in
                                            results[
                                            label
                                            ]
                                        ) {

                                            currentVal =
                                                (
                                                    results[
                                                    label
                                                    ] as {
                                                        value?: number;
                                                    }
                                                )
                                                    .value ??
                                                1;
                                        }


                                        // ========================================
                                        // AUTOMATIC NA
                                        // ========================================

                                        if (
                                            notApplicable
                                        ) {

                                            currentVal =
                                                -1;
                                        }


                                        // ========================================
                                        // TYRE DATA
                                        // ========================================

                                        const tyre =
                                            getTyreData(
                                                label
                                            );


                                        const tyreCondition =
                                            tyre.depth
                                                ? getTyreCondition(
                                                    tyre.depth
                                                )
                                                : null;


                                        return (

                                            <div
                                                key={
                                                    label
                                                }
                                                className="
                                                    p-5
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                {/* =====================================
                                                    ITEM TEXT
                                                ====================================== */}

                                                <div
                                                    className="
                                                        flex-1
                                                        min-w-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-[9px]
                                                            text-slate-300
                                                            font-black
                                                        "
                                                    >
                                                        #{label}
                                                    </p>


                                                    <p
                                                        className="
                                                            text-xs
                                                            font-bold
                                                            text-slate-700
                                                        "
                                                    >
                                                        {
                                                            text
                                                        }
                                                    </p>

                                                </div>


                                                {/* =====================================
                                                    TYRE
                                                ====================================== */}

                                                {isTyre ? (

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-2
                                                            w-[220px]
                                                        "
                                                    >

                                                        {label === "E" && (
                                                            <select
                                                                className="w-full p-2 bg-slate-100 rounded-xl text-xs font-bold"
                                                                value={tyre.available === false ? "no" : "yes"}
                                                                onChange={e => updateSpareTyreAvailability(e.target.value === "yes")}
                                                            >
                                                                <option value="yes">Spare Tyre Available</option>
                                                                <option value="no">Not Available</option>
                                                            </select>
                                                        )}

                                                        {!(label === "E" && tyre.available === false) && (
                                                            <>

                                                        {/* ROW 1 */}

                                                        <div
                                                            className="
                                                                flex
                                                                gap-2
                                                            "
                                                        >

                                                            <select
                                                                className="
                                                                    w-1/2
                                                                    p-2
                                                                    bg-slate-100
                                                                    rounded-xl
                                                                    text-xs
                                                                    text-center
                                                                    font-bold
                                                                "
                                                                value={
                                                                    tyre.week ||
                                                                    ""
                                                                }
                                                                onChange={e =>
                                                                    updateTyreField(
                                                                        label,
                                                                        "week",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            >

                                                                <option value="">
                                                                    Week
                                                                </option>


                                                                {weeks.map(
                                                                    week => (

                                                                        <option
                                                                            key={
                                                                                week
                                                                            }
                                                                            value={
                                                                                week
                                                                            }
                                                                        >
                                                                            {
                                                                                week
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>


                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                maxLength={4}
                                                                placeholder="Year"
                                                                className="
                                                                    w-1/2
                                                                    p-2
                                                                    bg-slate-100
                                                                    rounded-xl
                                                                    text-xs
                                                                    text-center
                                                                    font-bold
                                                                "
                                                                value={
                                                                    tyre.year ||
                                                                    ""
                                                                }
                                                                onChange={e => {

                                                                    const value =
                                                                        e.target.value.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        );


                                                                    if (
                                                                        value.length <=
                                                                        4
                                                                    ) {

                                                                        updateTyreField(
                                                                            label,
                                                                            "year",
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                            />

                                                        </div>


                                                        {/* ROW 2 */}

                                                        <div
                                                            className="
                                                                flex
                                                                gap-2
                                                            "
                                                        >

                                                            <input
                                                                type="number"
                                                                inputMode="decimal"
                                                                step="0.1"
                                                                min="0"
                                                                placeholder="Depth mm"
                                                                className="
                                                                    w-1/2
                                                                    p-2
                                                                    bg-slate-100
                                                                    rounded-xl
                                                                    text-xs
                                                                    text-center
                                                                    font-bold
                                                                "
                                                                value={
                                                                    tyre.depth ||
                                                                    ""
                                                                }
                                                                onChange={e =>
                                                                    updateTyreField(
                                                                        label,
                                                                        "depth",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />


                                                            <input
                                                                type="text"
                                                                placeholder="Manufacturer"
                                                                className="
                                                                    w-1/2
                                                                    p-2
                                                                    bg-slate-100
                                                                    rounded-xl
                                                                    text-xs
                                                                    font-bold
                                                                "
                                                                value={
                                                                    tyre.manufacturer ||
                                                                    ""
                                                                }
                                                                onChange={e =>
                                                                    updateTyreField(
                                                                        label,
                                                                        "manufacturer",
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />

                                                        </div>


                                                        {/* TYRE CONDITION */}

                                                        {tyreCondition && (

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    px-3
                                                                    py-2
                                                                    rounded-xl
                                                                    bg-slate-100
                                                                "
                                                            >

                                                                <span
                                                                    className="
                                                                        text-[10px]
                                                                        font-black
                                                                        text-slate-500
                                                                    "
                                                                >
                                                                    {
                                                                        tyreCondition.condition
                                                                    }
                                                                </span>


                                                                <span
                                                                    className="
                                                                        text-[10px]
                                                                        font-black
                                                                        text-slate-700
                                                                    "
                                                                >
                                                                    {
                                                                        tyreCondition.score
                                                                    }%
                                                                </span>

                                                            </div>

                                                        )}

                                                            </>
                                                        )}

                                                    </div>

                                                ) : (

                                                    /* =====================================
                                                       NORMAL CHECKLIST
                                                    ====================================== */

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-2
                                                            items-end
                                                        "
                                                    >

                                                        {/* STATUS */}

                                                        <div
                                                            className={`
                                                                flex
                                                                p-1
                                                                rounded-2xl
                                                                ${notApplicable
                                                                    ? "bg-slate-200 opacity-60"
                                                                    : "bg-slate-100"
                                                                }
                                                            `}
                                                        >

                                                            {/* PASSED */}

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    notApplicable
                                                                }
                                                                onClick={() =>
                                                                    !notApplicable &&
                                                                    handleStatusChange(
                                                                        label,
                                                                        1
                                                                    )
                                                                }
                                                                className={`
                                                                    px-3
                                                                    py-1
                                                                    text-[10px]
                                                                    font-black
                                                                    rounded-xl
                                                                    ${currentVal ===
                                                                        1
                                                                        ? "bg-green-500 text-white"
                                                                        : "text-slate-500"
                                                                    }
                                                                `}
                                                            >
                                                                PASSED
                                                            </button>


                                                            {/* ISSUE */}

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    notApplicable
                                                                }
                                                                onClick={() =>
                                                                    !notApplicable &&
                                                                    handleStatusChange(
                                                                        label,
                                                                        0
                                                                    )
                                                                }
                                                                className={`
                                                                    px-3
                                                                    py-1
                                                                    text-[10px]
                                                                    font-black
                                                                    rounded-xl
                                                                    ${currentVal ===
                                                                        0
                                                                        ? "bg-red-500 text-white"
                                                                        : "text-slate-500"
                                                                    }
                                                                `}
                                                            >
                                                                ISSUE
                                                            </button>

                                                        </div>


                                                        {/* AUTOMATIC NA */}

                                                        {notApplicable && (

                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    font-black
                                                                    text-slate-400
                                                                "
                                                            >
                                                                NOT APPLICABLE
                                                            </span>

                                                        )}


                                                        {/* =================================
                                                            FINDINGS
                                                        ================================== */}

                                                        {!notApplicable && (

                                                            <textarea
                                                                rows={2}
                                                                placeholder={
                                                                    currentVal ===
                                                                        0
                                                                        ? "ISSUE / Findings"
                                                                        : "Condition Verified / Findings"
                                                                }
                                                                value={
                                                                    typeof results[
                                                                        label
                                                                    ] ===
                                                                        "object" &&
                                                                        results[
                                                                        label
                                                                        ] &&
                                                                        "comment" in
                                                                        results[
                                                                        label
                                                                        ]
                                                                        ? (
                                                                            results[
                                                                            label
                                                                            ] as {
                                                                                comment?: string;
                                                                            }
                                                                        )
                                                                            .comment ||
                                                                        ""
                                                                        : ""
                                                                }
                                                                onChange={e =>
                                                                    handleCommentChange(
                                                                        label,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`
                                                                    w-[220px]
                                                                    p-2
                                                                    rounded-xl
                                                                    text-[10px]
                                                                    resize-none
                                                                    ${currentVal ===
                                                                        0
                                                                        ? "bg-red-50 border border-red-200"
                                                                        : "bg-slate-50 border border-slate-200"
                                                                    }
                                                                `}
                                                            />

                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>

                    )
                )}


                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className={`
                        w-full
                        bg-slate-900
                        text-white
                        py-6
                        rounded-[2rem]
                        font-black
                        uppercase
                        tracking-widest
                        shadow-2xl
                        sticky
                        bottom-6
                        transition-all
                        ${loading
                            ? "opacity-50 cursor-not-allowed"
                            : "active:scale-95"
                        }
                    `}
                >
                    {
                        loading
                            ? "Submitting..."
                            : "Complete Report"
                    }
                </button>

            </form>


            {/* ==================================================
                TOAST
            ================================================== */}

            {toast && (

                <div
                    className="
                        fixed
                        bottom-8
                        left-1/2
                        -translate-x-1/2
                        z-[999]
                    "
                >

                    <div
                        className="
                            bg-slate-900
                            text-white
                            px-6
                            py-4
                            rounded-2xl
                            shadow-2xl
                            text-xs
                            font-black
                            uppercase
                            tracking-widest
                            animate-[fadeIn_0.3s_ease]
                        "
                    >
                        {
                            toast
                        }
                    </div>

                </div>

            )}

        </div>
    );
}