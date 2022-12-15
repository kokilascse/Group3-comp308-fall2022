/**
 * Files that contain schema definitions
 * @type {import("graphql-config").SchemaPointer}
 */
const schema = ["server/graphql/!(*.gen).graphql"];

/**
 * Files that contain operations (i.e., queries and mutations)
 * @type {import("graphql-config").DocumentPointer}
 */
const documents = ["client/src/**/*.js"];

/**
 * Settings for `graphql-codegen`
 * @type {import("@graphql-codegen/plugin-helpers").Types.Config}
 */
const codegen = {
  // Shared settings
  config: {
    // Since we are generating `*.d.ts` files, this is needed
    enumsAsTypes: true,
    // Mapping for custom scalar types
    scalars: {
      DateTime: "Date",
    },
  },

  // File generation settings
  generates: {
    // Combined schema file to be read in by the server code
    "server/graphql/schema.gen.graphql": {
      plugins: ["schema-ast", addHeader("#")],
      config: {
        includeDirectives: true,
      },
    },

    // Resolver types for server-side request handling
    "server/graphql/resolvers.gen.d.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers",
        addText(
          "append",
          "export type RootValue =",
          "  & ResolverToRootValues<QueryResolvers>",
          "  & ResolverToRootValues<MutationResolvers>;"
        ),
        addHeader("//"),
      ],
      config: {
        contextType: "express#Request",
        // Put your database document types here
        mappers: {
          User: "../models/user.model#UserDoc",
          Message: "../models/message.model#MessageDoc",
          Alert: "../models/alert.model#AlertDoc",
        },
      },
    },

    // Client-side operation types
    "client/src/graphql.gen.d.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typed-document-node",
        addHeader("//"),
      ],
    },
  },
};

/**
 * Settings for both `graphql-codegen` and VSCode GraphQL extension
 * @type {import("graphql-config").IGraphQLConfig}
 */
module.exports = {
  schema,
  documents,
  extensions: {
    codegen,
  },
};

//
// ------------------------------ Utilities ------------------------------------
//

/** @typedef {import("@graphql-codegen/add/config").AddPluginConfig} AddConfig */

/**
 * Tell `graphql-codegen` to add raw text
 *
 * @param {NonNullable<AddConfig["placement"]>} placement where to add
 * @param {string} content what to add
 * @param {string[]} more any additional lines of content
 * @returns {{add: AddConfig}} plugin config
 */
function addText(placement, content, ...more) {
  return { add: { placement, content: [content, ...more] } };
}

/**
 * Tell `graphql-codegen` to add a header to the generated file that reminds
 * people not to directly modify it
 *
 * @param {string} prefix starting sequence of a line comment
 * @returns {{add: AddConfig}} plugin config
 */
function addHeader(prefix) {
  const content = [
    "",
    "Automatically generated by graphql-codegen",
    "",
    "Please do NOT modify this file directly unless you are just testing things out.",
    "The changes will be overwritten the next time the generator runs.",
    "",
  ]
    .map((line) => `${prefix} ${line}`.trim())
    .concat("") // a blank line at the end
    .join("\n");
  return { add: { placement: "prepend", content } };
}