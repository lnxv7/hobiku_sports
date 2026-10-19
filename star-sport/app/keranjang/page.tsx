"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  saveCart,
  type CartItem,
} from "../lib/cart";
import { formatPrice } from "../lib/products";


export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  function updateQuantity(productId: number, change: number) {
    const updated = items
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
    setItems(updated);

    const totalQuantity = updated.reduce(
      (total, item) => total + item.quantity,
      0
    );

    localStorage.setItem("hobiku-cart", String(totalQuantity));
  }

  function removeItem(productId: number) {
    const updated = items.filter(
      (item) => item.productId !== productId
    );

    saveCart(updated);
    setItems(updated);

    const totalQuantity = updated.reduce(
      (total, item) => total + item.quantity,
      0
    );

    localStorage.setItem("hobiku-cart", String(totalQuantity));
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


function checkoutWhatsApp() {
  const adminWhatsApp = ""; // Isi nomor admin nanti, contoh: 6281234567890

  if (items.length === 0) return;

  if (!adminWhatsApp) {
    alert("Nomor WhatsApp admin belum dikonfigurasi.");
    return;
  }

  const orderDetails = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}\n` +
        `   ${item.quantity} x ${formatPrice(item.price)}\n` +
        `   Subtotal: ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n\n");

  const message =
    `Halo Admin Hobiku Sports!\n\n` +
    `Saya ingin memesan produk berikut:\n\n` +
    `${orderDetails}\n\n` +
    `Total Produk: ${items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )} barang\n` +
    `Total Belanja: ${formatPrice(total)}\n\n` +
    `Mohon konfirmasi ketersediaan stok, ongkir, dan pembayaran. Terima kasih!`;

  const url = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Lanjut belanja
        </Link>

        <h1 className="mt-5 text-3xl font-bold">
          Keranjang Belanja
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Periksa produk pilihanmu sebelum melanjutkan.
        </p>

        {items.length === 0 ? (
          <section className="mt-8 rounded-2xl border bg-white p-8 text-center">
            <p className="text-5xl">🛒</p>
            <h2 className="mt-4 text-lg font-semibold">
              Keranjangmu masih kosong
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Yuk, temukan produk yang kamu suka!
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Lihat Produk
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border bg-white p-4"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-4xl">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-blue-700">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 rounded-lg border px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, -1)
                          }
                          className="px-2 font-semibold"
                          aria-label={`Kurangi ${item.name}`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, 1)
                          }
                          className="px-2 font-semibold"
                          aria-label={`Tambah ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <p className="text-right text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border bg-white p-5">
              <h2 className="text-lg font-bold">
                Ringkasan Belanja
              </h2>

              <div className="mt-5 flex justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  Total produk
                </span>
                <span>
                  {items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  barang
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="my-5 border-t" />

              <div className="flex justify-between gap-3 font-bold">
                <span>Total</span>
                <span className="text-blue-700">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-300 px-4 py-3 font-semibold text-slate-600"
              >
                
              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-xl bg-black px-4 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
               Lanjut ke Checkout
              </Link>

              </button>

              <p className="mt-3 text-xs text-slate-500">
                Checkout akan diaktifkan setelah halaman ini selesai diuji.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
