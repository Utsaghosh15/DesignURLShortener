
# DesignURLShortener

A comprehensive URL shortening service built with Node.js, Express, and MongoDB.

## 🗄️ Database Schema

The URL documents are stored in MongoDB with the following schema:

```javascript
{
  shortCode: String,        // 6-character unique identifier (indexed)
  longUrl: String,          // Original long URL
  expiryDate: Date,         // Expiration date (1 year from creation)
  createdAt: Date,          // Creation timestamp
  clickCount: Number,       // Number of times the URL was accessed
  isActive: Boolean         // Whether the URL is active
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/urlshortener` |
| `PORT` | Server port | `3000` |

### URL Generation

- **Character Set**: `a-z`, `A-Z`, `0-9` (62 characters)
- **Length**: 6 characters
- **Total Combinations**: 56.8 billion
- **Collision Probability**: ~0.9% at 1M active URLs

## 🧪 Testing

### Using cURL

**Create a short URL:**
```bash
curl -X POST http://localhost:3000/api/createURL \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

**Access the short URL:**
```bash
curl http://localhost:3000/abc123
```

**Health check:**
```bash
curl http://localhost:3000/health
```

### Using Postman

1. Import the API endpoints
2. Set the base URL to `http://localhost:3000`
3. Test the create and redirect endpoints

## 📊 Performance

- **Collision Rate**: Extremely low due to 6-character codes and 1-year expiration
- **Database Queries**: Optimized with proper indexing
- **Response Time**: Sub-100ms for most operations
- **Scalability**: Can handle millions of URLs with proper infrastructure

## 🚨 Error Handling

The service includes comprehensive error handling:

- **Input Validation**: URL format validation
- **Database Errors**: Connection and query error handling
- **Collision Detection**: Automatic retry for duplicate short codes
- **Expiration Handling**: Automatic cleanup of expired URLs
- **HTTP Status Codes**: Proper REST API status codes


#### Test Configuration

The load test includes:
- **30% URL Creation** - Tests `/api/createURL` endpoint
- **70% URL Redirection** - Tests `/api/getURL/:shortCode` endpoint
- **Performance Validation** - Checks response times and status codes
- **Error Rate Monitoring** - Tracks failed requests

#### Expected Results

**Optimal Performance (1000 VUs):**
- Throughput: ~732 requests/second
- Response Time: ~235ms average
- Success Rate: 100%
- P95 Response Time: <820ms

**Test Scenarios:**
- **Light Load**: 10-50 VUs (development testing)
- **Medium Load**: 100-500 VUs (staging testing)
- **Heavy Load**: 1000+ VUs (production capacity testing)

#### Test Files

- `load-tests/k6-urlshortener.js` - Main K6 test script
- `load-tests/env.json` - Test configuration and URLs

### Docker Testing

**Run tests against containerized app:**
```bash
# Start the application
docker-compose up -d

# Run load tests
k6 run load-tests/k6-urlshortener.js

# Stop the application
docker-compose down
```

### Performance Benchmarks

| Test Scenario | VUs | Duration | RPS | Avg Response Time | Success Rate |
|---------------|-----|----------|-----|-------------------|--------------|
| Light Load    | 10  | 30s      | ~10 | ~50ms            | 100%         |
| Medium Load   | 100 | 30s      | ~100| ~100ms           | 100%         |
| Heavy Load    | 1000| 30s      | ~732| ~235ms           | 100%         |
| Stress Test   | 3000| 30s      | ~656| ~3.03s           | 100%         |

## 🔒 Security Features

- **URL Validation**: Prevents malicious URL injection
- **Input Sanitization**: Proper data validation and sanitization
- **Error Information**: Limited error details in production
- **Rate Limiting**: Can be easily added for production use

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍�� Author

**Utsha** - [GitHub Profile](https://github.com/Utsaghosh15)

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Mongoose for the ODM
- The Node.js community for excellent documentation

---

**Happy URL Shortening! ��**