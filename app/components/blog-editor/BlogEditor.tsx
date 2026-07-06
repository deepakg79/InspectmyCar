"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Blockquote } from "@tiptap/extension-blockquote";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Youtube } from "@tiptap/extension-youtube";

import MenuBar from "./MenuBar";

type Props = {
    value: string;
    onChange: (html: string) => void;
};
export default function BlogEditor({
    value,
    onChange,
}: Props) {

    const editor = useEditor({

        immediatelyRender: false,

        extensions: [
            StarterKit.configure({
                link: false,
                heading: false,
                blockquote: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                codeBlock: false,
            }),

            Heading.configure({
                levels: [1, 2, 3],
            }),

            BulletList,

            OrderedList,

            ListItem,

            Blockquote,

            CodeBlock,

            Link.configure({
                openOnClick: false,
            }),

            Image,

            TextStyle,

            Color,

            Highlight,

            Placeholder.configure({
                placeholder: "Start writing your article...",
            }),

            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: [
                    "left",
                    "center",
                    "right",
                    "justify",
                ],
            }),

            Table.configure({
                resizable: true,
            }),

            TableRow,
            TableHeader,
            TableCell,

            TaskList,

            TaskItem.configure({
                nested: true,
            }),

            Youtube.configure({
                controls: true,
                nocookie: true,
            }),
        ],

        content: value ?? "",

        editorProps: {
            attributes: {
                class:
                    "blog-content max-w-none min-h-[650px] p-10 focus:outline-none",
            },
        },

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        }

    });

    if (!editor) return null;

    return (

        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">

            <MenuBar editor={editor} />

            <EditorContent editor={editor} />

        </div>

    );

}