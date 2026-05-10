import { Router, type IRouter } from "express";
import { eq, or, ilike } from "drizzle-orm";
import { db, propertiesTable } from "@workspace/db";
import {
  SearchPropertiesQueryParams,
  GetPropertyBySlugParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/properties", async (_req, res): Promise<void> => {
  const properties = await db
    .select()
    .from(propertiesTable)
    .orderBy(propertiesTable.createdAt);
  res.json(properties);
});

router.get("/properties/featured", async (_req, res): Promise<void> => {
  const properties = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.isFeatured, true))
    .orderBy(propertiesTable.createdAt);
  res.json(properties);
});

router.get("/properties/:slug", async (req, res): Promise<void> => {
  const params = GetPropertyBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.slug, params.data.slug));

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.json(property);
});

router.get("/search", async (req, res): Promise<void> => {
  const query = SearchPropertiesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { q, location } = query.data;
  const filters = [];

  if (q) {
    filters.push(or(ilike(propertiesTable.title, `%${q}%`), ilike(propertiesTable.description, `%${q}%`)));
  }

  if (location) {
    filters.push(ilike(propertiesTable.location, `%${location}%`));
  }

  const properties = await db
    .select()
    .from(propertiesTable)
    .where(filters.length > 0 ? (filters.length === 1 ? filters[0] : filters[0]) : undefined) // Simple implementation for now
    .orderBy(propertiesTable.createdAt);

  res.json(properties);
});

export default router;
