"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Member = {
  id: number;
  name: string;
  student_id: string | null;
  display_order: number | null;
};

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("display_order");

    if (error) {
      console.error(error);
      return;
    }

    setMembers(data || []);
    setLoading(false);
  }

  async function saveMember(member: Member) {
    const { error } = await supabase
      .from("members")
      .update({
        name: member.name,
        student_id: member.student_id,
        display_order: member.display_order,
      })
      .eq("id", member.id);

    if (error) {
      alert("保存失敗");
      console.error(error);
      return;
    }

    alert("保存完了");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <Link
        href="/"
        className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        管理者ページ
      </h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="space-y-4">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <div className="grid md:grid-cols-4 gap-2">

                <input
                  className="border p-2 rounded"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...members];
                    updated[index].name = e.target.value;
                    setMembers(updated);
                  }}
                />

                <input
                  className="border p-2 rounded"
                  value={member.student_id ?? ""}
                  onChange={(e) => {
                    const updated = [...members];
                    updated[index].student_id = e.target.value;
                    setMembers(updated);
                  }}
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={member.display_order ?? 0}
                  onChange={(e) => {
                    const updated = [...members];
                    updated[index].display_order =
                      Number(e.target.value);
                    setMembers(updated);
                  }}
                />

                <button
                  onClick={() => saveMember(member)}
                  className="bg-green-500 text-white rounded px-4 py-2"
                >
                  保存
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}