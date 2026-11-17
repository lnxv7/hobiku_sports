
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Product,
  normalizeDatabaseProduct,
  formatPrice,
} from "./lib/products";
import { addProductToCart } from "./lib/cart";
import Link from "next/link";

const categories = [
  { name: "Semua", icon: "✦", description: "Semua kebutuhan" },
  {
    name: "Sports & Outdoors",
    icon: "⚽",
    description: "Aktivitas luar ruang",
  },
  { name: "Fitness & Gym", icon: "🏋️", description: "Latihan dan kebugaran" },
  {
    name: "Home Appliances",
    icon: "⌂",
    description: "Peralatan rumah",
  },
  {
    name: "Fashion & Accessories",
    icon: "◈",
    description: "Gaya sehari-hari",
  },
  {
    name: "Shoes & Footwear",
    icon: "👟",
    description: "Pilihan alas kaki",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
  let cancelled = false;

  async function loadProducts() {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Produk gagal dimuat.");
      }

      const data = (await response.json()) as {
        products: import("./lib/products").DatabaseProduct[];
      };

      if (!cancelled) {
        setProducts(data.products.map(normalizeDatabaseProduct));
        setProductsError("");
      }
    } catch {
      if (!cancelled) {
        setProductsError("Produk belum berhasil dimuat. Silakan coba lagi.");
      }
    } finally {
      if (!cancelled) {
        setLoadingProducts(false);
      }
    }
  }

  loadProducts();

  return () => {
    cancelled = true;
  };

}, []);

  useEffect(() => {
    const savedCart = Number(
      localStorage.getItem("hobiku-cart") || "0"
    );
    setCart(savedCart);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        category === "Semua" || product.category === category;

      const searchTerm = search.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      return matchCategory && matchSearch;
    });
  }, [products, search, category]);

  function showMessage(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  }

  function addToCart(name: string) {
    const product = products.find((item) => item.name === name);
    if (!product) return;

    const items = addProductToCart(product);
    const updated = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    localStorage.setItem("hobiku-cart", String(updated));
    setCart(updated);
    showMessage(`${name} ditambahkan ke keranjang`);
  }

  function goToProducts() {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-slate-800 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" aria-label="Hobiku Sports beranda" className="shrink-0">
            <span className="block font-[family-name:var(--font-anton)] text-2xl tracking-wide text-[#172b4d] sm:text-3xl">
                HOBIKU SPORTS <span className="text-[#3478f6]">.</span>
            </span>
            <span className="hidden text-[9px] tracking-[0.22em] text-slate-500 sm:block">
              YOUR PASSION YOUR LIFESTYLE 
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            <a href="#" className="text-sm font-medium text-[#172b4d]">
              Beranda
            </a>
            <a
              href="#categories"
              className="text-sm text-slate-600 transition hover:text-[#3478f6]"
            >
              Kategori
            </a>
            <a
              href="#products"
              className="text-sm text-slate-600 transition hover:text-[#3478f6]"
            >
              Produk
            </a>
            <a
              href="#about"
              className="text-sm text-slate-600 transition hover:text-[#3478f6]"
            >
              Tentang
            </a>
          </nav>

          <div className="hidden min-w-0 max-w-sm flex-1 xl:block">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span aria-hidden="true" className="text-lg text-slate-400">
                ⌕
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari produk..."
                aria-label="Cari produk"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Hapus pencarian"
                  className="text-slate-500"
                >
                  ✕
                </button>
              )}
            </label>
          </div>

          <button
            onClick={() => showMessage(`Keranjang berisi ${cart} barang`)}
            aria-label="Lihat keranjang"
            className="relative flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-[#172b4d] transition hover:bg-slate-50"
          >
            <Link href="/keranjang"className="inline-flex items-center gap-2">
            <span>🛒</span>
            <span>Cart</span>
            </Link>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3478f6] px-1 text-xs font-bold text-white">
              {cart}
            </span>
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 xl:hidden lg:px-8">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span aria-hidden="true" className="text-lg text-slate-400">
              ⌕
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari produk dan kategori..."
              aria-label="Cari produk"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="text-slate-500"
              >
                ✕
              </button>
            )}
          </label>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#f4f6f8] sm:mt-8 lg:grid lg:grid-cols-2 lg:items-center">
          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#3478f6]">
              YOUR PASSION YOUR LIFESTYLE
            </p>
            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-anton)] text-4xl leading-tight tracking-wide text-[#172b4d] sm:text-5xl lg:text-6xl">
              FIND YOUR
              <br />
              EVERYDAY ESSENTIALS.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Temukan kebutuhan olahraga, fitness, rumah, fashion, dan alas
              kaki dalam satu tempat.
            </p>
            <button
              onClick={goToProducts}
              className="mt-7 rounded-xl bg-[#172b4d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#263f65] active:scale-95"
            >
              Belanja sekarang <span aria-hidden="true">→</span>
            </button>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>Beragam kategori</span>
              <span>•</span>
              <span>Belanja praktis</span>
              <span>•</span>
              <span>Mudah dijelajahi</span>
            </div>
          </div>

          <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-[#e8edf3] px-6 py-10 sm:min-h-80 lg:min-h-full">
            <div className="absolute h-64 w-64 rounded-full border border-white sm:h-80 sm:w-80" />
            <div className="absolute h-48 w-48 rounded-full border border-white sm:h-60 sm:w-60" />
            <div className="relative grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-white text-6xl shadow-sm sm:text-7xl">
                👟
              </div>
              <div className="mt-7 flex aspect-square items-center justify-center rounded-3xl bg-[#dce7f8] text-6xl sm:text-7xl">
                🛍️
              </div>
              <div className="-mt-7 flex aspect-square items-center justify-center rounded-3xl bg-[#e5eaf0] text-6xl sm:text-7xl">
                💪
              </div>
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-white text-6xl shadow-sm sm:text-7xl">
                🧢
              </div>
            </div>
            <span className="absolute bottom-4 right-5 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
              EXPLORE YOUR STYLE
            </span>
          </div>
        </section>

        <section id="categories" className="scroll-mt-36 pt-12 sm:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#3478f6]">
                EXPLORE OUR COLLECTION
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-anton)] text-2xl tracking-wide text-[#172b4d] sm:text-3xl">
                SHOP BY CATEGORY
              </h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              Temukan kategori yang sesuai dengan kebutuhanmu.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  goToProducts();
                }}
                className={`group flex min-h-36 flex-col items-start justify-between rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  category === item.name
                    ? "border-[#172b4d] bg-[#172b4d] text-white"
                    : "border-slate-200 bg-white text-[#172b4d] hover:border-[#3478f6]"
                }`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-5">
                    {item.name}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      category === item.name
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="products" className="scroll-mt-36 pt-12 sm:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#3478f6]">
                CURATED FOR YOU
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-anton)] text-2xl tracking-wide text-[#172b4d] sm:text-3xl">
                FEATURED PRODUCTS
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {category === "Semua" ? "Pilihan produk untukmu" : category}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {filteredProducts.length} produk
            </span>
          </div>

{loadingProducts && (
  <p className="mt-6 py-10 text-center text-sm text-slate-500">
    Memuat produk...
  </p>
)}

{!loadingProducts && productsError && (
  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center">
    <p className="font-semibold text-red-800">
      Produk belum bisa ditampilkan
    </p>
    <p className="mt-2 text-sm text-red-700">
      {productsError}
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-4 rounded-xl bg-[#172b4d] px-4 py-2.5 text-sm font-semibold text-white"
    >
      Coba lagi
    </button>
  </div>
)}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">
            
{filteredProducts.map((product) => (
  <article
    key={product.id}
    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
  >
    <button
      type="button"
      onClick={() => router.push(`/produk/${product.id}`)}
      className="block w-full text-left"
      aria-label={`Lihat detail ${product.name}`}
    >
      <div
        className={`relative flex aspect-square items-center justify-center ${product.background}`}
      >
        <span
          className="text-6xl transition duration-300 group-hover:scale-110 sm:text-7xl"
          role="img"
          aria-label={product.name}
        >
          {product.icon}
        </span>

        {product.tag && (
          <span className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 text-[9px] font-bold tracking-wide text-[#172b4d] shadow-sm sm:left-3 sm:top-3">
            {product.tag}
          </span>
        )}
      </div>

      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <p className="truncate text-[10px] text-slate-500 sm:text-xs">
          {product.category}
        </p>
        <h3 className="mt-1 truncate text-sm font-semibold text-[#172b4d]">
          {product.name}
        </h3>
        <p className="mt-3 text-sm font-bold text-[#172b4d] sm:text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </button>

    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
      <button
        type="button"
        onClick={() => addToCart(product.name)}
        className="mt-3 w-full rounded-xl border border-[#172b4d] py-2.5 text-xs font-semibold text-[#172b4d] transition hover:bg-[#172b4d] hover:text-white active:scale-95"
      >
        + Tambah ke keranjang
      </button>
    </div>
  </article>
))}
          </div>

          {!loadingProducts &&
  !productsError &&
  filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-14 text-center">
              <p className="text-3xl" aria-hidden="true">
                ⌕
              </p>
              <p className="mt-3 font-semibold text-[#172b4d]">
                Produk tidak ditemukan
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Coba kata kunci atau kategori lain.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Semua");
                }}
                className="mt-4 rounded-xl bg-[#172b4d] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Reset pencarian
              </button>
            </div>
          )}
        </section>

        <section
          id="about"
          className="mt-14 grid gap-6 rounded-3xl bg-[#172b4d] p-6 text-white sm:mt-20 sm:grid-cols-2 sm:items-center sm:p-10 lg:p-12"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-blue-300">
              YOUR PASSION YOUR LIFESTYLE
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-anton)] text-3xl tracking-wide sm:text-4xl">
              MAKE EVERYDAY SHOPPING SIMPLE.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              Jelajahi berbagai pilihan produk untuk mendukung aktivitas,
              kebutuhan rumah, dan gaya sehari-hari.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <button
              onClick={goToProducts}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#172b4d] transition hover:bg-slate-100 active:scale-95"
            >
              Jelajahi produk →
            </button>
          </div>
        </section>

        <section className="border-b border-slate-200 py-10 sm:py-12">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-anton)] text-xl tracking-wide text-[#172b4d] sm:text-2xl">
              PAYMENT INFORMATION
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Informasi metode pembayaran akan ditampilkan sesuai pilihan
              pembayaran yang tersedia saat checkout.
            </p>
          </div>
          <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {["Bank Transfer", "Virtual Account", "E-Wallet", "QRIS"].map(
              (payment) => (
                <div
                  key={payment}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs font-medium text-slate-600"
                >
                  {payment}
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      <footer className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <a
              href="#"
              className="font-[family-name:var(--font-anton)] text-2xl tracking-wide text-[#172b4d]"
            >
              HOBIKU SPORTS<span className="text-[#3478f6]">.</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Your Passion Your Lifestyle for sports, home, fashion, and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#172b4d]">Explore</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
              <a href="#categories" className="hover:text-[#3478f6]">
                Kategori
              </a>
              <a href="#products" className="hover:text-[#3478f6]">
                Produk pilihan
              </a>
              <a href="#about" className="hover:text-[#3478f6]">
                Tentang Hobiku Sports
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#172b4d]">Customer Care</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
              <span>Informasi pengiriman</span>
              <span>Kebijakan pengembalian</span>
              <span>Hubungi kami</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#172b4d]">Belanja nyaman</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Periksa informasi produk, harga, stok, dan metode pembayaran
              sebelum menyelesaikan pesanan.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500">
         © 2026 Hobiku Sports. All rights reserved.
        </div>
      </footer>

      {message && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-50 w-max max-w-[90%] -translate-x-1/2 rounded-xl bg-[#172b4d] px-4 py-3 text-center text-sm font-medium text-white shadow-lg md:bottom-6"
        >
          {message}
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-3">
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-[#172b4d]"
          >
            <span className="text-xl" aria-hidden="true">
              ⌂
            </span>
            <span className="text-[10px] font-semibold">Beranda</span>
          </a>
          <button
            onClick={goToProducts}
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <span className="text-xl" aria-hidden="true">
              ▦
            </span>
            <span className="text-[10px]">Produk</span>
          </button>
          <button
            onClick={() => showMessage(`Keranjang berisi ${cart} barang`)}
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <span className="text-xl" aria-hidden="true">
              ♧
            </span>
            <span className="text-[10px]">Keranjang ({cart})</span>
          </button>
          <button
            onClick={() =>
              showMessage("Fitur akun akan dibuat pada tahap berikutnya.")
            }
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <span className="text-xl" aria-hidden="true">
              ♙
            </span>
            <span className="text-[10px]">Akun</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
