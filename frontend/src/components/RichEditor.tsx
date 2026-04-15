import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect, useCallback } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, defaultProtocol: 'https' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML() === '<p></p>' ? '' : editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    const url = window.prompt('URLを入力してください', editor?.getAttributes('link').href ?? '')
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''} title="見出し">H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''} title="小見出し">H2</button>
        <div className="rich-editor-separator" />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''} title="太字"><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''} title="斜体"><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''} title="箇条書き">≡</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''} title="番号付きリスト">1.</button>
        <div className="rich-editor-separator" />
        <button type="button" onClick={setLink} className={editor.isActive('link') ? 'active' : ''} title="リンク">🔗</button>
        <button type="button" onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()} disabled={!editor.isActive('link')} title="リンク解除">🔗̶</button>
      </div>
      <EditorContent editor={editor} className="rich-editor-content" />
    </div>
  )
}
