'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import riddleImg from '@/assets/game/image.png';
import { submitAnswer } from '@/actions/graduate/answerAction';

export default function RiddleGamePage() {
	const router = useRouter();

	// Bạn chỉ cần sửa nội dung 2 câu dưới đây
	const Q1_TEXT = 'Có một công viên được chia thành nhiều khu vực khác nhau, mỗi khu có chu vi khác nhau. Hãy tính chu vi của công viên.';
	const Q2_TEXT = 'Có một căn phòng, anh A sơn xong trong 6 ngày, anh B sơn xong trong 2 ngày. Hỏi cả hai cùng sơn thì mất bao lâu?';

	const [answer1, setAnswer1] = useState('');
	const [answer2, setAnswer2] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [loadingId, setLoadingId] = useState<number | null>(null);

	const handleSubmit = async (questionId: number, value: string) => {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			alert('Vui lòng nhập đáp án.');
			return;
		}
		try {
			setLoadingId(questionId);
			const res = await submitAnswer(questionId, trimmed);
			if (res.meta?.success) {
				alert('Đã gửi đáp án!');
			} else {
				alert('Gửi đáp án thất bại.');
			}
		} catch (e) {
			alert('Có lỗi khi gửi đáp án.');
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="w-full flex justify-center px-4">
			<div className="w-full max-w-2xl mt-8">
				<div className="w-full flex items-center justify-between mb-4">
					<h1 className="text-green-400 text-lg">Đố vui</h1>
					<button
						onClick={() => router.replace('/graduate/letter')}
						className="text-green-500 px-2 border border-green-700 rounded hover:bg-green-600/10"
					>
						&lt; Trở lại
					</button>
				</div>

				{/* Câu 1 - có hình ảnh */}
				<div className="rounded-lg border border-green-700 bg-black/60 p-4 mb-6">
					<div className="mb-4 flex justify-center">
						<button onClick={() => setShowModal(true)} className="focus:outline-none rounded border border-green-700/40 hover:border-green-500/60">
							<Image src={riddleImg} alt="riddle" className="opacity-80" style={{ maxHeight: 160, width: 'auto', height: 'auto' }} />
						</button>
					</div>

					<p className="text-green-300 mb-3 leading-7">{Q1_TEXT}</p>

					<div className="flex gap-2 items-center">
						<input
							value={answer1}
							onChange={(e) => setAnswer1(e.target.value)}
							onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(1, answer1); }}
							className="flex-1 bg-black text-green-300 px-2 border border-green-700 rounded outline-none focus:border-green-500"
							placeholder="Nhập đáp án..."
						/>
						<button
							onClick={() => handleSubmit(1, answer1)}
							disabled={loadingId === 1}
							className="text-green-500 px-3 py-1 border border-green-700 rounded hover:bg-green-600/10 disabled:opacity-50"
						>
							{loadingId === 1 ? 'Đang gửi...' : 'Gửi đáp án'}
						</button>
					</div>
				</div>

				{/* Câu 2 - không có hình ảnh */}
				<div className="rounded-lg border border-green-700 bg-black/60 p-4">
					<p className="text-green-300 mb-3 leading-7">{Q2_TEXT}</p>
					<div className="flex gap-2 items-center">
						<input
							value={answer2}
							onChange={(e) => setAnswer2(e.target.value)}
							onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(2, answer2); }}
							className="flex-1 bg-black text-green-300 px-2 border border-green-700 rounded outline-none focus:border-green-500"
							placeholder="Nhập đáp án..."
						/>
						<button
							onClick={() => handleSubmit(2, answer2)}
							disabled={loadingId === 2}
							className="text-green-500 px-3 py-1 border border-green-700 rounded hover:bg-green-600/10 disabled:opacity-50"
						>
							{loadingId === 2 ? 'Đang gửi...' : 'Gửi đáp án'}
						</button>
					</div>
				</div>
			</div>

			{/* Modal xem ảnh cho câu 1 */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
					<button
						onClick={() => setShowModal(false)}
						className="absolute top-4 right-4 text-green-400 border border-green-700 rounded px-3 py-1 hover:bg-green-600/10"
					>
						Đóng
					</button>
					<div className="max-w-5xl w-[90%] max-h-[80vh] flex items-center justify-center">
						<Image src={riddleImg} alt="riddle-large" className="border border-green-700 rounded" style={{ maxWidth: '100%', maxHeight: '80vh', width: 'auto', height: 'auto', objectFit: 'contain' }} />
					</div>
				</div>
			)}
		</div>
	);
}
