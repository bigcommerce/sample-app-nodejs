/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: { ssr: true },
  },
  // Manual-test branch only: mysql2@3.23.4 (pulled in fresh by this branch's
  // reinstall) trips eslint-plugin-import's import/default rule, unrelated
  // to the React 19 / big-design bump this branch exists to test.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
