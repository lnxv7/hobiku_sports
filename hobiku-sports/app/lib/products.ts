export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  icon: string;
  tag: string;
  background: string;
  description: string;
  specifications: string[];
};

export type DatabaseProduct = {
  id: number;
  sku: string | null;
  name: string;
  slug: string | null;
  category: string;
  price: number;
  stock: number;
  description: string;
  specifications: string[] | string;
  image_url: string | null;
  weight_grams: number;
  package_length_cm: number;
  package_width_cm: number;
  package_height_cm: number;
  tag: string;
  is_active: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Running Shoes",
    category: "Shoes & Footwear",
    price: 299000,
    icon: "👟",
    tag: "BEST SELLER",
    background: "bg-sky-50",
    description:
      "Sepatu untuk menemani aktivitas olahraga dan kegiatan sehari-hari dengan nyaman.",
    specifications: [
      "Kategori: Sepatu olahraga",
      "Penggunaan: Olahraga dan aktivitas harian",
      "Ukuran: Sesuaikan dengan stok toko",
    ],
  },
  {
    id: 2,
    name: "Training Jersey",
    category: "Fashion & Accessories",
    price: 149000,
    icon: "👕",
    tag: "NEW",
    background: "bg-orange-50",
    description:
      "Jersey untuk mendukung aktivitas latihan dan olahraga sehari-hari.",
    specifications: [
      "Kategori: Pakaian olahraga",
      "Penggunaan: Latihan dan olahraga",
      "Ukuran: Sesuaikan dengan stok toko",
    ],
  },
  {
    id: 3,
    name: "Dumbbell Set",
    category: "Fitness & Gym",
    price: 199000,
    icon: "🏋️",
    tag: "",
    background: "bg-slate-100",
    description:
      "Peralatan latihan beban untuk membantu rutinitas kebugaran di rumah.",
    specifications: [
      "Kategori: Peralatan fitness",
      "Penggunaan: Latihan beban",
      "Berat dan isi set: Perlu disesuaikan dengan produk asli",
    ],
  },
  {
    id: 4,
    name: "Sports Backpack",
    category: "Sports & Outdoors",
    price: 179000,
    icon: "🎒",
    tag: "",
    background: "bg-amber-50",
    description:
      "Tas untuk membawa perlengkapan olahraga saat latihan maupun bepergian.",
    specifications: [
      "Kategori: Tas olahraga",
      "Penggunaan: Olahraga dan aktivitas luar ruang",
      "Kapasitas: Perlu disesuaikan dengan produk asli",
    ],
  },
  {
    id: 5,
    name: "Outdoor Sports Ball",
    category: "Sports & Outdoors",
    price: 99000,
    icon: "⚽",
    tag: "",
    background: "bg-emerald-50",
    description:
      "Bola untuk menemani aktivitas olahraga dan permainan di luar ruangan.",
    specifications: [
      "Kategori: Peralatan olahraga",
      "Penggunaan: Olahraga luar ruang",
      "Jenis bola: Perlu disesuaikan dengan produk asli",
    ],
  },
  {
    id: 6,
    name: "Fitness Bottle",
    category: "Fitness & Gym",
    price: 59000,
    icon: "🧴",
    tag: "PRACTICAL",
    background: "bg-blue-50",
    description:
      "Botol minum untuk menemani aktivitas latihan dan menjaga kebutuhan cairan.",
    specifications: [
      "Kategori: Aksesori fitness",
      "Penggunaan: Olahraga dan aktivitas harian",
      "Kapasitas: Perlu disesuaikan dengan produk asli",
    ],
  },
  {
    id: 7,
    name: "Electric Kettle",
    category: "Home Appliances",
    price: 189000,
    icon: "🫖",
    tag: "",
    background: "bg-stone-100",
    description:
      "Ketel listrik untuk membantu menyiapkan air panas di rumah.",
    specifications: [
      "Kategori: Peralatan rumah tangga",
      "Penggunaan: Memanaskan air",
      "Daya dan kapasitas: Perlu disesuaikan dengan produk asli",
    ],
  },
  {
    id: 8,
    name: "Everyday Cap",
    category: "Fashion & Accessories",
    price: 79000,
    icon: "🧢",
    tag: "",
    background: "bg-violet-50",
    description:
      "Topi untuk melengkapi penampilan saat beraktivitas di luar ruangan.",
    specifications: [
      "Kategori: Aksesori",
      "Penggunaan: Aktivitas harian dan luar ruang",
      "Ukuran: Sesuaikan dengan stok toko",
    ],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}


export function normalizeDatabaseProduct(
  item: DatabaseProduct
): Product {
  const fallbackStyles: Record<
    string,
    { icon: string; background: string }
  > = {
    "Shoes & Footwear": {
      icon: "👟",
      background: "bg-sky-50",
    },
    "Fashion & Accessories": {
      icon: "👕",
      background: "bg-orange-50",
    },
    "Fitness & Gym": {
      icon: "🏋️",
      background: "bg-slate-100",
    },
    "Sports & Outdoors": {
      icon: "🎒",
      background: "bg-amber-50",
    },
    "Home Appliances": {
      icon: "⌂",
      background: "bg-stone-100",
    },
  };

  const style = fallbackStyles[item.category] ?? {
    icon: "✦",
    background: "bg-gray-100",
  };

  let specifications: string[] = [];

  try {
    specifications =
      typeof item.specifications === "string"
        ? JSON.parse(item.specifications)
        : item.specifications;
  } catch {
    specifications = [];
  }

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    icon: style.icon,
    tag: item.tag ?? "",
    background: style.background,
    description: item.description ?? "",
    specifications: Array.isArray(specifications)
      ? specifications.filter(
          (value): value is string => typeof value === "string"
        )
      : [],
  };
}
