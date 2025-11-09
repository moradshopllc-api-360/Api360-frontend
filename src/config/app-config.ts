import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Api 360",
  version: packageJson.version,
  copyright: `© ${currentYear} Api360®`,
  meta: {
    title: "Api 360.",
    description:
      "Api 360.",
  },
};
