import { createClient } from "@sanity/client";

function normalizeId(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[%]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqify(desired, used) {
  if (!used.has(desired)) return desired;
  let i = 2;
  while (used.has(`${desired}-${i}`)) i += 1;
  return `${desired}-${i}`;
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });

  const categories = await client.fetch(
    `*[_type=="productCategory"]|order(order asc, number asc, title asc){_id,id,title}`
  );

  const used = new Set(
    categories
      .map((c) => normalizeId(c?.id))
      .filter(Boolean)
  );

  const plan = [];
  for (const c of categories) {
    const current = String(c?.id ?? "");
    const normalized = normalizeId(current);
    if (!current || !normalized) continue;
    if (normalized === current) continue;

    // ensure uniqueness without breaking existing normalized IDs
    used.delete(normalizeId(current));
    const unique = uniqify(normalized, used);
    used.add(unique);

    plan.push({ _id: c._id, from: current, to: unique, title: c?.title });
  }

  if (plan.length === 0) {
    console.log("No category ids need normalization.");
    return;
  }

  console.log(`Will update ${plan.length} categories:`);
  for (const p of plan) console.log(`- ${p.from} -> ${p.to} (${p._id})`);

  for (const p of plan) {
    await client.patch(p._id).set({ id: p.to }).commit();
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

