"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventDetailPage() {
    const router = useRouter();

    const DEST_NAME = "Khu F Trường ĐHBK Đà Nẵng";
    const DEST_ADDRESS = "54 Nguyễn Lương Bằng - Liên Chiểu - Đà Nẵng";
    const DEST_LAT = 16.0753325;
    const DEST_LNG = 108.1518577;
    const DEST_SDT = "0932536332";

    const mapsPlaceUrl = "https://www.google.com/maps/place/Khu+F+Tr%C6%B0%E1%BB%9Dng+%C4%90HBK+%C4%90%C3%A0+N%E1%BA%B5ng/@16.0742904,108.1496649,17.75z/data=!4m12!1m5!3m4!2zMTbCsDA0JzI1LjUiTiAxMDjCsDA4JzU5LjMiRQ!8m2!3d16.073742!4d108.149797!3m5!1s0x314218d72994b8e9:0xfe93df992c47d0a1!8m2!3d16.0753325!4d108.1518577!16s%2Fg%2F11csqyxgzg?entry=ttu&g_ep=EgoyMDI1MDgzMC4wIKXMDSoASAFQAw%3D%3D";
    const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${DEST_LAT},${DEST_LNG}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${DEST_NAME} - ${DEST_ADDRESS}`);
            alert("Đã copy địa chỉ vào clipboard!");
        } catch {
            alert("Không thể copy. Vui lòng thử lại.");
        }
    };

    const campusImages = [
        "https://dut.udn.vn/Files/admin/images/Tuyen_sinh/2021/Sodo/Sodo2.png",
        "https://dut.udn.vn/Files/admin/images/Tuyen_sinh/2021/Sodo/Sodo1.png",
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const openModalAt = (idx: number) => {
        setModalIndex(idx);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const prevImage = () => setModalIndex((i) => (i - 1 + campusImages.length) % campusImages.length);
    const nextImage = () => setModalIndex((i) => (i + 1) % campusImages.length);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <div className="w-full flex items-center justify-between mb-4">
					<h1 className="text-green-400 text-lg">Chi tiết sự kiện nè</h1>
					<button
                        onClick={() => router.replace('/graduate/letter')}
                        className="text-green-500 px-2 border border-green-700 rounded hover:bg-green-600/10 focus:outline-none"
                    >
                        &lt; Trở lại
                    </button>
				</div>

                <div className="rounded-lg border border-green-700 bg-black/60 p-4">
                    <div className="rounded border border-green-700 p-4 bg-black/50 mb-2">
                        <div className="text-green-400 font-semibold mb-2">Thời gian – Địa điểm</div>
                        <ul className="list-disc pl-5 text-green-300 text-sm space-y-1">
                            <li>Thời gian: 07:30 – 11:30</li>
                            <li>Địa điểm chính: {DEST_NAME}</li>
                            <li>Địa chỉ: {DEST_ADDRESS}</li>
                            <li>Số điện thoại: {DEST_SDT} - kỹ sư phần mềm Phan Đức Lâm</li>
                        </ul>
                    </div>
                    <div className="rounded border border-green-700 p-2 bg-black/50 mb-2 gap-4">
                        <div className="text-green-400 mb-2">Bản đồ:</div>
                        <div className="w-full overflow-hidden rounded-md border border-green-700 bg-neutral-900">
                            <div className="w-full aspect-video">
                                <iframe
                                    title="Bản đồ - Khu F Trường ĐHBK Đà Nẵng"
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${DEST_LAT},${DEST_LNG}&z=16&output=embed`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => window.open(mapsPlaceUrl, "_blank")}
                                    className="text-green-500 px-3 py-1 border border-green-700 rounded hover:bg-green-600/10"
                                >
                                    Mở Google Maps
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="text-green-500 px-3 py-1 border border-green-700 rounded hover:bg-green-600/10"
                                >
                                    Copy địa chỉ
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <div className="rounded border border-green-700 p-4 bg-black/50">
                            <div className="text-green-400 font-semibold mb-2">Giới thiệu Trường</div>
                            <p className="text-green-300 text-sm leading-6">
                                Trường Đại học Bách Khoa – Đại học Đà Nẵng là một trong những cơ sở đào tạo kỹ thuật hàng đầu miền Trung,
                                với khuôn viên rộng, nhiều giảng đường, phòng thí nghiệm hiện đại và các khu vực chức năng phục vụ sinh viên.
                            </p>
                        </div>

                        <div className="rounded border border-green-700 p-4 bg-black/50">
                            <div className="text-green-400 font-semibold mb-2">Sơ đồ khuôn viên</div>
                            <p className="text-green-300 text-sm mb-3">
                                Xem bản đồ để tìm bãi giữ xe và hội trường F chớ không lạc!!
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {campusImages.map((src, idx) => (
                                    <button
                                        key={src}
                                        onClick={() => openModalAt(idx)}
                                        className="block overflow-hidden rounded-md border border-green-700 bg-neutral-900 hover:bg-neutral-800/60 focus:outline-none"
                                        title="Nhấn để phóng to"
                                    >
                                        <img src={src} alt={`Sơ đồ khuôn viên ĐHBK - ${idx + 1}`} className="w-full h-64 object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded border border-green-700 p-4 bg-black/50">
                            <div className="text-green-400 font-semibold mb-2">Gửi xe/Đỗ xe</div>
                            <ul className="list-disc pl-5 text-green-300 text-sm space-y-1">
                                <li>Khu vực gửi xe máy: bãi xe cạnh Khu F (theo chỉ dẫn tại cổng vào).</li>
                                <li>Ô tô: vui lòng đỗ tại bãi xe phía ngoài cổng trường (nếu đông, cân nhắc gửi ở bãi lân cận).</li>
                                <li>Nên đến sớm 15-20 phút để tìm chỗ gửi xe thuận tiện.</li>
                            </ul>
                        </div>


                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <button
                        className="absolute top-4 right-4 text-green-400 border border-green-700 rounded px-3 py-1 hover:bg-green-600/10"
                        onClick={closeModal}
                        aria-label="Đóng"
                    >
                        Đóng
                    </button>
                    <button
                        className="absolute left-4 text-green-400 border border-green-700 rounded px-3 py-1 hover:bg-green-600/10"
                        onClick={prevImage}
                        aria-label="Ảnh trước"
                    >
                        &#10094;
                    </button>
                    <div className="max-w-5xl w-[90%] max-h-[80vh] flex items-center justify-center">
                        <img
                            src={campusImages[modalIndex]}
                            alt={`Sơ đồ khuôn viên ĐHBK - ${modalIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain border border-green-700 rounded"
                        />
                    </div>
                    <button
                        className="absolute right-4 text-green-400 border border-green-700 rounded px-3 py-1 hover:bg-green-600/10"
                        onClick={nextImage}
                        aria-label="Ảnh sau"
                    >
                        &#10095;
                    </button>
                </div>
            )}
        </div>
    );
}
