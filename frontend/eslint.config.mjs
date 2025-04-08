import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            import: eslintPluginImport,
        },
        rules: {
            "import/order": ["error", {
                groups: [["builtin", "external", "internal"]], "newlines-between": "always",
            },],
            "@typescript-eslint/no-empty-interface": ["warn", {
                allowSingleExtends: true,
            },],
        },
    },];

export default eslintConfig;
