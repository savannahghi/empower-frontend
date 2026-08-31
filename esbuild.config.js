const esbuild = require('esbuild');
const copy = require('esbuild-plugin-copy');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  plugins: [
    copy({
      // Specifying source and destination directory for copying files
      assets: {
        from: ['./apps/advantage/src/index.html'],
        to: ['./dist/index.html'],
      },
    }),
  ],
  minify: true,
  sourcemap: true,
}).catch(() => process.exit(1));