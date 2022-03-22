export const capitalize = (val: string) => {
  const [first, ...rest] = val;
  return first?.toUpperCase() + rest?.join("");
};

export const slugifySpace = (val: string) => val.replaceAll(" ", "-");

export const removeSlug = (val: string, readable: boolean = true) => {
  const res = val.replaceAll("-", " ");
  return readable ? capitalize(res) : res;
};
