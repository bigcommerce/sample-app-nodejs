/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Lint still runs via `npm run lint`; this just stops `next build`
        // from failing on lint errors (e.g. workspace-hoisting false
        // positives from eslint-plugin-import when this app is consumed as
        // an npm workspace, as in appex-app).
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
