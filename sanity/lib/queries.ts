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

