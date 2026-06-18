import Link from "next/link";

export default function AdminNav() {
    return (
        <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex gap-8 items-center">
                <span className="font-black text-indigo-400 text-sm tracking-tighter uppercase">
                    Inspect<span className="text-white">MyCar</span> Admin
                </span>
                <Link href="/admin/bookings" className="text-xs font-bold hover:text-indigo-400 transition-colors">
                    Orders
                </Link>
                <Link href="/admin/stats" className="text-xs font-bold text-slate-500 cursor-not-allowed">
                    Analytics (Soon)
                </Link>
            </div>
            <div className="flex gap-4 items-center">
                <Link href="/" className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20">
                    View Live Site
                </Link>
            </div>
        </nav>
    );
}