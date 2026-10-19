
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getCart, type CartItem } from "../lib/cart";
import { formatPrice } from "../lib/products";

const ADMIN_WHATSAPP = "628119125556";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("delivery");
  const [payment, setPayment] = useState("transfer");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(getCart());
    setLoading(false);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Keranjangmu masih kosong.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Lengkapi nama dan nomor HP terlebih dahulu.");
      return;
    }

    if (shipping === "delivery" && !address.trim()) {
      setError("Masukkan alamat pengiriman terlebih dahulu.");
      return;
    }

    const orderItems = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n` +
          `   ${item.quantity} x ${formatPrice(item.price)}\n` +
          `   Subtotal: ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n\n");

    const message = [
      "Halo Admin Hobiku Sports, saya ingin membuat pesanan.",
      "",
      "DATA PEMBELI",
      `Nama: ${name.trim()}`,
      `No. HP: ${phone.trim()}`,
      `Pengiriman: ${
        shipping === "delivery"
          ? "Dikirim ke alamat"
          : "Ambil langsung"
      }`,
      ...(shipping === "delivery"
        ? [`Alamat: ${address.trim()}`]
        : []),
      `Pembayaran: ${
        payment === "transfer"
          ? "Transfer bank manual"
          : "QRIS manual"
      }`,
      ...(notes.trim() ? [`Catatan: ${notes.trim()}`] : []),
      "",
      "DAFTAR PESANAN",
      orderItems,
      "",
      `Total barang: ${totalQuantity}`,
      `Subtotal produk: ${formatPrice(total)}`,
      "Ongkir: Menunggu konfirmasi admin",
      "",
      "Mohon konfirmasi stok, ongkir, dan instruksi pembayaran. Terima kasih.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappUrl;
  }

  if (loading) {
    return <main className="p-8">Memuat checkout...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">
            Keranjang masih kosong
          </h1>
          <p className="mt-3 text-slate-600">
            Tambahkan produk sebelum melanjutkan checkout.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            Kembali belanja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/keranjang"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Kembali ke keranjang
        </Link>

        <h1 className="mt-5 text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-sm text-slate-500">
          Isi data dengan benar agar admin dapat mengonfirmasi pesananmu.
        </p>

        <form onSubmit={submitOrder} className="mt-7 space-y-6">
          <section className="space-y-4 rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-bold">Data penerima</h2>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Nama lengkap
              </label>
              <input
                id="name"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="Nama penerima"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                Nomor HP aktif
              </label>
              <input
                id="phone"
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="Contoh: 081234567890"
              />
            </div>

            <div>
              <label
                htmlFor="shipping"
                className="mb-1 block text-sm font-medium"
              >
                Metode pengiriman
              </label>
              <select
                id="shipping"
                value={shipping}
                onChange={(event) => setShipping(event.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-3"
              >
                <option value="delivery">Dikirim ke alamat</option>
                <option value="pickup">Ambil langsung (jika tersedia)</option>
              </select>
            </div>

            {shipping === "delivery" && (
              <div>
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium"
                >
                  Alamat lengkap
                </label>
                <textarea
                  id="address"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                  rows={3}
                  placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="payment"
                className="mb-1 block text-sm font-medium"
              >
                Metode pembayaran
              </label>
              <select
                id="payment"
                value={payment}
                onChange={(event) => setPayment(event.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-3"
              >
                <option value="transfer">Transfer bank manual</option>
                <option value="qris">QRIS manual (jika tersedia)</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Pembayaran dilakukan setelah admin mengonfirmasi pesanan.
              </p>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-medium"
              >
                Catatan pesanan (opsional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
                rows={2}
                placeholder="Catatan tambahan untuk admin"
              />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-bold">Ringkasan pesanan</h2>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t" />

            <div className="flex justify-between gap-4 font-bold">
              <span>Subtotal produk</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Ongkir belum termasuk dan akan dikonfirmasi oleh admin.
            </p>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            Lanjutkan ke WhatsApp
          </button>
        </form>
      </div>
    </main>
  );
}
