"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AttendanceLog = {
  id: number;
  member_id: number | null;
  student_id: string | null;
  name: string | null;
  status: string;
  location: string | null;
  reason: string | null;
  changed_at: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("attendance_logs")
      .select("*")
      .order("changed_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setLogs(data || []);
    setLoading(false);
  }

  function formatDateTime(value: string) {
    const date = new Date(value);

    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function statusColor(status: string) {
    if (status === "研究中") return "text-green-600";
    if (status === "一時離席") return "text-yellow-600";
    if (status === "退席") return "text-red-600";
    if (status === "欠席") return "text-gray-600";
    return "text-black";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <Link
        href="/"
        className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">研究ログ</h1>

      <p className="text-gray-600 mb-6">
        状態変更の履歴を新しい順に表示します。
      </p>

      <div className="mb-4 text-sm text-gray-500 h-6">
        {loading ? "🔄 読み込み中..." : `表示件数: ${logs.length}件`}
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-xl p-4 shadow"
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-lg font-bold">
                  {log.name}
                </div>

                {log.student_id && (
                  <div className="text-sm text-gray-500">
                    {log.student_id}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {formatDateTime(log.changed_at)}
              </div>
            </div>

            <div className={`mt-3 font-bold ${statusColor(log.status)}`}>
              {log.status}
            </div>

            {log.location && (
              <div className="mt-1 text-gray-700">
                📍{log.location}
              </div>
            )}

            {log.reason && (
              <div className="mt-1 text-gray-700">
                理由：{log.reason}
              </div>
            )}
          </div>
        ))}

        {!loading && logs.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow text-gray-500">
            まだ研究ログがありません。
          </div>
        )}
      </div>
    </main>
  );
}