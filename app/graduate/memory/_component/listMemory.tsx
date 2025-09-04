import React from 'react';
import { Memory } from '@/model/graduate/graduate';
import Carousel from './carousel';

interface ListMemoryProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

const ListMemory: React.FC<ListMemoryProps> = ({ memories, onDelete, deletingId }) => {
  if (!memories || memories.length === 0) {
    return <div className="text-green-400 text-center mt-8">Chưa có kỷ niệm nào.</div>;
  }
  return (
    <div className="flex flex-col gap-8 mt-8 w-full max-w-2xl mx-auto">
      {memories.map((memory) => (
        <div key={memory.id} className="p-4 rounded-lg border border-green-700 bg-gray-900/70 shadow-lg">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="text-green-300 text-base">{memory.caption}</div>
            {onDelete && (
              <button
                className="text-red-500 px-2
                   focus:outline-none focus:border-b focus:border-red-400"
                onClick={() => onDelete(memory.id)}
                disabled={deletingId === memory.id}
                title="Xóa kỷ niệm này"
              >
                {deletingId === memory.id ? 'Đang xóa...' : 'Xóa'}
              </button>
            )}
          </div>
          {memory.images && memory.images.length > 0 && (
            <div className="mb-2">
              <Carousel images={memory.images.map(img => img.image_url)} autoPlay={true} imageFit='contain' />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListMemory;
