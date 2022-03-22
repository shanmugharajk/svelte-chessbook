import { defineConfig } from "windicss/helpers";

export default defineConfig({
  theme: {
    extend: {
      textColor: {
        hover: "#48b0f1",
        link: "#66b2ff",
        primary: "#007FFF",
      },

      borderColor: (theme) => ({
        ...theme("colors"),
        "light-blue": "#87ceeb26",
      }),
      screens: {
        medium: "1000px",
      },
    },
  },
});
