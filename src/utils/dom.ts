import scrollIntoView from "scroll-into-view-if-needed";

export const scrollIntoViewIfNeeded = (node: Element) => {
  if (node) {
    scrollIntoView(node, {
      scrollMode: "if-needed",
    });
  }
};
