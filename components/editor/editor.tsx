'use client'

import { useState } from 'react'

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent
} from 'novel'

import { ImageResizer, handleCommandNavigation } from 'novel'
import { handleImageDrop, handleImagePaste } from 'novel'

import {
  slashCommand,
  suggestionItems
} from '@/components/editor/slash-command'
import EditorMenu from '@/components/editor/editor-menu'
import { uploadFn } from '@/components/editor/image-upload'
import { defaultExtensions } from '@/components/editor/extensions'
import { TextButtons } from '@/components/editor/selectors/text-buttons'
import { LinkSelector } from '@/components/editor/selectors/link-selector'
import { NodeSelector } from '@/components/editor/selectors/node-selector'
import { ColorSelector } from '@/components/editor/selectors/color-selector'

import type { EditorView } from 'prosemirror-view';

const extensions = [...defaultExtensions, slashCommand]

export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
}

interface EditorProps {
  initialValue?: JSONContent
  onChange: (content: JSON) => void
  isAllowEdit?: boolean
}

export default function Editor({
  initialValue,
  onChange,
  isAllowEdit = true
}: EditorProps) {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  // const highlightCodeblocks = (content: string) => {
  //   const doc = new DOMParser().parseFromString(content, 'text/html')
  //   doc.querySelectorAll('pre code').forEach(el => {
  //     // @ts-ignore
  //     // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
  //     hljs.highlightElement(el)
  //   })
  //   return new XMLSerializer().serializeToString(doc)
  // }

  return (
    <div className='relative w-full'>
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialValue}
          extensions={extensions}
          className='min-h-96 rounded-xl p-4'
          editable={isAllowEdit}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view: EditorView, event: KeyboardEvent) =>
                handleCommandNavigation(event)
            },
            handlePaste: (view: EditorView, event: ClipboardEvent) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view: EditorView, event: DragEvent, _slice: any, moved: any) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                'prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full'
            }
          }}
          onUpdate={({ editor }: any) => {
            onChange(editor.getJSON())
          }}
          slotAfter={isAllowEdit ? <ImageResizer /> : undefined}
        >
          <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-card px-1 py-2 shadow-md transition-all'>
            <EditorCommandEmpty className='px-2 text-muted-foreground'>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map(item => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={val => item.command?.(val)}
                  className='flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent'
                  key={item.title}
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {isAllowEdit && (
            <EditorMenu open={openAI} onOpenChange={setOpenAI}>
              {/* <Separator orientation='vertical' /> */}
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />

              {/* <Separator orientation='vertical' /> */}
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />

              {/* <Separator orientation='vertical' />
            <MathSelector /> */}

              {/* <Separator orientation='vertical' /> */}
              <TextButtons />

              {/* <Separator orientation='vertical' /> */}
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </EditorMenu>
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
