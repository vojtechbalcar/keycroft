import fs from 'node:fs'
import path from 'node:path'

import type { NextConfig } from 'next'

function resolveTurbopackRoot(startDir: string): string {
  let currentDir = startDir

  while (true) {
    if (fs.existsSync(path.join(currentDir, 'node_modules/next/package.json'))) {
      return currentDir
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      return startDir
    }

    currentDir = parentDir
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: resolveTurbopackRoot(process.cwd()),
  },
}

export default nextConfig
