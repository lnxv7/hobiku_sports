
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Hobiku Sports
          </p>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Kelola operasional toko dalam satu tempat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Produk",
              description: "Kelola katalog dan harga produk.",
            },
            {
              title: "Stok",
              description: "Pantau ketersediaan barang.",
            },
            {
              title: "Pesanan",
              description: "Pantau transaksi pelanggan.",
            },
            {
              title: "Pembayaran",
              description: "Kelola konfirmasi pembayaran.",
            },
          ].map((menu) => (
            <div
              key={menu.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-lg font-semibold">
                {menu.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {menu.description}
              </p>
              <span className="mt-4 inline-block text-xs text-amber-700">
                Dalam pengembangan
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-blue-600 hover:underline"
        >
          Kembali ke toko
        </Link>
      </div>
    </main>
  );
}
