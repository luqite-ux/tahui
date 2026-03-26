import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");

const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

function countMissing(list, field) {
  return list.filter((x) => !String(x?.[field] ?? "").trim()).length;
}

async function main() {
  const products = await client.fetch(
    `*[_type=="product"]{_id,name,nameZh,nameFr,description,descriptionZh,descriptionFr}`
  );
  const categories = await client.fetch(
    `*[_type=="productCategory"]{_id,id,title,titleZh,titleFr}`
  );

  const summary = {
    products: {
      total: products.length,
      missingNameZh: countMissing(products, "nameZh"),
      missingNameFr: countMissing(products, "nameFr"),
      missingDescZh: countMissing(products, "descriptionZh"),
      missingDescFr: countMissing(products, "descriptionFr"),
    },
    categories: {
      total: categories.length,
      missingTitleZh: countMissing(categories, "titleZh"),
      missingTitleFr: countMissing(categories, "titleFr"),
    },
  };

  console.log(JSON.stringify(summary, null, 2));

  const sampleMissingZh = products
    .filter((p) => !String(p?.nameZh ?? "").trim())
    .slice(0, 20)
    .map((p) => ({ _id: p._id, name: p.name }));
  if (sampleMissingZh.length) {
    console.log("\nSample products missing nameZh:");
    for (const p of sampleMissingZh) console.log(`- ${p._id} ${p.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

