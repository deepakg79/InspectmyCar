"use client";

import { useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onInsert: (rows: number, cols: number, header: boolean) => void;
};

export default function TableDialog({
    open,
    onClose,
    onInsert,
}: Props) {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [header, setHeader] = useState(true);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">

            <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">

                <h2 className="text-xl font-bold mb-6">
                    Insert Table
                </h2>

                <div className="space-y-5">

                    <div>
                        <label className="font-medium">
                            Columns
                        </label>

                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={cols}
                            onChange={(e) => setCols(Number(e.target.value))}
                            className="modern-input mt-2"
                        />
                    </div>

                    <div>
                        <label className="font-medium">
                            Rows
                        </label>

                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                            className="modern-input mt-2"
                        />
                    </div>

                    <label className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            checked={header}
                            onChange={(e) => setHeader(e.target.checked)}
                        />

                        Header Row

                    </label>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {

                            onInsert(
                                rows,
                                cols,
                                header
                            );

                            onClose();

                        }}
                        className="btn-primary px-5 py-2"
                    >
                        Insert
                    </button>

                </div>

            </div>

        </div>
    );
}