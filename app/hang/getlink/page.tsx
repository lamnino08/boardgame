'use client';

import { useState, useEffect } from "react";

interface InviteLink {
  name: string;
  link: string;
}

export default function GenerateLinkPage() {
  const [name, setName] = useState("");
  const [links, setLinks] = useState<InviteLink[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Load list từ localStorage khi mở trang
  useEffect(() => {
    const savedLinks = localStorage.getItem("invite-links");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  const handleGenerate = () => {
    const url = `${window.location.origin}/invite?name=${encodeURIComponent(
      name || "bạn"
    )}`;
    const newEntry = { name: name || "bạn", link: url };

    const updatedLinks = [newEntry, ...links]; // thêm vào đầu
    setLinks(updatedLinks);

    // Lưu lại list
    localStorage.setItem("invite-links", JSON.stringify(updatedLinks));

    setName(""); // reset ô input
  };

  const handleCopy = async (link: string, index: number) => {
    await navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDelete = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    localStorage.setItem("invite-links", JSON.stringify(updatedLinks));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">
          🔗 Tạo Link Thiệp Mời
        </h1>

        {/* Ô nhập tên */}
        <input
          type="text"
          placeholder="Nhập tên người được mời..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 text-black border rounded-lg mb-4 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        {/* Nút tạo link */}
        <button
          onClick={handleGenerate}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition"
        >
          Tạo link
        </button>

        {/* Danh sách link đã tạo */}
        {links.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              📜 Lịch sử thiệp mời:
            </h2>
            <ul className="space-y-4">
              {links.map((item, index) => (
                <li
                  key={index}
                  className="p-4 bg-pink-50 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="text-pink-700 font-medium">{item.name}</p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 text-sm hover:underline break-all"
                    >
                      {item.link}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.link, index)}
                      className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      {copiedIndex === index ? "✅ Đã copy!" : "📋 Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-200 px-3 py-1 rounded-lg hover:bg-red-300 transition text-sm text-red-700"
                    >
                      ❌ Xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
