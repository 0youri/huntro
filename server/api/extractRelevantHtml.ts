import { defineEventHandler, getQuery, createError } from 'h3'
import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL'
    })
  }

  try {
    new URL(url)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL format'
    })
  }

  try {
    const apiKey = process.env.SCRAPERAPI_KEY
    const proxyUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`

    const res = await fetch(proxyUrl)
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.statusText}`)
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const title = $('title').text()
    const h1 = $('h1').first().text()
    const h2 = $('h2').first().text()

    const metaTitle = $('meta[property="og:title"]').attr('content') || ''
    const metaCompany = $('[content*="company"], [name*="company"]').attr('content') || ''
    const metaLocation = $('[content*="location"], [name*="location"]').attr('content') || ''

    const possibleCompany = $('body').text().match(/(?<=Company:|Entreprise:)\s*([^\n]+)/i)?.[1] || ''
    const possibleLocation = $('body').text().match(/(?<=Location:|Lieu:)\s*([^\n]+)/i)?.[1] || ''

    const trimmed = `
      Title tag: ${title}
      H1: ${h1}
      H2: ${h2}
      Meta og:title: ${metaTitle}
      Meta company: ${metaCompany}
      Meta location: ${metaLocation}
      Detected company in body: ${possibleCompany}
      Detected location in body: ${possibleLocation}
    `

    return { extracted: trimmed }
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error parsing or fetching URL',
      data: err
    })
  }
})