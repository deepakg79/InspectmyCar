//app/components/carData.ts

import { Basic } from "next/font/google";

export interface CarModel {
    name: string;
    type: "Standard" | "Luxury";
}

export interface Brand {
    brand: string;
    models: CarModel[];
}

export const CAR_DATA: Brand[] = [
    {
        brand: "Tata",
        models: [
            { name: "Nexon", type: "Standard" },
            { name: "Safari", type: "Standard" },
            { name: "Harrier", type: "Standard" },
            { name: "Punch", type: "Standard" },
            { name: "Tiago", type: "Standard" },
            { name: "Altroz", type: "Standard" },
            { name: "Tigor", type: "Standard" },
            { name: "Sierra", type: "Standard" },
            { name: "Curvv", type: "Standard" },
        ],
    },
    {
        brand: "Maruti Suzuki",
        models: [
            { name: "Alto K10", type: "Standard" },
            { name: "Celerio", type: "Standard" },
            { name: "Wagon R", type: "Standard" },
            { name: "Swift", type: "Standard" },
            { name: "Dzire", type: "Standard" },
            { name: "Baleno", type: "Standard" },
            { name: "Ertiga", type: "Standard" },
            { name: "XL6", type: "Standard" },
            { name: "Ignis", type: "Standard" },
            { name: "Invicto", type: "Standard" },
            { name: "Victoris", type: "Standard" },
            { name: "Grand Vitara", type: "Standard" },
            { name: "Brezza", type: "Standard" },
            { name: "Grand Vitara", type: "Standard" },
            { name: "Ciaz", type: "Standard" },
            { name: "Fronx", type: "Standard" },
        ],
    },
    {
        brand: "Kia",
        models: [
            { name: "Seltos", type: "Standard" },
            { name: "Sonet", type: "Standard" },
            { name: "Carens", type: "Standard" },
            { name: "Carnival", type: "Luxury" },
        ],
    },
    {
        brand: "Hyundai",
        models: [
            { name: "i20", type: "Standard" },
            { name: "Verna", type: "Standard" },
            { name: "Venue", type: "Standard" },
            { name: "Exter", type: "Standard" },
            { name: "Creta", type: "Standard" },
            { name: "Grand i10 Nios", type: "Standard" },
            { name: "Aura", type: "Standard" },
            { name: "Alcazar", type: "Standard" },
            { name: "Elantra", type: "Standard" },
            { name: "Ioniq 5", type: "Luxury" },
            { name: "Tucson", type: "Luxury" },
        ],
    },
    {
        brand: "Honda",
        models: [
            { name: "City", type: "Standard" },
            { name: "Amaze", type: "Standard" },
            { name: "WR‑V", type: "Standard" },
            { name: "Civic", type: "Standard" },
            { name: "Accord", type: "Luxury" },
            { name: "CR‑V", type: "Luxury" },
            { name: "Elevate", type: "Standard" },

        ],
    },
    {
        brand: "Toyota",
        models: [
            { name: "Corolla", type: "Standard" },
            { name: "Etios", type: "Standard" },
            { name: "Glanza", type: "Standard" },
            { name: "Urban Cruiser", type: "Standard" },
            { name: "Hyryder", type: "Standard" },
            { name: "Fortuner", type: "Luxury" },
            { name: "Innova Hycross", type: "Luxury" },
            { name: "Innova Crysta", type: "Luxury" },

        ],
    },
    {
        brand: "Ford",
        models: [
            { name: "Figo", type: "Standard" },
            { name: "EcoSport", type: "Standard" },
            { name: "Freestyle", type: "Standard" },
            { name: "Aspire", type: "Standard" },
            { name: "Endeavour", type: "Luxury" },
        ],
    },
    {
        brand: "Mahindra",
        models: [
            { name: "Thar", type: "Standard" },
            { name: "XUV300", type: "Standard" },
            { name: "XUV3XO", type: "Standard" },
            { name: "XUV400", type: "Standard" },
            { name: "XUV4XO", type: "Standard" },
            { name: "XUV700", type: "Standard" },
            { name: "XUV7XO", type: "Standard" },
            { name: "Scorpio", type: "Standard" },
            { name: "Bolero", type: "Standard" },
        ],
    },
    {
        brand: "Volkswagen",
        models: [
            { name: "Polo", type: "Standard" },
            { name: "Vento", type: "Standard" },
            { name: "Virtus", type: "Standard" },
            { name: "Taigun", type: "Standard" },
            { name: "T‑ROC", type: "Luxury" },
        ],
    },
    {
        brand: "Skoda",
        models: [
            { name: "Rapid", type: "Standard" },
            { name: "Slavia", type: "Standard" },
            { name: "Kushaq", type: "Standard" },
            { name: "Kylaq", type: "Standard" },
            { name: "Kodiaq", type: "Standard" },
            { name: "Octavia", type: "Luxury" },
            { name: "Superb", type: "Luxury" },
        ],
    },
    {
        brand: "BMW",
        models: [
            { name: "1 Series", type: "Luxury" },
            { name: "3 Series", type: "Luxury" },
            { name: "5 Series", type: "Luxury" },
            { name: "7 Series", type: "Luxury" },
            { name: "X1", type: "Luxury" },
            { name: "X3", type: "Luxury" },
            { name: "X5", type: "Luxury" },
        ],
    },
    {
        brand: "Audi",
        models: [
            { name: "A3", type: "Luxury" },
            { name: "A4", type: "Luxury" },
            { name: "A6", type: "Luxury" },
            { name: "Q3", type: "Luxury" },
            { name: "Q5", type: "Luxury" },
            { name: "Q7", type: "Luxury" },
        ],
    },
    {
        brand: "Mercedes‑Benz",
        models: [
            { name: "A‑Class", type: "Luxury" },
            { name: "C‑Class", type: "Luxury" },
            { name: "E‑Class", type: "Luxury" },
            { name: "S‑Class", type: "Luxury" },
            { name: "GLA", type: "Luxury" },
            { name: "GLC", type: "Luxury" },
        ],
    },
    {
        brand: "Jaguar",
        models: [
            { name: "XE", type: "Luxury" },
            { name: "XF", type: "Luxury" },
            { name: "F‑Pace", type: "Luxury" },
        ],
    },
    {
        brand: "Volvo",
        models: [
            { name: "XC40", type: "Luxury" },
            { name: "XC60", type: "Luxury" },
            { name: "XC90", type: "Luxury" },
            { name: "S60", type: "Luxury" },
        ],
    },
    {
        brand: "Lexus",
        models: [
            { name: "ES", type: "Luxury" },
            { name: "LS", type: "Luxury" },
            { name: "NX", type: "Luxury" },
            { name: "RX", type: "Luxury" },
        ],
    },
    {
        brand: "Porsche",
        models: [
            { name: "911", type: "Luxury" },
            { name: "Cayenne", type: "Luxury" },
            { name: "Macan", type: "Luxury" },
            { name: "Panamera", type: "Luxury" },
        ],
    },
    {
        brand: "Honda (Japan)",
        models: [
            { name: "Jazz", type: "Standard" },
            { name: "CR‑V", type: "Luxury" },
            { name: "HR‑V", type: "Standard" },
        ],
    },
    {
        brand: "Nissan",
        models: [
            { name: "Micra", type: "Standard" },
            { name: "Magnite", type: "Standard" },
            { name: "Kicks", type: "Standard" },
            { name: "Terrano", type: "Standard" },
            { name: "X‑Trail", type: "Luxury" },
        ],
    },
    {
        brand: "Renault",
        models: [
            { name: "Kwid", type: "Standard" },
            { name: "Triber", type: "Standard" },
            { name: "Kiger", type: "Standard" },
            { name: "Duster", type: "Standard" },
        ],
    },
    {
        brand: "MG",
        models: [
            { name: "Hector", type: "Standard" },
            { name: "Astor", type: "Standard" },
            { name: "Windsor", type: "Standard" },

            { name: "Gloster", type: "Luxury" },
            { name: "Majestor", type: "Luxury" },

        ],
    },
    {
        brand: "Jeep",
        models: [
            { name: "Compass", type: "Luxury" },
            { name: "Wrangler", type: "Luxury" },
        ],
    },
];
export const PDI_PRICES = {
    Basic: 1299,
    Standard: 1499,
    Luxury: 2499,
};

// OBD pricing for Standard and Luxury vehicles
export const OBD_PRICES = {
    Standard: 200, // extra for OBD check on Standard cars
    Luxury: 799,   // extra for OBD check on Luxury cars
};