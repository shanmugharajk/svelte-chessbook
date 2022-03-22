export const onBoardResize = (el: HTMLElement, elContainer: HTMLElement) => {
  if (!el || !elContainer) {
    return;
  }

  let { height, width } = elContainer?.getBoundingClientRect();
  let dim = height > width ? width : height;
  dim -= dim % 8;

  el.style.width = `${dim}px`;
  el.style.height = `${dim}px`;
};
