
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Product,
  normalizeDatabaseProduct,
  formatPrice,
} from "../../lib/products";
import { addProductToCart } from "../../lib/cart";


export default function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  
const [message, setMessage] = useState("");
const [product, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadProduct() {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Produk gagal dimuat.");
      }

      const data = (await response.json()) as {
        products: import("../../lib/products").DatabaseProduct[];
      };

      const found = data.products.find(
        (item) => item.id === Number(id)
      );

      if (!cancelled) {
        setProduct(found ? normalizeDatabaseProduct(found) : null);
        setLoadError("");
      }
    } catch {
      if (!cancelled) {
        setLoadError("Produk gagal dimuat. Silakan coba lagi.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadProduct();

  return () => {
    cancelled = true;
  };
}, [id]);

if (loading) {
  return (
    <main className="min-h-screen p-8 text-center">
      <p>Memuat detail produk...</p>
    </main>
  );
}

if (loadError) {
  return (
    <main className="min-h-screen p-8 text-center">
      <p>{loadError}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-lg bg-black px-5 py-3 text-white"
      >
        Coba lagi
      </button>
    </main>
  );
}

  if (!product) {
    return (
      <main className="min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-black px-5 py-3 text-white"
        >
          Kembali ke katalog
        </button>
      </main>
    );
  }

  const selectedProduct = product;

  function addToCart() {
    const items = addProductToCart(selectedProduct, quantity);
    const totalQuantity = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    localStorage.setItem("hobiku-cart", String(totalQuantity));
    setMessage(`${quantity} produk berhasil ditambahkan ke keranjang.`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-gray-600"
        >
          ← Kembali ke katalog
        </button>

        <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">
          <div
            className={`flex min-h-72 items-center justify-center rounded-2xl ${selectedProduct.background}`}
          >
            <span className="text-8xl">{selectedProduct.icon}</span>
          </div>

          <div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {selectedProduct.tag}
            </span>

            <p className="mt-4 text-sm text-gray-500">
              {selectedProduct.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {selectedProduct.name}
            </h1>

            <p className="mt-4 text-2xl font-bold">
              {formatPrice(selectedProduct.price)}
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              {selectedProduct.description}
            </p>

            <h2 className="mt-6 font-semibold">Spesifikasi produk</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {selectedProduct.specifications.map((specification, index) => (
                <li key={`${index}-${specification}`}>
                  • {specification}
                </li>
              ))}
            </ul>

            <p className="mt-6 font-semibold">Jumlah</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-lg border disabled:opacity-40"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity((current) => current + 1)}
                className="h-10 w-10 rounded-lg border"
              >
                +
              </button>
            </div>

            <p className="mt-5">
              Total:{" "}
              <strong>
                {formatPrice(selectedProduct.price * quantity)}
              </strong>
            </p>

            <button
              onClick={addToCart}
              className="mt-5 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white"
            >
              + Tambahkan ke Keranjang
            </button>

            {message && (
              <div role="status" className="mt-4 text-sm text-green-700">
                {message}{" "}
                <button
                  onClick={() => router.push("/keranjang")}
                  className="font-semibold underline"
                >
                  Lihat keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
