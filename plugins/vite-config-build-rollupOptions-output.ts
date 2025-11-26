export const rollupOutput = {
  assetFileNames: () => {
    return "assets/dist/[hash:7][extname]";
  },
  // JS entry files
  // https://cn.rollupjs.org/configuration-options/#output-chunkfilenames
  entryFileNames: "assets/dist/[hash:7].js",
  // Dynamic chunks
  // https://cn.rollupjs.org/configuration-options/#output-chunkfilenames
  chunkFileNames: "assets/dist/[hash:7].js",
};

export default rollupOutput;
