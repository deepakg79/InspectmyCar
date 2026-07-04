export interface CarModel {
    name: string;
    type: "Standard" | "Luxury";
    status?: "Active" | "Discontinued";
}

export interface Brand {
    brand: string;
    models: CarModel[];
}

/**
 * India Car Market Coverage (2012–2026)
 * Used + Premium + Discontinued models
 */

export const CAR_DATA: Brand[] = [
    {
        brand: "Maruti Suzuki",
        models: [
            { name: "Alto 800", type: "Standard", status: "Discontinued" },
            { name: "Alto K10", type: "Standard", status: "Active" },
            { name: "Wagon R", type: "Standard", status: "Active" },
            { name: "Swift", type: "Standard", status: "Active" },
            { name: "Swift Dzire", type: "Standard", status: "Active" },
            { name: "Baleno", type: "Standard", status: "Active" },
            { name: "Brezza", type: "Standard", status: "Active" },
            { name: "Ertiga", type: "Standard", status: "Active" },
            { name: "Ciaz", type: "Standard", status: "Active" },
            { name: "Grand Vitara", type: "Standard", status: "Active" },
            { name: "Celerio", type: "Standard", status: "Active" },
            { name: "Celerio X", type: "Standard", status: "Discontinued" },
            { name: "S-Presso", type: "Standard", status: "Active" },
            { name: "Ignis", type: "Standard", status: "Active" },
            { name: "Fronx", type: "Standard", status: "Active" },
            { name: "XL6", type: "Standard", status: "Active" },
            { name: "Invicto", type: "Luxury", status: "Active" },
            { name: "Eeco", type: "Standard", status: "Active" },
            { name: "S-Cross", type: "Standard", status: "Discontinued" },
            { name: "Ritz", type: "Standard", status: "Discontinued" },
            { name: "A-Star", type: "Standard", status: "Discontinued" },
            { name: "SX4", type: "Standard", status: "Discontinued" },
            { name: "Zen Estilo", type: "Standard", status: "Discontinued" },
            { name: "Esteem", type: "Standard", status: "Discontinued" },
            { name: "Omni", type: "Standard", status: "Discontinued" },

        ],
    },

    {
        brand: "Hyundai",
        models: [
            { name: "Santro", type: "Standard", status: "Discontinued" },
            { name: "Grand i10 Nios", type: "Standard", status: "Active" },
            { name: "i10 Nios", type: "Standard", status: "Active" },
            { name: "i20", type: "Standard", status: "Active" },
            { name: "Verna", type: "Standard", status: "Active" },
            { name: "Creta", type: "Standard", status: "Active" },
            { name: "Venue", type: "Standard", status: "Active" },
            { name: "Tucson", type: "Luxury", status: "Active" },
            { name: "Ioniq 5", type: "Luxury", status: "Active" },
            { name: "Eon", type: "Standard", status: "Discontinued" },
            { name: "i10", type: "Standard", status: "Discontinued" },
            { name: "Elite i20", type: "Standard", status: "Discontinued" },
            { name: "Aura", type: "Standard", status: "Active" },
            { name: "Exter", type: "Standard", status: "Active" },
            { name: "Alcazar", type: "Standard", status: "Active" },
            { name: "Kona Electric", type: "Luxury", status: "Discontinued" },
            { name: "Elantra", type: "Luxury", status: "Discontinued" },
            { name: "Sonata", type: "Luxury", status: "Discontinued" },
            { name: "Santa Fe", type: "Luxury", status: "Discontinued" },
            { name: "Xcent", type: "Standard", status: "Discontinued" },
        ],
    },

    {
        brand: "Tata",
        models: [
            { name: "Nano", type: "Standard", status: "Discontinued" },
            { name: "Tiago", type: "Standard", status: "Active" },
            { name: "Tigor", type: "Standard", status: "Active" },
            { name: "Punch", type: "Standard", status: "Active" },
            { name: "Altroz", type: "Standard", status: "Active" },
            { name: "Nexon", type: "Standard", status: "Active" },
            { name: "Harrier", type: "Standard", status: "Active" },
            { name: "Safari", type: "Standard", status: "Active" },
            { name: "Indica Vista", type: "Standard", status: "Discontinued" },
            { name: "Indica eV2", type: "Standard", status: "Discontinued" },
            { name: "Indigo eCS", type: "Standard", status: "Discontinued" },
            { name: "Bolt", type: "Standard", status: "Discontinued" },
            { name: "Zest", type: "Standard", status: "Discontinued" },
            { name: "Hexa", type: "Standard", status: "Discontinued" },
            { name: "Tigor EV", type: "Standard", status: "Active" },
            { name: "Tiago EV", type: "Standard", status: "Active" },
            { name: "Nexon EV", type: "Standard", status: "Active" },
            { name: "Punch EV", type: "Standard", status: "Active" },
            { name: "Curvv", type: "Standard", status: "Active" },
            { name: "Curvv EV", type: "Standard", status: "Active" },
        ],
    },

    {
        brand: "Mahindra",
        models: [
            { name: "Bolero", type: "Standard", status: "Active" },
            { name: "Bolero Neo", type: "Standard", status: "Active" },
            { name: "Bolero Neo Plus", type: "Standard", status: "Active" },
            { name: "Scorpio", type: "Standard", status: "Discontinued" },
            { name: "Scorpio Classic", type: "Standard", status: "Active" },
            { name: "Scorpio N", type: "Standard", status: "Active" },
            { name: "Thar", type: "Standard", status: "Active" },
            { name: "Thar Roxx", type: "Standard", status: "Active" },
            { name: "XUV300", type: "Standard", status: "Discontinued" },
            { name: "XUV 3XO", type: "Standard", status: "Active" },
            { name: "XUV400 EV", type: "Standard", status: "Active" },
            { name: "XUV500", type: "Standard", status: "Discontinued" },
            { name: "XUV700", type: "Standard", status: "Active" },
            { name: "Marazzo", type: "Standard", status: "Active" },
            { name: "KUV100 NXT", type: "Standard", status: "Discontinued" },
            { name: "TUV300", type: "Standard", status: "Discontinued" },
            { name: "Quanto", type: "Standard", status: "Discontinued" },
            { name: "Verito", type: "Standard", status: "Discontinued" },
            { name: "Verito Vibe", type: "Standard", status: "Discontinued" },
            { name: "e2o Plus", type: "Standard", status: "Discontinued" }
        ],
    },

    {
        brand: "Honda",
        models: [
            { name: "Brio", type: "Standard", status: "Discontinued" },
            { name: "Amaze", type: "Standard", status: "Active" },
            { name: "Jazz", type: "Standard", status: "Discontinued" },
            { name: "City", type: "Standard", status: "Active" },
            { name: "WR-V", type: "Standard", status: "Active" },
            { name: "BR-V", type: "Standard", status: "Discontinued" },
            { name: "Mobilio", type: "Standard", status: "Discontinued" },
            { name: "Elevate", type: "Standard", status: "Active" },
            { name: "Civic", type: "Luxury", status: "Discontinued" },
            { name: "CR-V", type: "Luxury", status: "Discontinued" },
            { name: "Accord", type: "Luxury", status: "Discontinued" },
        ],
    },

    {
        brand: "Toyota",
        models: [
            { name: "Etios", type: "Standard", status: "Discontinued" },
            { name: "Etios Liva", type: "Standard", status: "Discontinued" },
            { name: "Glanza", type: "Standard", status: "Active" },
            { name: "Urban Cruiser", type: "Standard", status: "Discontinued" },
            { name: "Urban Cruiser Taisor", type: "Standard", status: "Active" },
            { name: "Hyryder", type: "Standard", status: "Active" },
            { name: "Yaris", type: "Standard", status: "Discontinued" },
            { name: "Innova Crysta", type: "Luxury", status: "Active" },
            { name: "Innova Hycross", type: "Luxury", status: "Active" },
            { name: "Fortuner", type: "Luxury", status: "Active" },
            { name: "Corolla Altis", type: "Luxury", status: "Discontinued" },
            { name: "Camry", type: "Luxury", status: "Active" },
            { name: "Hilux", type: "Luxury", status: "Active" },
            { name: "Land Cruiser Prado", type: "Luxury", status: "Discontinued" },
            { name: "Land Cruiser LC300", type: "Luxury", status: "Active" },
            { name: "Vellfire", type: "Luxury", status: "Active" },
        ],
    },

    {
        brand: "Volkswagen",
        models: [
            { name: "Polo", type: "Standard", status: "Discontinued" },
            { name: "Ameo", type: "Standard", status: "Discontinued" },
            { name: "Vento", type: "Standard", status: "Discontinued" },
            { name: "Virtus", type: "Standard", status: "Active" },
            { name: "Taigun", type: "Standard", status: "Active" },
            { name: "Jetta", type: "Luxury", status: "Discontinued" },
            { name: "Passat", type: "Luxury", status: "Discontinued" },
            { name: "Tiguan", type: "Luxury", status: "Active" },
            { name: "Tiguan Allspace", type: "Luxury", status: "Discontinued" },
        ],
    },

    {
        brand: "Skoda",
        models: [
            { name: "Fabia", type: "Standard", status: "Discontinued" },
            { name: "Rapid", type: "Standard", status: "Discontinued" },
            { name: "Slavia", type: "Standard", status: "Active" },
            { name: "Kylaq", type: "Standard", status: "Active" },
            { name: "Kushaq", type: "Standard", status: "Active" },
            { name: "Octavia", type: "Luxury", status: "Active" },
            { name: "Superb", type: "Luxury", status: "Active" },
            { name: "Kodiaq", type: "Luxury", status: "Active" },
            { name: "Laura", type: "Luxury", status: "Discontinued" },
            { name: "Yeti", type: "Luxury", status: "Discontinued" },
        ],
    },
    {
        brand: "Renault",
        models: [
            { name: "Pulse", type: "Standard", status: "Discontinued" },
            { name: "Scala", type: "Standard", status: "Discontinued" },
            { name: "Kwid", type: "Standard", status: "Active" },
            { name: "Lodgy", type: "Standard", status: "Discontinued" },
            { name: "Duster", type: "Standard", status: "Discontinued" },
            { name: "Captur", type: "Standard", status: "Discontinued" },
            { name: "Triber", type: "Standard", status: "Active" },
            { name: "Kiger", type: "Standard", status: "Active" },
        ],
    },
    {
        brand: "Kia",
        models: [
            { name: "Sonet", type: "Standard", status: "Active" },
            { name: "Seltos", type: "Standard", status: "Active" },
            { name: "Carens", type: "Standard", status: "Active" },
            { name: "Syros", type: "Standard", status: "Active" },
            { name: "Clavis", type: "Standard", status: "Active" },
            { name: "Carnival", type: "Luxury", status: "Active" },
            { name: "EV6", type: "Luxury", status: "Active" },
            { name: "EV9", type: "Luxury", status: "Active" },
        ],
    },
    {
        brand: "Ford",
        models: [
            { name: "Figo", type: "Standard", status: "Discontinued" },
            { name: "Figo Aspire", type: "Standard", status: "Discontinued" },
            { name: "Freestyle", type: "Standard", status: "Discontinued" },
            { name: "EcoSport", type: "Standard", status: "Discontinued" },
            { name: "Endeavour", type: "Luxury", status: "Discontinued" },
            { name: "Mustang", type: "Luxury", status: "Discontinued" },
        ],
    },
    {
        brand: "Nissan",
        models: [
            { name: "Micra", type: "Standard", status: "Discontinued" },
            { name: "Micra Active", type: "Standard", status: "Discontinued" },
            { name: "Sunny", type: "Standard", status: "Discontinued" },
            { name: "Evalia", type: "Standard", status: "Discontinued" },
            { name: "Terrano", type: "Standard", status: "Discontinued" },
            { name: "Magnite", type: "Standard", status: "Active" },
            { name: "X-Trail", type: "Luxury", status: "Active" },
            { name: "GT-R", type: "Luxury", status: "Discontinued" },
        ],
    },
    {
        brand: "MG",
        models: [
            { name: "Hector", type: "Standard", status: "Active" },
            { name: "Hector Plus", type: "Standard", status: "Active" },
            { name: "Astor", type: "Standard", status: "Active" },
            { name: "Gloster", type: "Luxury", status: "Active" },
            { name: "ZS EV", type: "Luxury", status: "Active" },
            { name: "Comet EV", type: "Standard", status: "Active" },
            { name: "Windsor EV", type: "Standard", status: "Active" },
            { name: "Cyberster", type: "Luxury", status: "Active" },
            { name: "M9", type: "Luxury", status: "Active" },
        ],
    },
    {
        brand: "Jaguar",
        models: [
            { name: "XE", type: "Luxury", status: "Discontinued" },
            { name: "XF", type: "Luxury", status: "Discontinued" },
            { name: "XJ", type: "Luxury", status: "Discontinued" },
            { name: "F-Pace", type: "Luxury", status: "Active" },
            { name: "E-Pace", type: "Luxury", status: "Discontinued" },
            { name: "I-Pace", type: "Luxury", status: "Active" },
            { name: "F-Type", type: "Luxury", status: "Discontinued" },
        ],
    },
    {
        brand: "Volvo",
        models: [
            { name: "S60", type: "Luxury", status: "Discontinued" },
            { name: "S90", type: "Luxury", status: "Active" },
            { name: "XC40", type: "Luxury", status: "Active" },
            { name: "XC40 Recharge", type: "Luxury", status: "Active" },
            { name: "XC60", type: "Luxury", status: "Active" },
            { name: "XC90", type: "Luxury", status: "Active" },
            { name: "C40 Recharge", type: "Luxury", status: "Active" },
            { name: "EX40", type: "Luxury", status: "Active" },
        ],
    },
    {
        brand: "Lexus",
        models: [
            { name: "ES", type: "Luxury", status: "Active" },
            { name: "LS", type: "Luxury", status: "Active" },
            { name: "NX", type: "Luxury", status: "Active" },
            { name: "RX", type: "Luxury", status: "Active" },
            { name: "LX", type: "Luxury", status: "Active" },
            { name: "LM", type: "Luxury", status: "Active" },
        ],
    },
    {
        brand: "BMW",
        models: [
            { name: "2 Series Gran Coupe", type: "Luxury", status: "Active" },
            { name: "3 Series", type: "Luxury", status: "Active" },
            { name: "3 Series Gran Limousine", type: "Luxury", status: "Active" },
            { name: "5 Series", type: "Luxury", status: "Active" },
            { name: "6 Series GT", type: "Luxury", status: "Discontinued" },
            { name: "7 Series", type: "Luxury", status: "Active" },
            { name: "i4", type: "Luxury", status: "Active" },
            { name: "i5", type: "Luxury", status: "Active" },
            { name: "i7", type: "Luxury", status: "Active" },
            { name: "X1", type: "Luxury", status: "Active" },
            { name: "iX1", type: "Luxury", status: "Active" },
            { name: "X3", type: "Luxury", status: "Active" },
            { name: "X5", type: "Luxury", status: "Active" },
            { name: "X7", type: "Luxury", status: "Active" },
            { name: "iX", type: "Luxury", status: "Active" },
            { name: "Z4", type: "Luxury", status: "Active" },
            { name: "M2", type: "Luxury", status: "Active" },
            { name: "M3", type: "Luxury", status: "Active" },
            { name: "M4", type: "Luxury", status: "Active" },
            { name: "M5", type: "Luxury", status: "Active" },
            { name: "XM", type: "Luxury", status: "Active" },
        ],
    },

    {
        brand: "Mercedes-Benz",
        models: [
            { name: "A-Class", type: "Luxury", status: "Discontinued" },
            { name: "A-Class Limousine", type: "Luxury", status: "Active" },
            { name: "C-Class", type: "Luxury", status: "Active" },
            { name: "E-Class", type: "Luxury", status: "Active" },
            { name: "S-Class", type: "Luxury", status: "Active" },
            { name: "CLA", type: "Luxury", status: "Active" },
            { name: "CLS", type: "Luxury", status: "Discontinued" },
            { name: "GLA", type: "Luxury", status: "Active" },
            { name: "GLB", type: "Luxury", status: "Active" },
            { name: "GLC", type: "Luxury", status: "Active" },
            { name: "GLE", type: "Luxury", status: "Active" },
            { name: "GLS", type: "Luxury", status: "Active" },
            { name: "G-Class", type: "Luxury", status: "Active" },
            { name: "EQA", type: "Luxury", status: "Active" },
            { name: "EQB", type: "Luxury", status: "Active" },
            { name: "EQE SUV", type: "Luxury", status: "Active" },
            { name: "EQS", type: "Luxury", status: "Active" },
            { name: "AMG A 45 S", type: "Luxury", status: "Active" },
            { name: "AMG C 43", type: "Luxury", status: "Active" },
            { name: "AMG GLC 43", type: "Luxury", status: "Active" },
            { name: "AMG GLE 53", type: "Luxury", status: "Active" },
            { name: "AMG GT", type: "Luxury", status: "Active" },
        ],
    },

    {
        brand: "Audi",
        models: [
            { name: "A3", type: "Luxury", status: "Discontinued" },
            { name: "A4", type: "Luxury", status: "Active" },
            { name: "A6", type: "Luxury", status: "Active" },
            { name: "A8 L", type: "Luxury", status: "Active" },
            { name: "Q2", type: "Luxury", status: "Discontinued" },
            { name: "Q3", type: "Luxury", status: "Active" },
            { name: "Q5", type: "Luxury", status: "Active" },
            { name: "Q7", type: "Luxury", status: "Active" },
            { name: "Q8", type: "Luxury", status: "Active" },
            { name: "e-tron", type: "Luxury", status: "Discontinued" },
            { name: "Q8 e-tron", type: "Luxury", status: "Active" },
            { name: "RS5", type: "Luxury", status: "Active" },
            { name: "RS Q8", type: "Luxury", status: "Active" },
            { name: "TT", type: "Luxury", status: "Discontinued" },
            { name: "R8", type: "Luxury", status: "Discontinued" },
        ],
    },
];

/* ---------------- YEAR OPTIONS ---------------- */

const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from(
    { length: CURRENT_YEAR - 2012 + 1 },
    (_, i) => CURRENT_YEAR - i
);

/* ---------------- PRICING ---------------- */

export const PDI_PRICES = {
    Standard: 1999,
    Luxury: 3299,
};
