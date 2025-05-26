import stylisticPlugin from "@stylistic/eslint-plugin";
import importXPlugin from "eslint-plugin-import-x";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import type { InfiniteDepthConfigWithExtends } from "typescript-eslint";
import type { TSESLint } from "@typescript-eslint/utils";

interface CreateConfigOptions {
    rootDir: string;
    configs?: InfiniteDepthConfigWithExtends[];
    overrides?: TSESLint.FlatConfig.Rules;
}

export const createConfig = (options: CreateConfigOptions) => tsEslint.config(
    eslint.configs.recommended,
    tsEslint.configs.strictTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
    {
        name: "giqnt/ts-parser-options",
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: options.rootDir,
            },
        },
    },
    stylisticPlugin.configs["disable-legacy"],
    stylisticPlugin.configs.customize({
        indent: 4,
        quotes: "double",
        semi: true,
        arrowParens: true,
        blockSpacing: true,
        braceStyle: "1tbs",
        commaDangle: "always-multiline",
        quoteProps: "consistent-as-needed",
    }),
    {
        name: "giqnt/overrides/stylistic",
        rules: {
            "@stylistic/indent": ["error", 4, {
                ArrayExpression: 1,
                CallExpression: { arguments: 1 },
                flatTernaryExpressions: true,
                FunctionDeclaration: { body: 1, parameters: 1 },
                FunctionExpression: { body: 1, parameters: 1 },
                ignoreComments: false,
                ignoredNodes: [
                    "TSUnionType",
                    "TSIntersectionType",
                    "TSTypeParameterInstantiation",
                    "FunctionExpression > .params[decorators.length > 0]",
                    "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                ],
                ImportDeclaration: 1,
                MemberExpression: 1,
                ObjectExpression: 1,
                offsetTernaryExpressions: false,
                outerIIFEBody: 1,
                SwitchCase: 1,
                tabLength: 4,
                VariableDeclarator: 1,
            }],
            "@stylistic/multiline-ternary": "off",
        },
    },
    importXPlugin.flatConfigs.recommended,
    importXPlugin.flatConfigs.typescript,
    {
        name: "giqnt/overrides/import-x",
        rules: {
            "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
            "import-x/first": "warn",
            "import-x/newline-after-import": "warn",
            "import-x/no-empty-named-blocks": "error",
            "import-x/no-named-as-default-member": "off",
            "import-x/no-self-import": "error",
            "import-x/order": ["warn", { "newlines-between": "never" }],
        },
    },
    {
        name: "giqnt/plugin/unused-imports",
        plugins: {
            "unused-imports": unusedImportsPlugin,
        },
        rules: {
            "unused-imports/no-unused-imports": "warn",
        },
    },
    {
        name: "giqnt/overrides",
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            "@typescript-eslint/strict-boolean-expressions": ["error", { allowNullableBoolean: true }],
            "eqeqeq": ["error", "smart"],
            "func-style": ["error", "expression"],
            "prefer-arrow-callback": ["error", { allowUnboundThis: false }],
            "prefer-template": "error",
        },
    },
    ...(options.configs ?? []),
    {
        name: "giqnt/custom",
        rules: options.overrides ?? {},
    },
);
