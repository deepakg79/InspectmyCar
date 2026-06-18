export const BRAND_CHECKPOINTS: Record<string, string[]> = {
    tata: [
        "Paint thickness check (known for factory over-sprays)",
        "Panel gap symmetry (especially around the tailgate)",
        "Infotainment & iRA connected car activation check",
        "Wheel alignment & alloy scuff inspection"
    ],
    mahindra: [
        "Electronic flush door handle mechanism (XUV700/EV)",
        "Sunroof water drainage & seal integrity",
        "Adrenox system & sensor calibration scan",
        "Engine bay harness routing & clip security"
    ],
    hyundai: [
        "Dashboard rattle & fitment check",
        "Dual-clutch transmission (DCT) temperature check",
        "SmartSense ADAS camera & radar alignment",
        "Underbody coating & exhaust rust inspection"
    ],
    kia: [
        "Brake pedal feel & ABS sensor response",
        "Interior leatherette stitching & seat ventilation",
        "LED headlight throw & leveling calibration",
        "UVO/Kia Connect eSIM signal strength"
    ],
    // Default for others
    general: [
        "Full OBD-II diagnostic error code scan",
        "Fluid levels & manufacturing date verification",
        "Electrical systems & battery health check",
        "Tyre pressure & manufacturing week (DOT) check"
    ]
};