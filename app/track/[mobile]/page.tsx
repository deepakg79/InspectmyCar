import type { Metadata } from "next";
import CustomerTracking from "./CustomerTracking";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function Page({
    params,
}: {
    params: Promise<{ mobile: string }>;
}) {
    return <CustomerTracking params={params} />;
}