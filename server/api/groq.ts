import Groq from 'groq-sdk'
import { defineEventHandler, readBody } from 'h3'

const groq = new Groq({
  apiKey: process.env.h
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const prompt = body.prompt

  if (!prompt) return { error: 'No prompt provided' }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama3-70b-8192'
    })

    return {
      response: chatCompletion.choices[0]?.message?.content || 'No response'
    }
  } catch (error) {
    console.error('Groq error:', error)
    return { error: 'Groq API request failed' }
  }
})