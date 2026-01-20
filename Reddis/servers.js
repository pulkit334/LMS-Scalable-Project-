const express = require('express')
const app = express()
const axios = require('axios').default
const client = require('./client')

app.get('/', async (req, res) => {
  try {
    const cachedPosts = await client.get('posts')

    if (cachedPosts) {
      console.log('Cache hit')
      return res.json(JSON.parse(cachedPosts))
    }

    console.log('Cache miss')

    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    //  SIMPLE redis v3 way (like the video)
    await client.setex('posts', 30, JSON.stringify(data))

    res.json(data)
  } catch (err) {
    res.status(500).json({
      message: 'Request failed',
      error: err.message
    })
  }
})

app.listen(9000, () => {
  console.log('Server running on port 9000')
})
