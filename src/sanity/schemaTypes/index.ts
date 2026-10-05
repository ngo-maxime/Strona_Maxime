import type { SchemaTypeDefinition } from "sanity";
import { eventType } from "./event";
import { galleryType } from "./gallery";
import { milestoneType } from "./milestone";
import { newsType } from "./news";
import { siteSettingsType } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, newsType, galleryType, siteSettingsType, milestoneType],
};
