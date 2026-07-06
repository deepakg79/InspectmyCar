export const BLOG_CATEGORIES = [
    "Buying Guide",
    "Pre-Delivery Inspection",
    "New Cars",
    "Used Cars",
    "Car Delivery",
    "Car Ownership",
    "Maintenance",
    "Safety",
    "Industry News",
    "Electric Vehicles",
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];