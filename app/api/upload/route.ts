import { NextRequest, NextResponse } from 'next/server';
import { uploadFiles } from '@/actions/upload/uploadAction';
import { EUploadType } from '@/constant/upload/allowUploadType';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadFiles(formData, EUploadType.TST_POST);
    
    if (result.meta.success) {
      return NextResponse.json({ urls: result.data });
    } else {
      return NextResponse.json({ error: result.meta.external_message }, { status: 400 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
