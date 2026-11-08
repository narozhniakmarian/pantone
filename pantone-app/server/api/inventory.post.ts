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

  try {
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8')
    return { success: true, count: body.length }
  } catch (err) {
    console.error('Error writing pantone-inventory.json:', err)
    return { success: true, count: body.length }
  }
})
