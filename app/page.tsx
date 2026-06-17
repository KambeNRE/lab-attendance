import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-3xl font-bold mb-2">
        研究室 状態管理システム
      </h1>

      <p className="text-gray-600 mb-8">
        研究室メンバーの状態確認・研究ログ・月間集計を管理します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/status"
          className="bg-white rounded-xl p-6 shadow hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold mb-2">
            現在の状態を見る
          </h2>
          <p className="text-gray-600">
            研究中・一時離席・退席・欠席を確認・変更します。
          </p>
        </Link>

        <Link
          href="/logs"
          className="bg-white rounded-xl p-6 shadow hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold mb-2">
            研究ログを見る
          </h2>
          <p className="text-gray-600">
            状態変更の履歴を新しい順に確認します。
          </p>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow opacity-60">
          <h2 className="text-xl font-bold mb-2">
            月間集計を見る
          </h2>
          <p className="text-gray-600">
            個人ごとの月間研究時間を確認します。今後追加予定。
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow opacity-60">
          <h2 className="text-xl font-bold mb-2">
            ランキングを見る
          </h2>
          <p className="text-gray-600">
            研究室内の研究時間ランキングを表示します。今後追加予定。
          </p>
        </div>

        <Link
          href="/admin"
          className="bg-white rounded-xl p-6 shadow hover:bg-gray-50 md:col-span-2"
        >
          <h2 className="text-xl font-bold mb-2">
            管理者設定
          </h2>
          <p className="text-gray-600">
            メンバー編集・並び順変更
          </p>
        </Link>
      </div>
    </main>
  );
}