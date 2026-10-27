
import { env } from "cloudflare:workers";

export async function GET() {
  try {
    const result = await env.DB
      .prepare(`
        SELECT
          id,
          sku,
          name,
          slug,
          category,
          price,
          stock,
          description,
          specifications,
          image_url,
          weight_grams,
          package_length_cm,
          package_width_cm,
          package_height_cm,
          tag,
          is_active
        FROM products
        WHERE is_active = 1
        ORDER BY id DESC
      `)
      .all();

    return Response.json({ products: result.results });
  } catch (error) {
    console.error("Gagal membaca produk dari D1:", error);

    return Response.json(
      { error: "Produk gagal dimuat." },
      { status: 500 }
    );
  }
}
