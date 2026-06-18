"use client";

import { useState } from "react";

export default function VinDecoderPage() {
    const [vin, setVin] = useState("");
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);
    const [showInfo, setShowInfo] = useState(false);
    // ---------------- DATA ----------------
    const yearMap: any = {
        L: 2020, M: 2021, N: 2022, P: 2023,
        R: 2024, S: 2025, T: 2026, V: 2027
    };

    const monthMap: any = {
        A: "January", B: "February", C: "March",
        D: "April", E: "May", F: "June",
        G: "July", H: "August", J: "September",
        K: "October", L: "November", M: "December"
    };

    const plantMap: any = {
        M: "Thoothukudi (VinFast India)",
        H: "Hai Phong (Vietnam)",
        A: "Ahmedabad / Sanand",
        C: "Chakan (Pune)",
        G: "Chakan / Gurugram",
        K: "Kanchipuram",
        S: "Sriperumbudur"
    };

    const brandRules = [
        { name: "Tata Motors", wmi: ["MAT"], monthIndex: 11 },
        { name: "Maruti Suzuki", wmi: ["MA3"], monthIndex: 10 },
        { name: "Mahindra", wmi: ["MA1"], monthIndex: 11 },
        { name: "Toyota", wmi: ["MBJ"], monthIndex: 11 },
        { name: "Honda", wmi: ["MAK"], monthIndex: 8 },
        { name: "Volkswagen", wmi: ["WVW", "MEX"], monthIndex: 3 },
        { name: "Skoda", wmi: ["TMB", "MBH"], monthIndex: 5 },
        { name: "VinFast", wmi: ["P7T"], monthIndex: 11 },
        { name: "MG Motor", wmi: ["MZ7"], monthIndex: 11 },
        { name: "Hyundai", wmi: ["MAL"], monthIndex: 11, altIndex: 18 },
        { name: "Kia", wmi: ["MZ2", "MZ3"], monthIndex: 11, altIndex: 18 },
        { name: "Renault", wmi: ["MEE"], monthIndex: 11 },
        { name: "Nissan", wmi: ["MDH"], monthIndex: 11 },
        { name: "Jeep (Stellantis)", wmi: ["MCA"], monthIndex: 11 },
        { name: "Isuzu", wmi: ["MP1"], monthIndex: 11 },
        { name: "Ford", wmi: ["MAJ"], monthIndex: 11 }
    ];
    const brandLogos: any = {
        "Tata Motors": "/logos/tata.png",
        "Maruti Suzuki": "/logos/maruti.png",
        "Mahindra": "/logos/mahindra.png",
        "Toyota": "/logos/toyota.png",
        "Honda": "/logos/honda.png",
        "Volkswagen": "/logos/volkswagen.png",
        "Skoda": "/logos/skoda.png",
        "VinFast": "/logos/vinfast.png",
        "MG Motor": "/logos/mg.png",
        "Hyundai": "/logos/hyundai.png",
        "Kia": "/logos/kia.png",
        "Renault": "/logos/renault.png",
        "Nissan": "/logos/nissan.png",
        "Jeep (Stellantis)": "/logos/jeep.png",
        "Isuzu": "/logos/isuzu.png",
        "Ford": "/logos/ford.png"
    };
    // ---------------- MODEL LOGIC ----------------
    function refineVehicleData(vin: string, base: any) {
        const vds = vin.substring(3, 8);
        const wmi = vin.substring(0, 3);

        let result = {
            brand: base.name,
            model: "Unknown",
            monthIdx: base.monthIndex
        };

        if (wmi === "MEX" || wmi === "WVW" || wmi === "TMB") {
            const vds = vin.substring(3, 8);

            // Volkswagen & Skoda (Shared WMI) Mapping
            if (vds.startsWith("VG")) {
                result.brand = "Volkswagen";
                result.model = "Virtus";
                result.monthIdx = 3; // VW uses 4th character (Index 3)
            }
            else if (vds.startsWith("TG")) {
                result.brand = "Volkswagen";
                result.model = "Taigun";
                result.monthIdx = 3;
            }
            else if (vds.startsWith("KP")) {
                result.brand = "Skoda";
                result.model = "Kushaq";
                result.monthIdx = 5; // Skoda uses 6th character (Index 5)
            }
            else if (vds.startsWith("SL")) {
                result.brand = "Skoda";
                result.model = "Slavia";
                result.monthIdx = 5;
            }
            else if (vds.startsWith("AW")) {
                result.brand = "Volkswagen";
                result.model = "Polo / Vento (Legacy)";
                result.monthIdx = 3;
            }
        }
        if (wmi === "TMB" || wmi === "MBH") {
            const vds = vin.substring(3, 8);

            // Skoda Global / Premium Model Mapping
            if (vds.startsWith("NP")) result.model = "Superb";
            else if (vds.startsWith("NX")) result.model = "Octavia";
            else if (vds.startsWith("NS")) result.model = "Kodiaq";
            else if (vds.startsWith("NU")) result.model = "Karoq";

            // Skoda specific month index (6th character)
            result.brand = "Skoda";
            result.monthIdx = 5;
        }
        if (wmi === "MAT") {
            const vds = vin.substring(3, 8);

            // Tata Model Mapping
            if (vds.startsWith("878")) result.model = "Nexon";
            else if (vds.startsWith("627")) result.model = "Punch";
            else if (vds.startsWith("618")) result.model = "Tiago";
            else if (vds.startsWith("619")) result.model = "Tigor";
            else if (vds.startsWith("883")) result.model = "Harrier";
            else if (vds.startsWith("884")) result.model = "Safari";
            else if (vds.startsWith("873")) result.model = "Altroz";
            else if (vds.startsWith("881")) result.model = "Curvv";
            else result.model = "Tata (Unknown Model)";
        }
        if (wmi === "MA3") {
            const vds = vin.substring(3, 8);

            // Maruti Suzuki Model Mapping
            if (vds.startsWith("ERK")) result.model = "Ertiga";
            else if (vds.startsWith("EYN")) result.model = "Baleno";
            else if (vds.startsWith("EWA")) result.model = "Brezza";
            else if (vds.startsWith("E1S")) result.model = "Swift";
            else if (vds.startsWith("ED7")) result.model = "Dzire";
            else if (vds.startsWith("EMA")) result.model = "Alto K10";
            else if (vds.startsWith("E01")) result.model = "S-Presso";
            else if (vds.startsWith("EUW")) result.model = "Grand Vitara";
            else if (vds.startsWith("EXV")) result.model = "XL6";
            else if (vds.startsWith("EFB")) result.model = "Fronx";
            else if (vds.startsWith("E6R")) result.model = "Jimny";
            else if (vds.startsWith("E7N")) result.model = "Invicto";
            else result.model = "Maruti Suzuki (Unknown Model)";
        }
        if (wmi === "MA1") {
            const vds = vin.substring(3, 8);

            // Mahindra Model Mapping
            if (vds.startsWith("A3") || vds.startsWith("A4")) result.model = "XUV700";
            else if (vds.startsWith("A6")) result.model = "Scorpio-N";
            else if (vds.startsWith("S1")) result.model = "Scorpio Classic";
            else if (vds.startsWith("T2")) result.model = "Thar";
            else if (vds.startsWith("M1")) result.model = "XUV300 / XUV 3XO";
            else if (vds.startsWith("B2")) result.model = "Bolero";
            else if (vds.startsWith("B6")) result.model = "Bolero Neo";
            else if (vds.startsWith("A8")) result.model = "XUV400 EV";
            else if (vds.startsWith("W8")) result.model = "Marazzo";
            else result.model = "Mahindra (Unknown Model)";
        }
        if (wmi === "MBJ") {
            const vds = vin.substring(3, 8);

            // Toyota India Model Mapping
            if (vds.startsWith("JJ")) result.model = "Innova Hycross";
            else if (vds.startsWith("IV")) result.model = "Innova Crysta";
            else if (vds.startsWith("FB")) result.model = "Urban Cruiser Hyryder";
            else if (vds.startsWith("FA")) result.model = "Glanza";
            else if (vds.startsWith("FT")) result.model = "Fortuner";
            else if (vds.startsWith("HL")) result.model = "Hilux";
            else if (vds.startsWith("TA")) result.model = "Taisor";
            else if (vds.startsWith("CP")) result.model = "Camry";
            else if (vds.startsWith("VE")) result.model = "Vellfire";
            else result.model = "Toyota (Unknown Model)";
        }
        if (wmi === "MAK") {
            const vds = vin.substring(3, 8);

            // Honda India Model Mapping
            if (vds.startsWith("DG4")) result.model = "Amaze (2nd Gen)";
            else if (vds.startsWith("DG5")) result.model = "Amaze (3rd Gen / 2025+)";
            else if (vds.startsWith("GN5")) result.model = "City (5th Gen)";
            else if (vds.startsWith("GN6")) result.model = "City e:HEV (Hybrid)";
            else if (vds.startsWith("DG9")) result.model = "Elevate";
            else if (vds.startsWith("GM6")) result.model = "City (4th Gen)";
            else if (vds.startsWith("GK6")) result.model = "Jazz";
            else if (vds.startsWith("RU1")) result.model = "HR-V / Elevate Global";
            else result.model = "Honda (Unknown Model)";
            // Correction for Honda's specific month placement
            result.monthIdx = 8;
        }
        if (wmi === "MZ7") {
            const vds = vin.substring(3, 8);

            // MG Motor India Model Mapping
            if (vds.startsWith("HE2")) result.model = "Hector";
            else if (vds.startsWith("HE3")) result.model = "Hector Plus";
            else if (vds.startsWith("AS2")) result.model = "Astor";
            else if (vds.startsWith("ZS2")) result.model = "ZS EV";
            else if (vds.startsWith("CO1")) result.model = "Comet EV";
            else if (vds.startsWith("GL1")) result.model = "Gloster";
            else if (vds.startsWith("WI1")) result.model = "Windsor EV";
            else if (vds.startsWith("CY1")) result.model = "Cyberster";
            else result.model = "MG (Unknown Model)";
        }
        if (wmi === "MAL") {
            const vds = vin.substring(3, 8);

            // Hyundai India Model Mapping
            if (vds.startsWith("C5")) result.model = "Creta";
            else if (vds.startsWith("B5")) result.model = "Venue";
            else if (vds.startsWith("A5")) result.model = "Verna";
            else if (vds.startsWith("AA")) result.model = "Grand i10 Nios";
            else if (vds.startsWith("BB")) result.model = "i20 / i20 N-Line";
            else if (vds.startsWith("CY")) result.model = "Alcazar";
            else if (vds.startsWith("EX")) result.model = "Exter";
            else if (vds.startsWith("T5")) result.model = "Tucson";
            else if (vds.startsWith("I3")) result.model = "Ioniq 5 (EV)";
            else if (vds.startsWith("K5")) result.model = "Kona Electric";
            else result.model = "Hyundai (Unknown Model)";
        }
        if (wmi === "MZ2" || wmi === "MZ3") {
            const vds = vin.substring(3, 8);

            // Kia India Model Mapping
            if (vds.startsWith("SP2")) result.model = "Seltos";
            else if (vds.startsWith("QY")) result.model = "Sonet";
            else if (vds.startsWith("KY")) result.model = "Carens";
            else if (vds.startsWith("KA4")) result.model = "Carnival (4th Gen)";
            else if (vds.startsWith("YP")) result.model = "Carnival (Legacy)";
            else if (vds.startsWith("CV")) result.model = "EV6";
            else if (vds.startsWith("MV")) result.model = "EV9";
            else if (vds.startsWith("SY")) result.model = "Clavis / Syros (2025+)";
            else result.model = "Kia (Unknown Model)";
        }
        if (wmi === "MEE") {
            const vds = vin.substring(3, 8);

            // Renault India Model Mapping
            if (vds.startsWith("RCK")) result.model = "Kwid";
            else if (vds.startsWith("RBC")) result.model = "Triber";
            else if (vds.startsWith("HJF")) result.model = "Kiger";
            else if (vds.startsWith("HSA")) result.model = "Duster (Legacy)";
            else if (vds.startsWith("JSA")) result.model = "Captur";
            else if (vds.startsWith("R4D")) result.model = "Duster (2025/2026+)";
            else result.model = "Renault (Unknown Model)";
        }
        if (wmi === "MDH") {
            const vds = vin.substring(3, 8);
            result.brand = "Nissan";
            // Nissan India Model Mapping (priority: specific → general)
            if (vds.startsWith("HJA")) result.model = "Magnite";
            else if (vds.startsWith("JSA")) result.model = "Kicks";
            else if (vds.startsWith("HSA")) result.model = "Terrano (Legacy)";
            else if (vds.startsWith("NKA")) result.model = "Sunny (Legacy)";
            else if (vds.startsWith("LKA")) result.model = "Micra (Legacy)";
            else if (vds.startsWith("XTR")) result.model = "X-Trail (CBU)";
            else if (vds.startsWith("P4D")) result.model = "New Gen SUV (2025+)";
            else result.model = "Nissan (Unknown Model)";
        }
        if (wmi === "MCA") {
            const vds = vin.substring(3, 8);

            // Jeep (Stellantis India) Model Mapping
            if (vds.startsWith("639")) {
                result.model = "Compass";
            } else if (vds.startsWith("640")) {
                result.model = "Meridian";
            } else if (vds.startsWith("603")) {
                result.model = "Wrangler (Local Assembly)";
            } else if (vds.startsWith("621")) {
                result.model = "Grand Cherokee (Local Assembly)";
            }
            else result.model = "Jeep (Unknown Model)";
        }
        if (wmi === "MP1") {
            const vds = vin.substring(3, 8);

            // Isuzu India Model Mapping
            if (vds.startsWith("TFR")) {
                result.model = "D-Max (Single Cab / S-Cab)";
            } else if (vds.startsWith("TFS")) {
                result.model = "D-Max V-Cross";
            } else if (vds.startsWith("UCR")) {
                result.model = "MU-X";
            } else if (vds.startsWith("NKR")) {
                result.model = "Isuzu Commercial Truck";
            }
            else result.model = "Isuzu (Unknown Model)";
        }
        if (wmi === "MAJ") {
            const vds = vin.substring(3, 8);

            // Ford India Model Mapping
            if (vds.startsWith("XXB")) {
                result.model = "EcoSport";
            } else if (vds.startsWith("XXA")) {
                result.model = "Endeavour";
            } else if (vds.startsWith("XXG")) {
                result.model = "Figo";
            } else if (vds.startsWith("XXH")) {
                result.model = "Aspire";
            } else if (vds.startsWith("XXF")) {
                result.model = "Freestyle";
            } else if (vds.startsWith("JXP")) {
                result.model = "Fiesta (Legacy)";
            } else if (vds.startsWith("XXE")) {
                result.model = "Ford Mustang (CBU)";
            }
            else result.model = "Ford (Unknown Model)";
        }
        // VinFast Model Selection
        // VinFast Model Selection (P7T)
        if (wmi === "P7T") {
            const vds = vin.substring(3, 8);
            if (vds.startsWith("VF3")) result.model = "VF 3";
            else if (vds.startsWith("VF5")) result.model = "VF 5";
            else if (vds.startsWith("VF6")) result.model = "VF 6";
            else if (vds.startsWith("VF7")) result.model = "VF 7";
            else if (vds.startsWith("VF8")) result.model = "VF 8";
            else if (vds.startsWith("VF9")) result.model = "VF 9";
            else if (vds.startsWith("VFe")) result.model = "VF e34";
            else result.model = "VinFast (Unknown Model)";
        }

        return result;
    }

    // ---------------- MAIN ----------------
    function decodeVIN() {
        if (vin.length !== 17) {
            setError("Please enter a valid 17-character VIN");
            setResult(null);
            return;
        }

        setError("");

        const wmi = vin.substring(0, 3);
        const base =
            brandRules.find(r => r.wmi.includes(wmi)) || { name: "Unknown" };

        const vehicle = refineVehicleData(vin, base);

        const year = yearMap[vin[9]] || "Unknown";
        const month =
            vehicle.monthIdx !== undefined
                ? monthMap[vin[vehicle.monthIdx]] || "Unknown"
                : "N/A";

        const plant = plantMap[vin[10]] || "Unknown";
        const checkVariant = () => {
            // 1. Check if model name already contains "EV" (e.g., "ZS EV", "XUV400 EV")
            if (vehicle.model.toLowerCase().includes("ev")) return "Electric";

            // 2. Purely Electric Brands
            if (["VinFast", "Tesla"].includes(vehicle.brand)) return "Electric";

            // 3. Targeted 8th Digit Check (Position 7) 
            // For many manufacturers (Hyundai, Kia, MG, Toyota), 
            // the 8th digit is the Engine/Motor identifier.
            const engineDigit = vin[7];

            const evEngineCodes: any = {
                "Hyundai": ["1", "3", "6", "7", "8", "A", "E"],
                "Kia": ["E", "G", "H"],
                "MG Motor": ["E", "S"], // 'E' is common for MG electric drivetrains
                "Toyota": ["B", "E"]    // 'B' often used for Battery Electric
            };

            if (evEngineCodes[vehicle.brand]?.includes(engineDigit)) {
                return "Electric";
            }

            return "ICE / Hybrid";
        };

        setResult({
            vin,
            brand: vehicle.brand,
            model: vehicle.model,
            year,
            month,
            plant,
            variant: checkVariant()
        });
    }

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h2 style={styles.heading}>VIN DECODER</h2>

                <div style={styles.inputGroup}>
                    <input
                        style={styles.input}
                        value={vin}
                        onChange={(e) =>
                            setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                        }
                        placeholder="Enter 17-digit VIN"
                    />
                    <button style={styles.button} onClick={decodeVIN}>
                        DECODE
                    </button>
                </div>

                <div style={styles.error}>{error}</div>

                {result && (
                    <div style={styles.result}>
                        {/* 🔥 BRAND LOGO */}
                        {brandLogos[result.brand] && (
                            <div style={styles.logoWrap}>
                                <img
                                    src={brandLogos[result.brand]}
                                    alt={result.brand}
                                    style={styles.logo}
                                />
                            </div>
                        )}
                        {[
                            "vin",
                            "brand",
                            "model",
                            "year",
                            "month",
                            "plant",
                            "variant"
                        ].map((key) => {
                            const value = result[key];
                            if (!value) return null;


                            const labelMap: any = {
                                vin: "VIN",
                                brand: "BRAND",
                                model: "MODEL",
                                year: "YEAR",
                                month: "MONTH",
                                plant: "PLANT",
                                variant: "VARIANT"
                            };

                            return (
                                <div key={key} style={styles.row}>
                                    <div style={styles.label}>
                                        {labelMap[key] || key.toUpperCase()}
                                    </div>
                                    <div style={styles.value}>{String(value)}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* INFO BOX */}
                <div style={styles.infoBox}>
                    <div
                        style={styles.infoHeader}
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        <span>Why are some fields unknown?</span>
                        <span>{showInfo ? "⌃" : "⌄"}</span>
                    </div>

                    {showInfo && (
                        <div style={styles.infoContent}>
                            <p>Please ensure the VIN entered is complete and accurate.</p>
                            <p>We attempt to decode as much information as possible.</p>
                            <p>
                                Some manufacturers do not encode every detail, so certain
                                information may not always be available.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---------------- STYLES ----------------
const styles: any = {
    body: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        fontFamily: "Inter, sans-serif"
    },

    container: {
        width: "100%",
        maxWidth: 480,
        background: "#b1a5f8",
        borderRadius: "2.5rem",
        padding: "32px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
    },

    heading: {
        textAlign: "center",
        fontSize: "28px",
        fontWeight: 900,
        letterSpacing: "-0.02em",
        color: "#0f172a",
        marginBottom: 20
    },

    inputGroup: {
        display: "flex",
        gap: 12,
        marginBottom: 10
    },

    input: {
        flex: 1,
        padding: "14px 16px",
        borderRadius: "1.25rem",
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        fontWeight: 600,
        outline: "none"
    },

    button: {
        padding: "14px 20px",
        borderRadius: "1.25rem",
        background: "#4f46e5",
        color: "#fff",
        fontWeight: 800,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(79,70,229,0.2)"
    },

    error: {
        color: "#910000",
        fontSize: 18,
        marginTop: 10,
        textAlign: "center",
        minHeight: 16
    },

    result: {
        marginTop: 20,
        background: "#ffffff",
        borderRadius: "1.75rem",
        padding: "20px",
        border: "1px solid #f1f5f9"
    },
    logoWrap: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 16
    },

    logo: {
        height: 100,
        objectFit: "contain"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #f1f5f9"
    },

    label: {
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#4f46e5"
    },

    value: {
        fontWeight: 800,
        color: "#0f172a",
        textAlign: "right"
    },

    infoBox: {
        marginTop: 20,
        background: "#ffffff",
        borderRadius: "1.5rem",
        border: "1px solid #f1f5f9",
        overflow: "hidden"
    },

    infoHeader: {
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: 900,
        fontSize: 13,
        color: "    #4f46e5"
    },

    infoContent: {
        padding: "0 16px 16px 16px",
        fontSize: 13,
        color: "#64748b",
        lineHeight: 1.6
    }
}; 
