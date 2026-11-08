import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = path.resolve(process.cwd(), 'public/pantone-inventory.json')

  if (!Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Inventory data must be an array',
    })
  }

  if (body.some((item) => item === null || typeof item !== 'object' || Array.isArray(item))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Each inventory item must be an object',
    })
  }

  try {
    const tempPath = `${filePath}.tmp`
    await fs.writeFile(tempPath, `${JSON.stringify(body, null, 2)}\n`, 'utf-8')
    await fs.rename(tempPath, filePath)
    return { success: true, count: body.length }
  } catch (err) {
    console.error('Error writing pantone-inventory.json:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not save inventory data',
      cause: err,
    })
  }
})
