import { scrollIntoViewIfNeeded } from "~/utils";

export const ID_PREFIX = "move-";

export const scrollIntoView = (moveNumber: number) => {
  const id = `${ID_PREFIX}${moveNumber ? moveNumber - 1 : 0}`;
  const el = document.getElementById(id);
  scrollIntoViewIfNeeded(el);
};
