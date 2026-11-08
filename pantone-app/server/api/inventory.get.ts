import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async () => {
  const filePath = path.resolve(process.cwd(), 'public/pantone-inventory.json')
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading pantone-inventory.json:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not read inventory data',
      cause: err,
    })
  }
})
