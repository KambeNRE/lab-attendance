"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";


type Member = {
  id: number;
  name: string;
  student_id: string | null;
  status: string;
  location: string | null;
  reason: string | null;
  updated_at: string;
  display_order: number | null;
};

const statuses = ["研究中", "一時離席", "退席", "欠席"];
const locations = ["9号館", "4号館", "国リハ", "自宅"];

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const [status, setStatus] = useState("研究中");
  const [location, setLocation] = useState("9号館");
  const [reason, setReason] = useState("");

  useEffect(() => {
  fetchMembers();

  const timer = setInterval(() => {
    fetchMembers();
  }, 3000);

  return () => clearInterval(timer);
}, []);

 async function fetchMembers() {

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

setMembers(data || []);
setLastUpdated(
  new Date().toLocaleTimeString("ja-JP")
);
setLoading(false);
}

  async function saveStatus() {
    if (!selectedMember) return;

    const { error } = await supabase
      .from("members")
      .update({
        status,
        location:
          status === "研究中" || status === "一時離席"
            ? location
            : null,
        reason:
          status === "欠席"
            ? reason
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedMember.id);

    if (error) {
      console.error(error);
      alert("保存失敗");
      return;
    }
    const { error: logError } = await supabase
  .from("attendance_logs")
  .insert({
    member_id: selectedMember.id,
    student_id: selectedMember.student_id,
    name: selectedMember.name,
    status,
    location:
      status === "研究中" || status === "一時離席"
        ? location
        : null,
    reason:
      status === "欠席"
        ? reason
        : null,
  });

if (logError) {
  console.error(logError);
  alert("ログ保存失敗");
  return;
}

    setSelectedMember(null);

    fetchMembers();
  }

  function cardColor(status: string) {
    if (status === "研究中") return "bg-green-400";
    if (status === "一時離席") return "bg-yellow-300";
    if (status === "退席") return "bg-red-400";
    if (status === "欠席") return "bg-gray-300";

    return "bg-white";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">
        研究室 状態管理システム
      </h1>
      <div className="mb-4">
  <Link
    href="/"
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    ← ホームに戻る
  </Link>
</div>
      
     <p className="mb-4 text-gray-500 h-6 text-sm">
  {loading
    ? "🔄 更新中..."
    : `最終更新: ${lastUpdated}`}
</p>
      <p className="text-black mb-4">
  メンバー数: {members.length}
</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => {
              setSelectedMember(member);

              setStatus(member.status);

              setLocation(
                member.location || "9号館"
              );

              setReason(
                member.reason || ""
              );
            }}
            className={`${cardColor(
              member.status
            )} rounded-xl p-4 shadow text-left min-h-32`}
          >
            <div className="text-xl font-bold">
              {member.name}
            </div>

            {member.student_id && (
  <div className="text-sm mt-1">
    {member.student_id}
  </div>
)}

            <div className="mt-2">
              {member.status}
            </div>

            {member.location && (
              <div>
                📍{member.location}
              </div>
            )}

            {member.status === "欠席" &&
              member.reason && (
                <div className="text-sm mt-1">
                  理由あり
                </div>
              )}
          </button>
        ))}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-xl font-bold mb-4">
              {selectedMember.name}
              の状態変更
            </h2>

            <label className="block mb-2">
              状態
            </label>

            <select
              className="border p-2 w-full mb-4"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              {statuses.map((s) => (
                <option key={s}>
                  {s}
                </option>
              ))}
            </select>

            {(status === "研究中" ||
              status === "一時離席") && (
              <>
                <label className="block mb-2">
                  場所
                </label>

                <select
                  className="border p-2 w-full mb-4"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                >
                  {locations.map((l) => (
                    <option key={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </>
            )}

            {status === "欠席" && (
              <>
                <label className="block mb-2">
                  欠席理由
                </label>

                <input
                  className="border p-2 w-full mb-4"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                />
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={saveStatus}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                保存
              </button>

              <button
                onClick={() =>
                  setSelectedMember(null)
                }
                className="bg-gray-300 px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}