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
import { Extension } from "@tiptap/core";
import { Link } from "@tiptap/extension-link";

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
  Trash2,
  Plus,
  Minus,
  ListChecks,
  Link as LinkIcon,
  Unlink,
  Maximize2,
  Minimize2,
  Expand,
} from "lucide-react";

/* ---------- FONT SIZE EXTENSION ---------- */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el) => (el.style.fontSize ? el.style.fontSize : null),
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
      },
    };
  },
});

const Indentation = Extension.create({
  name: "indentation",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attrs) => {
              if (!attrs.indent) return {};
              return {
                style: `margin-left: ${attrs.indent * 2}em`,
              };
            },
            parseHTML: (el) => {
              const margin = el.style.marginLeft;
              return margin ? parseInt(margin, 10) / 2 : 0;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ editor, state }) => {
          const { $from } = state.selection;
          const node = $from.parent;
          const currentIndent = node.attrs.indent || 0;

          return editor
            .chain()
            .focus()
            .updateAttributes(node.type.name, { indent: currentIndent + 1 })
            .run();
        },

      outdent:
        () =>
        ({ editor, state }) => {
          const { $from } = state.selection;
          const node = $from.parent;
          const currentIndent = node.attrs.indent || 0;

          return editor
            .chain()
            .focus()
            .updateAttributes(node.type.name, {
              indent: Math.max(currentIndent - 1, 0),
            })
            .run();
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
          if (attrs.align === "left") {
            return { style: "float:left;margin:0 16px 16px 0;" };
          }
          if (attrs.align === "right") {
            return { style: "float:right;margin:0 0 16px 16px;" };
          }
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

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.className = "image-node";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "Inserted image";

      if (node.attrs.width !== "auto") {
        img.style.width = node.attrs.width;
      }

      container.appendChild(img);

      // ❌ DELETE BUTTON (unchanged)
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "×";
      deleteBtn.className = "img-delete";
      deleteBtn.type = "button";

      deleteBtn.onclick = (e) => {
        e.stopPropagation();

        const pos = getPos?.();
        if (typeof pos === "number") {
          editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + 1 })
            .run();
        } else {
          editor.chain().focus().deleteNode("image").run();
        }
      };

      container.appendChild(deleteBtn);

      // ✅ RESIZE HANDLE
      const handle = document.createElement("div");
      handle.className = "resize-handle";
      container.appendChild(handle);

      let startX;
      let startWidth;
      let frame;

      handle.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        startX = e.clientX;
        startWidth = img.offsetWidth;

        const onMove = (moveEvent) => {
          cancelAnimationFrame(frame);

          frame = requestAnimationFrame(() => {
            const newWidth = Math.max(
              80,
              startWidth + (moveEvent.clientX - startX),
            );

            const pos = getPos?.();
            if (typeof pos === "number") {
              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: `${newWidth}px`,
                  });
                  return true;
                })
                .run();
            }
          });
        };

        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      };

      return {
        dom: container,

        // ✅ CRITICAL FIX → keeps DOM in sync with state
        update: (updatedNode) => {
          if (updatedNode.type.name !== node.type.name) return false;

          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width;
          }

          return true;
        },
      };
    };
  },
});

const TextEditor = ({ data = "<p></p>", onChange = () => {} }) => {
  const [menu, setMenu] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Underline,
      Indentation,
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
      WordImage.configure({ inline: false, allowBase64: true }),
    ],
    content: data || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (data != null && data !== editor.getHTML()) {
      editor.commands.setContent(data || "<p></p>", false);
    }
  }, [data, editor]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  // useEffect(() => {
  //   if (editor && editor.isEmpty) {
  //     editor.commands.setContent("<p></p>", false);
  //   }
  // }, [editor]);

  useEffect(() => {
    if (!editor) return;

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

  if (!editor) return null;

  const addLocalImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const updateImage = (attrs) => {
    editor.chain().focus().updateAttributes("image", attrs).run();
    setMenu(null);
  };

  const insertTablePrompt = () => {
    const rows = parseInt(prompt("Enter number of rows", "3"), 10);
    const cols = parseInt(prompt("Enter number of columns", "3"), 10);

    if (
      Number.isInteger(rows) &&
      Number.isInteger(cols) &&
      rows > 0 &&
      cols > 0
    ) {
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

  const addOrEditLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div className={`editor-container ${isExpanded ? "expanded" : ""}`}>
      <div className="toolbar">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={editor.isActive("underline") ? "is-active" : ""}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

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
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level }).run();
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

        <select
          defaultValue="16px"
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

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("justify").run();
          }}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>

        <input
          type="color"
          title="Text Color"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />

        <input
          type="color"
          title="Highlight Color"
          defaultValue="#ffff00"
          onInput={(e) =>
            editor.chain().focus().setHighlight({ color: e.target.value }).run()
          }
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleTaskList().run();
          }}
          title="Task List"
        >
          <ListChecks size={16} />
        </button>
        <div className="">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              insertTablePrompt();
            }}
            title="Insert Table"
          >
            <TableIcon size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().addColumnAfter().run();
            }}
            title="Add Column"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteColumn().run();
            }}
            title="Delete Column"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().addRowAfter().run();
            }}
            title="Add Row"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteRow().run();
            }}
            title="Delete Row"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteTable().run();
            }}
            title="Delete Table"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addLocalImage();
          }}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().indent().run();
          }}
          title="Indent"
        >
          ➡️
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().outdent().run();
          }}
          title="Outdent"
        >
          ⬅️
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addOrEditLink();
          }}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
          title="Remove Link"
        >
          <Unlink size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }}
          title={isExpanded ? "Exit Full Screen" : "Expand Editor"}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Expand size={16} />}
        </button>
      </div>

      <div
        className="editor-workspace"
        onClick={() => {
          if (!editor) return;

          if (editor.isEmpty) {
            editor.chain().focus().setTextSelection(1).run();
          } else {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} className="tiptap-render" />
      </div>

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
              editor.chain().focus().deleteNode("image").run();
              setMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}

      <style>{`
        :root {
          --bg: #ffffff;
          --ink: #000000;
          --muted: #d9d9d9;
          --accent: #000000;
        }

        .editor-container {
          border: 3px solid black;
          background: #fff;
          font-family: "Inter", "Helvetica Neue", sans-serif;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
        }

        .editor-container.expanded {
          position: fixed;
          inset: 0;
          z-index: 99999;
          width: 100vw;
          height: 100vh;
          margin: 0;
          border: none;
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px;
          border-bottom: 3px solid black;
          background: #f5f5f5;
          box-sizing: border-box;
        }

        .editor-container.expanded .toolbar {
          flex-shrink: 0;
          overflow-y: auto;
        }

        .toolbar button,
        .toolbar select,
        .toolbar input[type="color"] {
          border: 2px solid black;
          background: white;
          padding: 6px 8px;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .toolbar button:hover,
        .toolbar select:hover {
          background: black;
          color: white;
        }

        .toolbar button:active {
          transform: translateY(1px);
        }

        .toolbar button.is-active {
          background: black;
          color: white;
        }

        .toolbar select {
          font-weight: 600;
        }

        .editor-workspace {
          height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          background: #fff;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
        }

        .editor-container.expanded .editor-workspace {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
        }

        .tiptap-render {
          min-height: 100%;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .ProseMirror {
          min-height: 100%;
          width: 100%;
          max-width: 100%;
          outline: none;
          font-size: 15px;
          line-height: 1.3;
          box-sizing: border-box;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .ProseMirror p {
          margin: 1px 0;
          line-height:1.1;
        }

        .ProseMirror h1 {
          font-size: 2.4rem;
          font-weight: 400;
          padding-bottom: 4px;
          text-decoration:none
        }

        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 400;
        }

        .ProseMirror h3 {
          font-size: 1.6rem;
          font-weight: 400;
        }

        .ProseMirror p {
          margin: 8px 0;
        }

        .ProseMirror ul {
          list-style: square;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror ul[data-type="taskList"] {
          padding-left: 1.5rem;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ProseMirror ul[data-type="taskList"] li::before {
          content: "■";
          font-weight: bold;
        }

        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          display: none;
        }

        .ProseMirror table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin: 10px 0;
        }

        .ProseMirror td,
        .ProseMirror th {
          border: 2px solid #000;
          padding: 8px;
        }

        .ProseMirror th {
          background: #000;
          color: #fff;
          font-weight: 700;
        }

        .image-node {
          position: relative;
          display: inline-block;
          margin: 12px 0;
          max-width: 100%;
        }

        .image-node img {
          max-width: 100%;
          width: auto;
          height: auto;
          display: block;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        .img-delete {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #000;
          background: #fff;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .img-delete:hover {
          background: #000;
          color: #fff;
        }

        .resize-handle {
          position: absolute;
          right: -6px;
          bottom: -6px;
          width: 14px;
          height: 14px;
          background: #000;
          cursor: nwse-resize;
          z-index: 2;
        }

        .context-menu {
          position: fixed;
          background: white;
          border: 2px solid black;
          z-index: 9999;
          min-width: 160px;
          box-sizing: border-box;
        }

        .context-menu button {
          width: 100%;
          padding: 8px 10px;
          text-align: left;
          border: none;
          background: white;
          cursor: pointer;
          border-bottom: 1px solid black;
        }

        .context-menu button:hover {
          background: black;
          color: white;
        }

        .context-menu hr {
          border: none;
          border-top: 2px solid black;
          margin: 4px 0;
        }

        .editor-workspace::-webkit-scrollbar {
          width: 10px;
        }

        .editor-workspace::-webkit-scrollbar-thumb {
          background: black;
        }

        .editor-workspace::-webkit-scrollbar-track {
          background: #e5e5e5;
        }
          .resize-handle {
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 18px;
  height: 18px;
  background: white;
  border: 2px solid black;
  border-radius: 4px;
  cursor: nwse-resize;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.resize-handle::after {
  content: "";
  width: 10px;
  height: 10px;
  background: black;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

.resize-handle:hover {
  background: black;
}

.resize-handle:hover::after {
  background: white;
}

.image-node img {
  transition: width 0.05s linear;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 2px solid black;
  background: #fff;
}


      `}</style>
    </div>
  );
};

export default TextEditor;
