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
  Highlighter,
  Type,
  Trash2,
  Plus,
  Minus,
  ListChecks,
  Link as LinkIcon,
  Unlink,
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
              return margin ? parseInt(margin) / 2 : 0;
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
        ({ chain }) =>
          chain()
            .updateAttributes("paragraph", {
              indent: (attrs) => (attrs.indent || 0) + 1,
            })
            .run(),

      outdent:
        () =>
        ({ chain }) =>
          chain()
            .updateAttributes("paragraph", {
              indent: (attrs) => Math.max((attrs.indent || 0) - 1, 0),
            })
            .run(),
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

const TextEditor = ({ data = "<p></p>", onChange = () => {} }) => {
  const [menu, setMenu] = useState(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false, // prevents navigation inside editor
        autolink: true, // auto-detect pasted links
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
      Image.configure({ inline: true, allowBase64: true }),
      WordImage,
    ],
    content: data,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();

      // Preserve empty lines EXACTLY
      html = html.replace(/<p><\/p>/g, "<p>&nbsp;</p>");
      html = html.replace(/<p><br><\/p>/g, "<p>&nbsp;</p>");

      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor || !data) return;
    editor.commands.setContent(data);
  }, [editor]);

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

  useEffect(() => {
    if (editor && editor.isEmpty) {
      editor.commands.setContent("<p></p>");
    }
  }, [editor]);

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
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().indent().run();
          }}
        >
          ➡️
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().outdent().run();
          }}
        >
          ⬅️
        </button>
        {/* LINK */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();

            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Enter URL", previousUrl);

            if (url === null) return;

            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          <LinkIcon size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
        >
          <Unlink size={16} />
        </button>
      </div>

      {/* EDITOR */}
      <div
        className="editor-workspace"
        onClick={() => {
          if (!editor) return;

          // If editor is empty, place cursor at start
          if (editor.isEmpty) {
            editor.chain().focus().setTextSelection(1).run();
          } else {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} className="editor-content" />
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
        .editor-content h1 { font-size: 2.2em;}
        .editor-content h2 { font-size: 1.9em;}
        .editor-content h3 { font-size: 1.6em;}
        .editor-content h4 { font-size: 1.3em;}
        .editor-content h5 { font-size: 1.1em;}
        .editor-content h6 { font-size: 1em;}
        .editor-content h1,
        .editor-content h2,
        .editor-content h3,
        .editor-content h4,
        .editor-content h5,
        .editor-content h6 {margin: 0.67em 0;}
        .ProseMirror:focus { outline:none;min-height:100% }
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

export default TextEditor;

// import { useState, useEffect, useRef, useMemo } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//   ClassicEditor,
//   Plugin,
//   Alignment,
//   Autoformat,
//   AutoImage,
//   AutoLink,
//   Autosave,
//   BalloonToolbar,
//   BlockQuote,
//   Bold,
//   Bookmark,
//   CKBox,
//   CKBoxImageEdit,
//   CloudServices,
//   Code,
//   Essentials,
//   FindAndReplace,
//   FontBackgroundColor,
//   FontColor,
//   FontFamily,
//   FontSize,
//   Fullscreen,
//   GeneralHtmlSupport,
//   Heading,
//   Highlight,
//   HorizontalLine,
//   ImageBlock,
//   ImageCaption,
//   ImageEditing,
//   ImageInline,
//   ImageInsert,
//   ImageInsertViaUrl,
//   ImageResize,
//   ImageStyle,
//   ImageTextAlternative,
//   ImageToolbar,
//   ImageUpload,
//   ImageUtils,
//   Indent,
//   IndentBlock,
//   Italic,
//   Link,
//   LinkImage,
//   List,
//   ListProperties,
//   Mention,
//   PageBreak,
//   Paragraph,
//   PasteFromOffice,
//   PictureEditing,
//   RemoveFormat,
//   SpecialCharacters,
//   SpecialCharactersArrows,
//   SpecialCharactersCurrency,
//   SpecialCharactersEssentials,
//   SpecialCharactersLatin,
//   SpecialCharactersMathematical,
//   SpecialCharactersText,
//   Strikethrough,
//   Style,
//   Subscript,
//   Superscript,
//   Table,
//   TableCaption,
//   TableCellProperties,
//   TableColumnResize,
//   TableProperties,
//   TableToolbar,
//   TextTransformation,
//   TodoList,
//   Underline,
// } from "ckeditor5";
// import {
//   CaseChange,
//   Comments,
//   ExportPdf,
//   ExportWord,
//   FormatPainter,
//   ImportWord,
//   MultiLevelList,
//   PasteFromOfficeEnhanced,
//   RevisionHistory,
//   TableOfContents,
//   Template,
//   TrackChanges,
//   TrackChangesData,
//   TrackChangesPreview,
// } from "ckeditor5-premium-features";

// import "ckeditor5/ckeditor5.css";
// import "ckeditor5-premium-features/ckeditor5-premium-features.css";

// const LICENSE_KEY =
//   "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjcwNTI3OTksImp0aSI6IjRiN2FjYjlmLWU4MzEtNGM4YS05ZmJhLTY0NTYyM2M1NDVmYyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjYxNjZlZjg3In0.th_ulx4AUd-eXj047ljq4AHsO01uBtJLb-l8h_mdd_UBsxiooDr7bniXOM1EmhNc8jCn2G0rp8Zls7PVT4I7cQ";

// /**
//  * Unique ID that will be used to identify this document. E.g. you may use ID taken from your database.
//  * Read more: https://ckeditor.com/docs/ckeditor5/latest/api/module_collaboration-core_config-RealTimeCollaborationConfig.html
//  */
// const DOCUMENT_ID = "<YOUR_DOCUMENT_ID>";

// const CLOUD_SERVICES_TOKEN_URL =
//   "https://rhs_7mhi358i.cke-cs.com/token/dev/38729757714baaf65f9022404c162df8486dc752c01511314a2c45d5af53?limit=10";
// const CLOUD_SERVICES_WEBSOCKET_URL = "wss://rhs_7mhi358i.cke-cs.com/ws";

// class UsersIntegration extends Plugin {
//   static get requires() {
//     return ["Users"];
//   }

//   static get pluginName() {
//     return "UsersIntegration";
//   }

//   init() {
//     const usersPlugin = this.editor.plugins.get("Users");
//     const users = [
//       { id: "user-1", name: "Zee Croce" },
//       { id: "user-2", name: "Mex Haddox" },
//     ];
//     const me = users[0];

//     for (const user of users) {
//       usersPlugin.addUser(user);
//     }

//     usersPlugin.defineMe(me.id);
//   }
// }

// class CommentsIntegration extends Plugin {}

// class TrackChangesIntegration extends Plugin {}

// class RevisionHistoryIntegration extends Plugin {}

// export default function TextEditor({
//   data,
//   menu = true,
//   onChange,
//   initialData,
// }) {
//   const editorContainerRef = useRef(null);
//   const editorRef = useRef(null);
//   const editorAnnotationsRef = useRef(null);
//   const editorRevisionHistoryRef = useRef(null);
//   const editorRevisionHistoryEditorRef = useRef(null);
//   const editorRevisionHistorySidebarRef = useRef(null);
//   const [isLayoutReady, setIsLayoutReady] = useState(false);

//   useEffect(() => {
//     setIsLayoutReady(true);

//     return () => setIsLayoutReady(false);
//   }, []);

//   const { editorConfig } = useMemo(() => {
//     if (!isLayoutReady) {
//       return {};
//     }

//     return {
//       editorConfig: {
//         toolbar: {
//           items: [
//             "undo",
//             "redo",
//             "|",
//             "revisionHistory",
//             "trackChanges",
//             "comment",
//             "|",
//             "formatPainter",
//             "|",
//             "heading",
//             "style",
//             "|",
//             "fontSize",
//             "fontFamily",
//             "fontColor",
//             "fontBackgroundColor",
//             "|",
//             "bold",
//             "italic",
//             "underline",
//             "|",
//             "link",
//             "insertImage",
//             "insertTable",
//             "highlight",
//             "blockQuote",
//             "|",
//             "alignment",
//             "|",
//             "bulletedList",
//             "numberedList",
//             "multiLevelList",
//             "todoList",
//             "outdent",
//             "indent",
//           ],
//           shouldNotGroupWhenFull: false,
//         },
//         plugins: [
//           Alignment,
//           Autoformat,
//           AutoImage,
//           AutoLink,
//           Autosave,
//           BalloonToolbar,
//           BlockQuote,
//           Bold,
//           Bookmark,
//           CaseChange,
//           CKBox,
//           CKBoxImageEdit,
//           CloudServices,
//           Code,
//           Comments,
//           Essentials,
//           ExportPdf,
//           ExportWord,
//           FindAndReplace,
//           FontBackgroundColor,
//           FontColor,
//           FontFamily,
//           FontSize,
//           FormatPainter,
//           Fullscreen,
//           GeneralHtmlSupport,
//           Heading,
//           Highlight,
//           HorizontalLine,
//           ImageBlock,
//           ImageCaption,
//           ImageEditing,
//           ImageInline,
//           ImageInsert,
//           ImageInsertViaUrl,
//           ImageResize,
//           ImageStyle,
//           ImageTextAlternative,
//           ImageToolbar,
//           ImageUpload,
//           ImageUtils,
//           ImportWord,
//           Indent,
//           IndentBlock,
//           Italic,
//           Link,
//           LinkImage,
//           List,
//           ListProperties,
//           Mention,
//           MultiLevelList,
//           PageBreak,
//           Paragraph,
//           PasteFromOffice,
//           PasteFromOfficeEnhanced,
//           PictureEditing,
//           RemoveFormat,
//           RevisionHistory,
//           SpecialCharacters,
//           SpecialCharactersArrows,
//           SpecialCharactersCurrency,
//           SpecialCharactersEssentials,
//           SpecialCharactersLatin,
//           SpecialCharactersMathematical,
//           SpecialCharactersText,
//           Strikethrough,
//           Style,
//           Subscript,
//           Superscript,
//           Table,
//           TableCaption,
//           TableCellProperties,
//           TableColumnResize,
//           TableOfContents,
//           TableProperties,
//           TableToolbar,
//           Template,
//           TextTransformation,
//           TodoList,
//           TrackChanges,
//           TrackChangesData,
//           TrackChangesPreview,
//           Underline,
//         ],
//         extraPlugins: [
//           UsersIntegration,
//           CommentsIntegration,
//           TrackChangesIntegration,
//           RevisionHistoryIntegration,
//         ],
//         balloonToolbar: [
//           "comment",
//           "|",
//           "bold",
//           "italic",
//           "|",
//           "link",
//           "insertImage",
//           "|",
//           "bulletedList",
//           "numberedList",
//         ],
//         cloudServices: {
//           tokenUrl: CLOUD_SERVICES_TOKEN_URL,
//         },
//         comments: {
//           editorConfig: {
//             extraPlugins: [Autoformat, Bold, Italic, List, Mention],
//             mention: {
//               feeds: [
//                 {
//                   marker: "@",
//                   feed: [
//                     /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#comments-with-mentions */
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//         exportPdf: {
//           stylesheets: [
//             "./export-style.css",
//             "https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css",
//             "https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css",
//           ],
//           fileName: "export-pdf-demo.pdf",
//           converterOptions: {
//             format: "Tabloid",
//             margin_top: "20mm",
//             margin_bottom: "20mm",
//             margin_right: "24mm",
//             margin_left: "24mm",
//             page_orientation: "portrait",
//           },
//         },
//         exportWord: {
//           stylesheets: [
//             "./export-style.css",
//             "https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css",
//             "https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css",
//           ],
//           fileName: "export-word-demo.docx",
//           converterOptions: {
//             document: {
//               orientation: "portrait",
//               size: "Tabloid",
//               margins: {
//                 top: "20mm",
//                 bottom: "20mm",
//                 right: "24mm",
//                 left: "24mm",
//               },
//             },
//           },
//         },
//         fontFamily: {
//           supportAllValues: true,
//         },
//         fontSize: {
//           options: [10, 12, 14, "default", 18, 20, 22],
//           supportAllValues: true,
//         },
//         fullscreen: {
//           onEnterCallback: (container) =>
//             container.classList.add(
//               "editor-container",
//               "editor-container_classic-editor",
//               "editor-container_include-annotations",
//               "editor-container_include-style",
//               "editor-container_include-fullscreen",
//               "main-container"
//             ),
//         },
//         heading: {
//           options: [
//             {
//               model: "paragraph",
//               title: "Paragraph",
//               class: "ck-heading_paragraph",
//             },
//             {
//               model: "heading1",
//               view: "h1",
//               title: "Heading 1",
//               class: "ck-heading_heading1",
//             },
//             {
//               model: "heading2",
//               view: "h2",
//               title: "Heading 2",
//               class: "ck-heading_heading2",
//             },
//             {
//               model: "heading3",
//               view: "h3",
//               title: "Heading 3",
//               class: "ck-heading_heading3",
//             },
//             {
//               model: "heading4",
//               view: "h4",
//               title: "Heading 4",
//               class: "ck-heading_heading4",
//             },
//             {
//               model: "heading5",
//               view: "h5",
//               title: "Heading 5",
//               class: "ck-heading_heading5",
//             },
//             {
//               model: "heading6",
//               view: "h6",
//               title: "Heading 6",
//               class: "ck-heading_heading6",
//             },
//           ],
//         },
//         htmlSupport: {
//           allow: [
//             {
//               name: /^.*$/,
//               styles: true,
//               attributes: true,
//               classes: true,
//             },
//           ],
//         },
//         image: {
//           toolbar: [
//             "toggleImageCaption",
//             "imageTextAlternative",
//             "|",
//             "imageStyle:inline",
//             "imageStyle:wrapText",
//             "imageStyle:breakText",
//             "|",
//             "resizeImage",
//             "|",
//             "ckboxImageEdit",
//           ],
//         },
//         initialData: initialData,
//         // '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
//         licenseKey: LICENSE_KEY,
//         link: {
//           addTargetToExternalLinks: true,
//           defaultProtocol: "https://",
//           decorators: {
//             toggleDownloadable: {
//               mode: "manual",
//               label: "Downloadable",
//               attributes: {
//                 download: "file",
//               },
//             },
//           },
//         },
//         list: {
//           properties: {
//             styles: true,
//             startIndex: true,
//             reversed: true,
//           },
//         },
//         mention: {
//           feeds: [
//             {
//               marker: "@",
//               feed: [
//                 /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
//               ],
//             },
//           ],
//         },
//         menuBar: {
//           isVisible: menu,
//         },
//         placeholder: "Type or paste your content here!",
//         revisionHistory: {
//           editorContainer: editorContainerRef.current,
//           viewerContainer: editorRevisionHistoryRef.current,
//           viewerEditorElement: editorRevisionHistoryEditorRef.current,
//           viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
//           resumeUnsavedRevision: true,
//         },
//         sidebar: {
//           container: editorAnnotationsRef.current,
//         },
//         style: {
//           definitions: [
//             {
//               name: "Article category",
//               element: "h3",
//               classes: ["category"],
//             },
//             {
//               name: "Title",
//               element: "h2",
//               classes: ["document-title"],
//             },
//             {
//               name: "Subtitle",
//               element: "h3",
//               classes: ["document-subtitle"],
//             },
//             {
//               name: "Info box",
//               element: "p",
//               classes: ["info-box"],
//             },
//             {
//               name: "CTA Link Primary",
//               element: "a",
//               classes: ["button", "button--green"],
//             },
//             {
//               name: "CTA Link Secondary",
//               element: "a",
//               classes: ["button", "button--black"],
//             },
//             {
//               name: "Marker",
//               element: "span",
//               classes: ["marker"],
//             },
//             {
//               name: "Spoiler",
//               element: "span",
//               classes: ["spoiler"],
//             },
//           ],
//         },
//         table: {
//           contentToolbar: [
//             "tableColumn",
//             "tableRow",
//             "mergeTableCells",
//             "tableProperties",
//             "tableCellProperties",
//           ],
//         },
//         template: {
//           definitions: [
//             {
//               title: "Introduction",
//               description: "Simple introduction to an article",
//               icon: '<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <g id="icons/article-image-right">\n        <rect id="icon-bg" width="45" height="45" rx="2" fill="#A5E7EB"/>\n        <g id="page" filter="url(#filter0_d_1_507)">\n            <path d="M9 41H36V12L28 5H9V41Z" fill="white"/>\n            <path d="M35.25 12.3403V40.25H9.75V5.75H27.7182L35.25 12.3403Z" stroke="#333333" stroke-width="1.5"/>\n        </g>\n        <g id="image">\n            <path id="Rectangle 22" d="M21.5 23C21.5 22.1716 22.1716 21.5 23 21.5H31C31.8284 21.5 32.5 22.1716 32.5 23V29C32.5 29.8284 31.8284 30.5 31 30.5H23C22.1716 30.5 21.5 29.8284 21.5 29V23Z" fill="#B6E3FC" stroke="#333333"/>\n            <path id="Vector 1" d="M24.1184 27.8255C23.9404 27.7499 23.7347 27.7838 23.5904 27.9125L21.6673 29.6268C21.5124 29.7648 21.4589 29.9842 21.5328 30.178C21.6066 30.3719 21.7925 30.5 22 30.5H32C32.2761 30.5 32.5 30.2761 32.5 30V27.7143C32.5 27.5717 32.4391 27.4359 32.3327 27.3411L30.4096 25.6268C30.2125 25.451 29.9127 25.4589 29.7251 25.6448L26.5019 28.8372L24.1184 27.8255Z" fill="#44D500" stroke="#333333" stroke-linejoin="round"/>\n            <circle id="Ellipse 1" cx="26" cy="25" r="1.5" fill="#FFD12D" stroke="#333333"/>\n        </g>\n        <rect id="Rectangle 23" x="13" y="13" width="12" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 24" x="13" y="17" width="19" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 25" x="13" y="21" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 26" x="13" y="25" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 27" x="13" y="29" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 28" x="13" y="33" width="16" height="2" rx="1" fill="#B4B4B4"/>\n    </g>\n    <defs>\n        <filter id="filter0_d_1_507" x="9" y="5" width="28" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n            <feFlood flood-opacity="0" result="BackgroundImageFix"/>\n            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n            <feOffset dx="1" dy="1"/>\n            <feComposite in2="hardAlpha" operator="out"/>\n            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0"/>\n            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_507"/>\n            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_507" result="shape"/>\n        </filter>\n    </defs>\n</svg>\n',
//               data: "<h2>Introduction</h2><p>In today's fast-paced world, keeping up with the latest trends and insights is essential for both personal growth and professional development. This article aims to shed light on a topic that resonates with many, providing valuable information and actionable advice. Whether you're seeking to enhance your knowledge, improve your skills, or simply stay informed, our comprehensive analysis offers a deep dive into the subject matter, designed to empower and inspire our readers.</p>",
//             },
//           ],
//         },
//       },
//     };
//   }, [isLayoutReady, menu]);

//   useEffect(() => {
//     if (editorConfig) {
//       configUpdateAlert(editorConfig);
//     }
//   }, [editorConfig]);

//   return (
//     <div  className="main-container">
//       <div
//         className="editor-container editor-container_classic-editor editor-container_include-annotations editor-container_include-style editor-container_include-fullscreen"
//         ref={editorContainerRef}
//       >
//         <div className="editor-container__editor-wrapper">
//           <div className="editor-container__editor">
//             <div ref={editorRef}>
//               {editorConfig && (
//                 <CKEditor
//                   editor={ClassicEditor}
//                   config={editorConfig}
//                   onChange={onChange}
//                   data={data}
//                 />
//               )}
//             </div>
//           </div>
//           {/* <div
//             className="editor-container__sidebar"
//             ref={editorAnnotationsRef}
//           ></div> */}
//         </div>
//       </div>
//       <div className="revision-history" ref={editorRevisionHistoryRef}>
//         <div className="revision-history__wrapper">
//           <div
//             className="revision-history__editor"
//             ref={editorRevisionHistoryEditorRef}
//           ></div>
//           <div
//             className="revision-history__sidebar"
//             ref={editorRevisionHistorySidebarRef}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function configUpdateAlert(config) {
//   if (configUpdateAlert.configUpdateAlertShown) {
//     return;
//   }

//   const isModifiedByUser = (currentValue, forbiddenValue) => {
//     if (currentValue === forbiddenValue) {
//       return false;
//     }

//     if (currentValue === undefined) {
//       return false;
//     }

//     return true;
//   };

//   const valuesToUpdate = [];

//   configUpdateAlert.configUpdateAlertShown = true;

//   if (!isModifiedByUser(config.licenseKey, "<YOUR_LICENSE_KEY>")) {
//     valuesToUpdate.push("LICENSE_KEY");
//   }

//   if (
//     !isModifiedByUser(
//       config.cloudServices?.tokenUrl,
//       "<YOUR_CLOUD_SERVICES_TOKEN_URL>"
//     )
//   ) {
//     valuesToUpdate.push("CLOUD_SERVICES_TOKEN_URL");
//   }

//   if (valuesToUpdate.length) {
//     window.alert(
//       [
//         "Please update the following values in your editor config",
//         "to receive full access to Premium Features:",
//         "",
//         ...valuesToUpdate.map((value) => ` - ${value}`),
//       ].join("\n")
//     );
//   }
// }
