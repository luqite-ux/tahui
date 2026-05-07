export const PRODUCT_CATEGORIES_QUERY = `*[_type == "productCategory"] | order(order asc, number asc, title asc) {
  _id,
  id,
  number,
  order,
  title,
  titleZh,
  titleFr,
  description,
  image{..., alt}
}`

export const BLOG_POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())] | order(publishedAt desc) {
  _id,
  title,
  titleZh,
  titleFr,
  "slug": slug.current,
  excerpt,
  excerptZh,
  excerptFr,
  publishedAt,
  coverImage{..., alt}
}`

