# Trade Me Clone Backend

A robust Node.js backend service for an online auction platform, providing API endpoints for auction item management and search functionality.

## Features

- **RESTful API Endpoints**
  - Item retrieval and search
  - Category filtering
  - Location-based filtering
  - Auction management

- **Data Management**
  - MongoDB integration
  - JSON data support
  - Efficient data querying
  - Data validation

- **Search Functionality**
  - Full-text search
  - Category-based filtering
  - Location filtering
  - Multiple search criteria support

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
/
├── index.js           # Application entry point
├── mongoCli.js        # MongoDB connection configuration
├── models/            # Database models
├── auctionData.json   # Sample auction data
└── package.json       # Project dependencies
```

## Getting Started

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB (v4.4 or higher)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/Piro2maniC/ADV-Mission05-backend.git

   # Navigate to project directory
   cd ADV-Mission05-backend

   # Install dependencies
   npm install
   ```

3. **Configuration**
   - Set up MongoDB connection
   - Configure environment variables
   - Initialize sample data

4. **Development**
   ```bash
   # Start development server
   npm run dev
   ```
   The server will start on `http://localhost:5001`

## API Documentation

### Endpoints

#### GET /find
Retrieves auction items based on search criteria.
- Query Parameters:
  - `search`: Search term for item title/description
  - `category`: Filter by category
  - `location`: Filter by location
- Response: Array of auction items

#### GET /categories
Retrieves available categories.
- Response: Array of category names

#### GET /locations
Retrieves available locations.
- Response: Array of location names

### Data Models

#### Auction Item
```javascript
{
  _id: String,
  title: String,
  description: String,
  category: String,
  location: String,
  closing_date: Date,
  closing_time: String,
  reserve_price: Number,
  current_bid: Number,
  buy_now_price: Number,
  image_url: String
}
```

## Database

The application uses MongoDB for data storage, with Mongoose as the ODM.

### Collections
- `items`: Auction items
- `categories`: Available categories
- `locations`: Available locations

### Indexes
- Text index on item titles and descriptions
- Compound index on category and location

## Error Handling

The API implements comprehensive error handling:
- Invalid requests
- Database errors
- Authentication errors
- Validation errors

## Security

- Input validation
- Error sanitization
- Rate limiting
- CORS configuration

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

1. **Environment Setup**
   - Configure production environment variables
   - Set up MongoDB production instance
   - Configure CORS settings

2. **Build**
   ```bash
   npm run build
   ```

3. **Run**
   ```bash
   npm start
   ```

## Performance Optimization

- Database query optimization
- Response caching
- Connection pooling
- Load balancing support

## Monitoring

- Request logging
- Error tracking
- Performance metrics
- Health checks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
