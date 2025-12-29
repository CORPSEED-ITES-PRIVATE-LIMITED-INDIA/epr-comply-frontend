import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Image } from "@tiptap/extension-image";
import { Underline } from "@tiptap/extension-underline";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Image as ImageIcon,
  Highlighter,
  Type,
  Trash2,
  Plus,
  Minus,
  ListChecks,
} from "lucide-react";

/* ---------- FONT SIZE EXTENSION ---------- */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el) =>
          el.style.fontSize && el.tagName === "P" ? el.style.fontSize : null,
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
      },
    };
  },
});

const WordImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        renderHTML: (attrs) => {
          if (attrs.align === "left")
            return { style: "float:left;margin:0 16px 16px 0;" };
          if (attrs.align === "right")
            return { style: "float:right;margin:0 0 16px 16px;" };
          return { style: "display:block;margin:16px auto;" };
        },
      },
      width: {
        default: "auto",
        renderHTML: (attrs) =>
          attrs.width ? { style: `width:${attrs.width}` } : {},
      },
    };
  },
});

const NewTextEditor = ({ data = "<p></p>", onChange = () => {} }) => {
  const [menu, setMenu] = useState(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: true, allowBase64: true }),
      WordImage,
    ],
    content: data,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html); // 🔥 send HTML to parent
    },
  });
  useEffect(() => {
    if (!editor) return;

    if (data !== editor.getHTML()) {
      editor.commands.setContent(data, false);
    }
  }, [data, editor]);

  if (!editor) return null;

  /* ---------- IMAGE UPLOAD ---------- */
  const addLocalImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () =>
        editor.chain().focus().setImage({ src: reader.result }).run();
      reader.readAsDataURL(file);
    };
    input.click();
  };

  useEffect(() => {
    const el = editor.view.dom;

    const onContextMenu = (e) => {
      const img = e.target.closest("img");
      if (!img) return;

      e.preventDefault();
      setMenu({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const closeMenu = () => setMenu(null);

    el.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("click", closeMenu);

    return () => {
      el.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("click", closeMenu);
    };
  }, [editor]);

  const updateImage = (attrs) =>
    editor.chain().focus().updateAttributes("image", attrs).run();

  /* ---------- TABLE INSERT PROMPT ---------- */
  const insertTablePrompt = () => {
    const rows = parseInt(prompt("Enter number of rows", 3));
    const cols = parseInt(prompt("Enter number of columns", 3));
    if (rows > 0 && cols > 0) {
      editor
        .chain()
        .focus()
        .insertTable({
          rows,
          cols,
          withHeaderRow: true,
        })
        .run();
    }
  };

  return (
    <div className="editor-container">
      {/* TOOLBAR */}
      <div className="toolbar">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          <UnderlineIcon size={16} />
        </button>

        {/* HEADING */}
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? 1
              : editor.isActive("heading", { level: 2 })
              ? 2
              : editor.isActive("heading", { level: 3 })
              ? 3
              : editor.isActive("heading", { level: 4 })
              ? 4
              : editor.isActive("heading", { level: 5 })
              ? 5
              : editor.isActive("heading", { level: 6 })
              ? 6
              : 0
          }
          onChange={(e) => {
            const level = Number(e.target.value);

            if (level === 0) {
              editor
                .chain()
                .focus()
                .unsetMark("textStyle") // 🔥 REQUIRED
                .setParagraph()
                .run();
            } else {
              editor
                .chain()
                .focus()
                .unsetMark("textStyle") // 🔥 REQUIRED
                .setHeading({ level }) // 🔥 DO NOT use toggle here
                .run();
            }
          }}
        >
          <option value="0">Text</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        {/* FONT SIZE */}
        <select
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: e.target.value })
              .run()
          }
        >
          {[...Array(13)].map((_, i) => {
            const size = 8 + i * 2;
            return (
              <option key={size} value={`${size}px`}>
                {size}px
              </option>
            );
          })}
        </select>

        {/* ALIGNMENT */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("justify").run();
          }}
        >
          <AlignJustify size={16} />
        </button>
        {/* COLOR */}
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
        <input
          type="color"
          defaultValue="#ffff00"
          onInput={(e) =>
            editor.chain().focus().setHighlight({ color: e.target.value }).run()
          }
        />

        {/* LISTS */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleTaskList().run();
          }}
          title="Finger Point List"
        >
          <ListChecks size={16} />
        </button>

        {/* TABLE */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            insertTablePrompt();
          }}
        >
          <TableIcon size={16} />
        </button>

        {/* TABLE CONTROLS */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().addColumnAfter().run();
          }}
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().deleteColumn().run();
          }}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().addRowAfter().run();
          }}
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().deleteRow().run();
          }}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().deleteTable().run();
          }}
        >
          <Trash2 size={16} />
        </button>
        {/* IMAGE */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addLocalImage();
          }}
        >
          <ImageIcon size={16} />
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} className="editor-content" />

      {menu && (
        <div className="context-menu" style={{ top: menu.y, left: menu.x }}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateImage({ align: "left" });
            }}
          >
            Align Left
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateImage({ align: "center" });
            }}
          >
            Align Center
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateImage({ align: "right" });
            }}
          >
            Align Right
          </button>
          <hr />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateImage({ width: "200px" });
            }}
          >
            Small
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateImage({ width: "400px" });
            }}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteSelection().run();
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .editor-container { border:1px solid #ccc; border-radius:8px; }
        .toolbar { display:flex; flex-wrap:wrap; gap:6px; padding:8px; background:#f8f8f8; }
        .toolbar button, select { cursor:pointer; padding:4px; }
        .editor-content { padding:16px; min-height:300px; }
        .editor-content h1 { font-size: 2.2em; font-weight: 700; }
        .editor-content h2 { font-size: 1.9em; font-weight: 700; }
        .editor-content h3 { font-size: 1.6em; font-weight: 600; }
        .editor-content h4 { font-size: 1.3em; font-weight: 600; }
        .editor-content h5 { font-size: 1.1em; font-weight: 600; }
        .editor-content h6 { font-size: 1em;   font-weight: 600; }
        .editor-content h1,
        .editor-content h2,
        .editor-content h3,
        .editor-content h4,
        .editor-content h5,
        .editor-content h6 {margin: 0.67em 0;}
        .ProseMirror:focus { outline:none;min-height:300px; }
        .editor-content ul {
        list-style: disc;
        padding-left: 1.5rem;
      }
        .editor-content ol {
        list-style: decimal;
        padding-left: 1.5rem;
        }
        
        .editor-content ul[data-type="taskList"] {
        list-style: none;
        padding-left: 1.5rem;
        }
        
        .editor-content ul[data-type="taskList"] li {
        display: flex;
        align-items: center;
        }
        
        .editor-content ul[data-type="taskList"] li::before {
        content: "👉";
        margin-right: 8px;
        }
        
        .editor-content ul[data-type="taskList"] input[type="checkbox"] {
        display: none;
        }

        table { width:100%; border-collapse:collapse; }
        td, th { border:1px solid #ccc; padding:6px; }

        .context-menu {
          position:fixed;
          background:#fff;
          border:1px solid #ccc;
          border-radius:6px;
          box-shadow:0 4px 10px rgba(0,0,0,.15);
          z-index:9999;
        }
        .context-menu button {
          display:block;
          width:100%;
          padding:6px 10px;
          text-align:left;
          cursor:pointer;
          border:none;
          background:none;
        }
        .context-menu button:hover { background:#eee; }
      `}</style>
    </div>
  );
};

export default NewTextEditor;
