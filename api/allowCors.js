const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', 'https://hikenrides.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS') // Add other methods as needed
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type') // Add other headers as needed
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}


const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)
