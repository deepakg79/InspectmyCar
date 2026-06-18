const checklist = [

    /* ================= ENGINE ASSEMBLY ================= */
    {
        section: "Engine Assembly",
        startNo: 1,
        items: [
            "Engine: Check for misfiring",
            "Engine: Abnormal noise",
            "Engine: Check for overheating",
            "Engine: Poor acceleration",
            "Engine: Starting issues",
            "Engine: Check for blue, grey & white smoke",
            "Engine: Check for rough idling",
            "Engine: Back compression",
            "Engine: Check for tappet noise",
            "Engine: Check for timing noise",
            "Engine: Check engine control module",
            "Engine: Check for engine number mismatch",
            "Engine: Check oil level",
            "Engine: Oil sludge & water contamination",
            "Engine Mounts: Check for cracks, leaks & abnormal vibrations",
            "Engine Oil Pump: Check for functionality",
            "Engine Gaskets & Seals: Check for leaks",
            "Engine: Head gasket leakage/damage",
            "Engine Pulleys: Check for damage",
            "Engine pulley: Abnormal noise",
            "Engine V-Belt / Serpentine Belt: Check for damage",
            "Engine V-Belt / Serpentine Belt: Abnormal noise",
            "Engine Sensors: Check for functionality",
            "Vacuum Lines & Hoses: Check for leaks",
            "Vacuum Pump: Check for leaks",
            "Vacuum Modulator: Check for leaks"
        ]
    },
    {
        section: "Engine Cooling System",
        startNo: 27,
        items: [
            "Cooling System: Check for corrosion",
            "Cooling system: Coolant level",
            "Cooling system: oil contamination",
            "Radiator: Check for damage",
            "Radiator: leaks",
            "Radiator Fan: Check for abnormal noise",
            "Water Pump: Check for abnormal noise",
            "Water pump: leaks"
        ]
    },

    {
        section: "Air Intake System",
        startNo: 35,
        items: [
            "Air Filter: Check for unclean / dirty filter",
            "Air filter body: Damage/abnormal noise",
            "Intake Manifold: Check for cracks and leaks",
            "EVAP System: Check for damage / leaks",
            "Hoses: Check for leaks",
            {
                text: "Intercooler: Check for damage / leaks",
                notFor: ["Petrol", "CNG"]
            },
            "Air Intake Sensors: Check for functionality",
            "Throttle Body: Check for functionality"
        ]
    },

    {
        section: "Ignition System",
        startNo: 43,
        items: [
            "Alternator: Check for abnormal noise",
            "Battery: Check for bulges",
            "Battery: leaks",
            "Battery: Incorrect size",
            "Battery: low voltage",
            "Battery: long cranking",
            "Battery Terminals: Check for corrosion / cracks",
            "Fuses & Relays: Check for blown fuses and relays",
            {
                text: "Ignition Coil: Check for functionality",
                notFor: ["Diesel"]
            },
            {
                text: "Spark Plugs: Check for functionality",
                notFor: ["Diesel"]
            },
            {
                text: "Glow Plugs: Check for functionality",
                notFor: ["Petrol", "CNG"]
            },
            "Starter Motor: Check for abnormal noise",
            "Wiring Harness: Check for cuts & loose connections",
            "Wiring Harness: Check for wiring harness repair and tampered"
        ]
    },

    {
        section: "Exhaust System",
        startNo: 57,
        items: [
            "Catalytic Converter: Check for damage / leaks",
            {
                text: "DPF: Check for damage / leaks",
                notFor: ["Petrol", "CNG"]
            },
            {
                text: "EGR: Check for damage / leaks",
                notFor: ["Petrol", "CNG"]
            },
            "Exhaust Sensors: Check for functionality",
            "Tailpipe: Check for bends",
            "Tailpipe: corrosion",
            "Tailpipe: cracks & leaks",
            "Tailpipe: Check for abnormal noise",
            "Turbocharger: Check for leaks",
            "Turbocharger: whistling noise",
            "Heat Shield: Check for damage"
        ]
    },

    {
        section: "Fuel Supply System",
        startNo: 68,
        items: [
            "Fuel Filter: Check for damage / leaks",
            "Fuel Injectors: Check for damages",
            "Fuel injector: leaks or abnormal noise",
            "Fuel Lid & Cap: Check for damage / leaks",
            "Fuel Lines & Rails: Check for leaks",
            "Fuel Pump: Check for leaks",
            "Fuel Tank: Check for leaks",
            "Fuel Tank: dents",
            {
                text: "CNG Fuel Valve: Check for damage",
                notFor: ["Petrol", "Diesel"]
            },
            {
                text: "CNG Fuel Valve: Check for leaks",
                notFor: ["Petrol", "Diesel"]
            },
            {
                text: "CNG Lines & Tank: Check for damage",
                notFor: ["Petrol", "Diesel"]
            },
            {
                text: "CNG Lines & Tank: Check for leaks",
                notFor: ["Petrol", "Diesel"]
            },
            {
                text: "CNG System: Check fuel switch mode functionality",
                notFor: ["Petrol", "Diesel"]
            }
        ]
    },
    /* ================= TRANSMISSION ================= */
    {
        section: "Transmission Assembly",
        startNo: 81,
        items: [
            "Gearbox Housing (clutch bell housing): Check for damages",
            "Gearbox main housing: Check for damages",
            "Transmission Gaskets & Seals: Check for leaks",
            "Gear Lever: Check for hardness",
            "Gear lever: Check for slippage",
            "Gear Lever: Check for play",
            "Gear level knob: Check for damage",
            "Transmission Oil Pump: Check for functionality",
            "Gearbox: Check for abnormal noise"
        ]
    },

    {
        section: "Final Drive",
        startNo: 90,
        items: [
            "Differentials: Check for damage",
            "Differentials: Check for leaks",
            "Drive Axles: Check for bends",
            "Drive Axles: Check for abnormal noise",
            "Drive Axles seals: Check for leakage",
            "Propeller Shaft: Check for bends",
            "Propeller shaft: Check for abnormal noise",
            "Transfer Case: Check for damage",
            "Transfer case: Check for leaks",
            "Transfer case: Check for abnormal noise"
        ]
    },

    {
        section: "Clutch Assembly",
        startNo: 100,
        items: [
            {
                text: "Clutch: Check for juddering",
                notFor: ["Automatic transmission"]
            },
            {
                text: "Clutch: Check for vibration",
                notFor: ["Automatic transmission"]
            },
            {
                text: "Clutch: Check for hardness",
                notFor: ["Automatic transmission"]
            },
            {
                text: "Clutch: Check for sponginess & slippage",
                notFor: ["Automatic transmission"]
            },
            "Flywheel: Check for abnormal noise",
            "Master & Slave Cylinder: Check for damage / leaks"
        ]
    },

    /* ================= BODY & EXTERIOR ================= */
    {
        section: "Body Structure",
        startNo: 106,
        items: [
            "Floor Panels: Check for cracks & bends",
            "Floor panels: check for corrosion",
            "Floor panels: Check for accidental repair, punch repaired and replaced",
            "Legs: Check for cracks & bends",
            "Legs: Check for corrosion",
            "Legs: Check for accidental repair, punch repaired & replaced",
            "Cowl Top: Check for cracks & bends",
            "Cowl Top: Check for corrosion",
            "Cowl Top: Check for accidental repair, punch repaired & replaced",
            "Wheel Houses: Check for cracks & bend",
            "Wheel Houses: Check for corrosion",
            "Wheel Houses: Check for accidental repair, punch repaired & replaced",
            "Firewall: Check for cracks & bends",
            "Firewall: Check for accidental repair, punch repaired & replaced",
            "Apron Sidewalls: Check for cracks & bends",
            "Apron sidewalls: check for corrosion",
            "Apron sidewalls: Check for accidental repair, punch repaired & replaced",
            "Apron Strut Towers: Check for corrosion",
            "Apron Strut Towers: Check for cracks & bends",
            "Apron Strut Towers: Check for accidental repair, punch repaired & replaced",
            "Right side pillars (A,B,C,D): Check for cracks & bend",
            "Right side pillars: Check for corrosion, scratches & dent",
            "Right side pillars: Check for accidental repair, punch repaired & replaced",
            "Left side pillars: Check for crack & bend",
            "Left side pillars: Check for corrosion, scratches & dent",
            "Left side pillars: Check for accidental repair, punch repaired & replaced",
            "Dickey Floor: Check for cracks & bends",
            "Dickey Floor: Check for corrosion",
            "Dickey Floor: Check for accidental repair, punch repaired & replaced",
            "Dickey Back Panel: Check for cracks & bend",
            "Dickey back panel: Check for corrosion & sealant crack",
            "Dickey back panel: Check for accidental repair, punch repaired & replaced",
            "Dickey Firewall: Check for cracks & bend",
            "Dickey firewall: Check for corrosion",
            "Dickey firewall: Check for accidental repair, punch repaired & replaced",
            "Dickey Sidewalls: Check for cracks & bends",
            "Dickey Sidewall: Check for accidental repair, punch repaired & replaced",
            "Dickey Sidewall: Check for corrosion",
            "Dickey Strut Towers: Check for cracks & bend",
            "Dickey Strut Towers: Check for corrosion",
            "Dickey Strut Towers: Check for accidental repair, punch repaired & replaced",
            "Radiator Support: Check for cracks & bend",
            "Radiator Support: Check for corrosion",
            "Radiator Support: Check for accidental repair, punch repaired & replaced",
            "Radiator fiber support: Check for crack and repaired",
            "Radiator bolted support: Check for crack, bend and repaired",
            "Roof: Check for cracks & bent",
            "Roof: Check for scratches, corrosion & dents",
            "Roof: Check for accidental repair, punch repaired & replaced",
            "Sunroof: Check for noise",
            "Sunroof: Check for leakage",
            "Sunroof: Check for glass damage"
        ]
    },

    {
        section: "Exterior Body Panels",
        startNo: 158,
        items: [
            "Doors: Check for alignment issues",
            "Doors: Check for repainted",
            "Doors: Check for paint defects and paint mismatch",
            "Doors: Check for corrosion and sealant repaired",
            "Doors: Check for scratches & dents",
            "Doors: Check for door cladding scratches & alignment issues",
            "Fenders: Check for alignment issues",
            "Fenders: Check for repainted",
            "Fenders: Check for corrosion",
            "Fenders: Check for scratches and dents",
            "Fenders: Check for paint defects and paint mismatch",
            "Bonnet: Check for alignment issues",
            "Bonnet: Check for repainted",
            "Bonnet: Check for corrosion",
            "Bonnet: Check for scratches and dents",
            "Bonnet: Check for paint mismatch & paint defect",
            "Dickey Door: Check for alignment issues",
            "Dickey door: Check for corrosion",
            "Dickey door: Check for repainted",
            "Dickey door: Check for scratches and dents",
            "Dickey door: Check for paint mismatch & paint defects",
            "Running Boards: Check for alignment issues",
            "Running boards: Check for accidental repair, punch repaired and replaced",
            "Running boards: Check for corrosion",
            "Running boards: Check for cracks and bend",
            "Running boards: Check for scratches and dents",
            "Running boards: Check for repainted",
            "Quarter Panels: Check for alignment issues",
            "Quarter panel: paint mismatch & paint defects",
            "Quarter Panels: Check for corrosion",
            "Quarter Panels: Check for repainted",
            "Quarter Panels: Check for accidental repair, punch repaired and replaced",
            "Quarter Panels: Check for scratches and dents",
            "Bumpers: Check for alignment issues",
            "Bumpers: Check for paint mismatch & paint defects",
            "Bumpers: Check for scratches",
            "Bumpers: Check for repainted"
        ]
    },

    {
        section: "Exterior Fitments",
        startNo: 195,
        items: [
            "Hinges: Check for abnormal noise, corrosion & dust accumulation",
            "Door Handles: Check for damage & functionality",
            "Grills: Check for bends, cracks, dents & scratches",
            "Antenna: Check functionality and damage",
            "Door Seals & Beedings: Check for damage",
            "Foglights: Check for cracks & moisture ingress",
            "Foglights: Check for scratches",
            "Headlights: Check for cracks & moisture ingress",
            "Headlights: Check for scratches",
            "Reverse Parking Lights: Check for cracks & moisture ingress",
            "Taillights: Check for cracks & moisture ingress",
            "Taillights: Check for scratches",
            "Turn Indicators: Check for cracks & moisture ingress",
            "Dickey Door Emblems: Check for damage",
            "Dickey Struts: Check for leaks",
            "Windshield Washer: Check fluid level",
            "Wipers: Check for abnormal noise and damage"
        ]
    },

    {
        section: "Glasses & Mirrors",
        startNo: 212,
        items: [
            "Rear defogger: Check for damage & functionality",
            "Side View Mirrors: Check for damage",
            "Side view Mirrors cover: Check for scratches and damage",
            "Side view Mirrors indicator: Check for damage",
            "Window Glasses: Check for damage",
            "Quarter glasses: Check for damage",
            "Windshields: Check for chips, cracks & scratches",
            "Windshields: Check for replacement"
        ]
    },

    /* ================= INTERIOR ================= */
    {
        section: "Interior & Safety",
        startNo: 220,
        items: [
            "Buttons & Switches: Check for damage & functionality",
            "Display Screen: Check for damage & functionality",
            "Speakers & Tweeters: Check for functionality",
            "AC Compressor: Check for damage & abnormal noise",
            "AC Condenser: Check for damage / leaks",
            "AC Direction Mode: Check for damage & functionality",
            "AC Temperature Control: Check for damage & functionality",
            "AC Blower: Check for damage & abnormal noise",
            "AC Display: Check for damage & functionality",
            "AC Filter: Check for unclean / dirty filter & bad odour",
            "AC Gas: Check level",
            "Cooling Coil: Check for leaks",
            "Heater Core: Check for leaks",
            "Hoses & Lines: Check for leaks",
            "AC Sensors: Check for functionality",
            "AC System: Check cooling / heating",
            "Airbags: Check for condition",
            "AC Vents: Check for damage",
            "Bonnet Release: Check for damage & functionality",
            "Cabin Lights: Check for damage & functionality",
            "Cluster Panel: Check for meter tampering or malfunctions",
            "Fuel Lid Release: Check for functionality",
            "Gauges & Meters: Check for functionality",
            "Glove Box: Check for damage & abnormal noise",
            "Center Console: Check for damage & abnormal noise",
            "Dashboard: Check for damage & abnormal noise",
            "Headliner, Floor Carpet & Mats: Check if missing or damage",
            "Horn: Check for functionality",
            "Hornpad: Check for damage",
            "MIL Lights",
            "Locking System: Check for functionality",
            "Parking Cameras: Check for damage & functionality",
            "Parking Sensors: Check for functionality",
            "Power Window: Check for functionality",
            "Power Window switches: Check for damage and functionality",
            "Rear Defogger: Check for functionality",
            "Seats: Check for functioning",
            "Seat Covers: Check for scuffs & stains",
            "Seat Belts: Check for functionality",
            "Side View Mirrors: Check for damage & functionality",
            "Sunvisors: Check for damage & functionality",
            "Tool Kit: Check availability",
            "Trims: Check for damage, loose fitment or abnormal noise"
        ]
    },

    /* ================= STEERING, BRAKES & SUSPENSION ================= */
    {
        section: "Steering System",
        startNo: 263,
        items: [
            "Ball Joints: Check for damage, play & abnormal noise",
            "Knuckles: Check for damage",
            "Power Steering Motor: Check for functionality",
            "Power Steering Fluid: Check level",
            "Power Steering Pump: Check for leaks & abnormal noise",
            "Steering Sensors: Check for functionality",
            "Steering Column: Check for damage & abnormal noise",
            "Steering Rack: Check for damage, play, leaks & abnormal noise",
            "Steering: Check tilt & telescopic adjustment",
            "Tie Rods: Check for bends, play & abnormal noise",
            "Steering: Check returnability & hardness",
            "Steering: Check alignment"
        ]
    },

    {
        section: "Brake System",
        startNo: 275,
        items: [
            "ABS & Sensors: Check for functionality",
            "Vacuum Booster: Check for functioning, damage & leaks",
            "Proportioning Valve: Check for leaks",
            "Brakes Calipers: Check for damage & leaks",
            "Brake Discs: Check for corrosion, wear & tear",
            "Brake Drums: Check for damage",
            "Brake Fluid: Check level",
            "Brakes Pads/Shoes: Check for wear & tear",
            "Hoses & Lines: Check for leaks",
            "Master Cylinder: Check for damages & leaks",
            "Parking Brake: Check for damage",
            "Wheel Cylinders: Check for leaks",
            "Brakes: Check for effectiveness & abnormal noise"
        ]
    },

    {
        section: "Suspension System",
        startNo: 288,
        items: [
            "Anti-Roll Bar: Check for cracks & bends",
            "Ball Joints & Bushes: Check for play, cracks & abnormal noise",
            "Coil Springs: Check for buckle or cracks",
            "Control Arms: Check for bends",
            "Dead Axle: Check for bends & cracks",
            "Link Rods: Check for bends, play & abnormal noise",
            "Shock Absorbers: Check for damage & leaks",
            "Struts: Check for damage & leaks",
            "Wheel Bearings: Check for play & abnormal noise",
            "Wheel Hubs: Check for wear, tear as well as cracks",
            "Suspension: Check jounce & bounce",
            "Suspension: Check for stiffness & abnormal noise"
        ]
    },

    /* ================= WHEELS ================= */
    {
        section: "Wheels & Tyres",
        startNo: 300,
        items: [
            { label: "300", text: "Tyres: Check for bulges, chipping & cuts", type: "STATUS" },
            { label: "A", text: "Front Right Tyre – Manufacturing week/year", type: "TYRE" },
            { label: "B", text: "Rear Right Tyre – Manufacturing week/year", type: "TYRE" },
            { label: "C", text: "Rear Left Tyre – Manufacturing week/year", type: "TYRE" },
            { label: "D", text: "Front Left Tyre – Manufacturing week/year", type: "TYRE" },
            { label: "E", text: "Spare Tyre – Manufacturing week/year", type: "TYRE" }
        ]
    }

];

export default checklist;