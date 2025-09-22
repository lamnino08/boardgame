'use client'

import React, { useEffect } from 'react';
import Editor from '@/components/editor/editor';
import { generateHTML, generateJSON } from '@tiptap/html';
import { defaultExtensions } from '@/components/editor/extensions';

interface PostContentProps {
    content?: string
    onChange?: (newContent: string) => void,
    allowEdit: boolean
}

const PostContent: React.FC<PostContentProps> = ({ content = '', onChange, allowEdit }) => {
    return (
        <div className="w-full">
            <Editor
                initialValue={content && content.length > 0 ? generateJSON(content, defaultExtensions) : undefined}
                onChange={(json) => {
                    const html = generateHTML(json, defaultExtensions)
                    onChange?.(html)
                }}
                isAllowEdit={allowEdit}
            />
        </div>
    )
}

export default PostContent
