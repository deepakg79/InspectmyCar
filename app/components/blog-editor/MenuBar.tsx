"use client";
import { useState } from "react";
import TableDialog from "./TableDialog";
import { Editor } from "@tiptap/react";
import { SiYoutube } from "react-icons/si";
import {
    Undo2,
    Redo2,
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code2,
    Minus,
    Link2,
    Image as ImageIcon,
    Table2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    PlaySquare,
} from "lucide-react";

type Props = {
    editor: Editor | null;
};

function ToolbarButton({
    active,
    onClick,
    children,
}: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`
                h-10 w-10 rounded-xl
                flex items-center justify-center
                transition
                border
                ${active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white hover:bg-slate-100 border-slate-200"
                }
            `}
        >
            {children}
        </button>
    );
}

export default function MenuBar({ editor }: Props) {
    const [showTableDialog, setShowTableDialog] = useState(false);
    if (!editor) return null;
    console.log({
        heading: editor.can().toggleHeading({ level: 1 }),
        bullet: editor.can().toggleBulletList(),
        ordered: editor.can().toggleOrderedList(),
        quote: editor.can().toggleBlockquote(),
    });
    console.log(editor.extensionManager.extensions.map(e => e.name));
    return (
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200">

            <div className="flex flex-wrap gap-2 p-3">

                {/* Undo / Redo */}

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 size={18} />
                </ToolbarButton>

                <div className="w-px bg-slate-200 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => {

                        editor.chain().focus().toggleHeading({ level: 1 }).run();

                        console.log(editor.getHTML());

                    }}
                >
                    <Heading1 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    <Heading2 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    <Heading3 size={18} />
                </ToolbarButton>

                <div className="w-px bg-slate-200 mx-1" />

                {/* Text */}

                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    <Bold size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    <Italic size={18} />
                </ToolbarButton>

                <div className="w-px bg-slate-200 mx-1" />

                {/* Lists */}

                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("blockquote")}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >
                    <Quote size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive("codeBlock")}
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                >
                    <Code2 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                >
                    <Minus size={18} />
                </ToolbarButton>

                <div className="w-px bg-slate-200 mx-1" />

                {/* Alignment */}

                <ToolbarButton
                    active={editor.isActive({ textAlign: "left" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                >
                    <AlignLeft size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive({ textAlign: "center" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                >
                    <AlignCenter size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive({ textAlign: "right" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                >
                    <AlignRight size={18} />
                </ToolbarButton>

                <ToolbarButton
                    active={editor.isActive({ textAlign: "justify" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                    }
                >
                    <span className="text-xs font-bold">J</span>
                </ToolbarButton>

                <div className="w-px bg-slate-200 mx-1" />

                {/* Link */}

                <ToolbarButton
                    active={editor.isActive("link")}
                    onClick={() => {

                        const previousUrl =
                            editor.getAttributes("link").href;

                        const url = window.prompt(
                            "Enter URL",
                            previousUrl
                        );

                        if (url === null) return;

                        if (url === "") {

                            editor
                                .chain()
                                .focus()
                                .unsetLink()
                                .run();

                            return;

                        }

                        editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .setLink({
                                href: url,
                            })
                            .run();

                    }}
                >
                    <Link2 size={18} />
                </ToolbarButton>

                {/* Image */}

                <ToolbarButton
                    onClick={() => {
                        alert("Image upload will be added next.");
                    }}
                >
                    <ImageIcon size={18} />
                </ToolbarButton>

                {/* Table */}

                <ToolbarButton
                    onClick={() => setShowTableDialog(true)}
                >
                    <Table2 size={18} />
                </ToolbarButton>

                {/* YouTube */}

                <ToolbarButton
                    onClick={() => {

                        const url = window.prompt(
                            "Enter YouTube URL"
                        );

                        if (!url) return;

                        editor
                            .chain()
                            .focus()
                            .setYoutubeVideo({
                                src: url,
                                width: 800,
                                height: 450,
                            })
                            .run();

                    }}
                >
                    <SiYoutube className="h-4 w-4 text-red-600" />
                </ToolbarButton>
                <TableDialog
                    open={showTableDialog}
                    onClose={() => setShowTableDialog(false)}
                    onInsert={(rows, cols, header) => {

                        editor
                            .chain()
                            .focus()
                            .insertTable({
                                rows,
                                cols,
                                withHeaderRow: header,
                            })
                            .run();

                    }}
                />
            </div>

        </div>
    );
}