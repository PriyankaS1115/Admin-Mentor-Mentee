# Mentee-Mentor-Admin Platform

A comprehensive web-based collaboration platform built with Node.js/Express backend and responsive Bootstrap frontend, integrated with Azure Cosmos DB for persistent data storage.

## 🌟 Features

### Mentee Features
- Submit detailed queries with categorization and complexity levels
- Track query status in real-time
- View assigned mentors and meeting schedules
- Receive resolutions from mentors
- Professional query submission form

### Mentor Features
- View all open queries available for mentoring
- Accept queries and share preferred meeting slots
- Provide detailed resolutions
- Track assigned queries and completion status
- Live dashboard with query statistics

### Admin Features
- Comprehensive dashboard with analytics
- Monitor all queries by status and complexity
- Edit and update query fields
- Close queries with comments
- Track action logs of all activities
- View mentor-mentee connections
- Real-time charts and statistics

## 🏗️ Project Structure

```
mentee-mentor-admin/
├── server.js                 # Express server with API endpoints
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── public/
│   ├── index.html            # Role selection and login page
│   ├── mentee.html           # Mentee dashboard
│   ├── mentor.html           # Mentor dashboard
│   ├── admin.html            # Admin dashboard
│   ├── css/
│   │   └── style.css         # Professional styling
│   └── js/
│       ├── mentee.js         # Mentee functionality
│       ├── mentor.js         # Mentor functionality
│       └── admin.js          # Admin functionality with charts
└── README.md                 # This file
```

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Azure Cosmos DB account
- VS Code with recommended extensions

## 📋 Required VS Code Extensions

1. **REST Client** (humao.rest-client)
   - For testing API endpoints

2. **Thunder Client** (rangav.vscode-thunder-client)
   - Alternative API testing tool

3. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
   - JavaScript code snippets

4. **Prettier** (esbenp.prettier-vscode)
   - Code formatter

5. **Live Server** (ritwickdey.liveserver)
   - Local development server

6. **Postman** (postman.postman-for-vscode)
   - API testing and documentation

Install extensions from VS Code Extensions Marketplace or use the command palette:
```bash
code --install-extension humao.rest-client
code --install-extension rangav.vscode-thunder-client
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.liveserver
```

## 🚀 Setup Instructions

### 1. Clone/Download the Project
```bash
cd path/to/Mentee-Mentor-Admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Azure Cosmos DB

#### Create Cosmos DB Account:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Cosmos DB account with NoSQL API
3. Create a database named `MentorAdmin`
4. Note your endpoint URL and primary key

#### Create `.env` file in project root:
```bash
cp .env.example .env
```

Then edit `.env` with your Cosmos DB credentials:
```
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
DATABASE_NAME=MentorAdmin
QUERIES_CONTAINER=Queries
USERS_CONTAINER=Users
ACTION_LOGS_CONTAINER=ActionLogs
PORT=5000
NODE_ENV=development
```

### 4. Start the Development Server
```bash
# Using nodemon (auto-restart on file changes)
npm run dev

# Or standard start
npm start
```

The server will run on `http://localhost:5000`

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## 📊 Database Schema

### Queries Container
```json
{
  "id": "uuid",
  "menteeId": "employee-id",
  "employeeName": "John Doe",
  "employeeId": "EMP123",
  "questionTitle": "How to optimize database queries?",
  "category": "Technical",
  "complexity": "medium",
  "meetingType": "Virtual",
  "preferredSlot": "afternoon",
  "detailedQuery": "Detailed query content...",
  "status": "OPEN|ASSIGNED|RESOLVED|CLOSED",
  "createdDate": "2024-01-15T10:30:00Z",
  "updatedDate": "2024-01-15T10:30:00Z",
  "assignedMentor": {
    "mentorId": "MENTOR001",
    "mentorName": "Jane Smith",
    "preferredSlots": ["morning", "afternoon"],
    "assignedDate": "2024-01-15T11:00:00Z"
  },
  "resolution": {
    "mentorId": "MENTOR001",
    "content": "Resolution details...",
    "providedDate": "2024-01-16T14:30:00Z"
  },
  "adminComments": "Admin notes...",
  "closedDate": "2024-01-17T09:00:00Z"
}
```

### Users Container
```json
{
  "id": "uuid",
  "userId": "user-id",
  "role": "MENTEE|MENTOR|ADMIN",
  "name": "User Name",
  "email": "user@example.com",
  "createdDate": "2024-01-15T10:30:00Z"
}
```

### ActionLogs Container
```json
{
  "id": "uuid",
  "adminId": "admin-id",
  "actionType": "QUERY_SUBMITTED|MENTOR_ASSIGNED|RESOLUTION_PROVIDED|QUERY_CLOSED|QUERY_UPDATED",
  "queryId": "query-id",
  "details": "Action details...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📡 API Endpoints

### Mentee APIs
- `POST /api/queries/submit` - Submit a new query
- `GET /api/queries/mentee/:employeeId` - Get mentee's queries

### Mentor APIs
- `GET /api/queries/open` - Get all open queries
- `PUT /api/queries/:queryId/assign-mentor` - Accept a query
- `PUT /api/queries/:queryId/resolution` - Submit resolution

### Admin APIs
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/queries/all` - Get all queries
- `PUT /api/queries/:queryId/update` - Update query fields
- `PUT /api/queries/:queryId/close` - Close a query
- `GET /api/admin/action-logs` - Get action logs
- `GET /api/health` - Health check

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Professional Color Scheme**: Role-based color coding
  - Mentee: Blue (#0d6efd)
  - Mentor: Pink/Red gradient (#f093fb to #f5576c)
  - Admin: Cyan gradient (#4facfe to #00f2fe)
- **Interactive Charts**: Chart.js integration for analytics
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Status Badges**: Visual indicators for query status
- **Complexity Indicators**: Color-coded complexity levels
- **Action Modals**: Beautiful modal dialogs for forms

## 🔐 Security Considerations

Before deploying to production:

1. **Add Authentication**: Implement JWT or OAuth
2. **Enable HTTPS**: Use SSL certificates
3. **Environment Variables**: Keep sensitive data in .env
4. **Validation**: Add input validation on backend
5. **CORS**: Configure CORS properly for your domain
6. **Rate Limiting**: Implement rate limiting
7. **Cosmos DB Security**: 
   - Use connection string with firewall rules
   - Enable encryption at rest
   - Use managed identities for Azure services

## 📈 Performance Optimization

### Database Optimization
- Proper partition key selection (`/menteeId` for Queries)
- Indexed queries for faster searches
- Cosmos DB TTL for automatic log cleanup

### Frontend Optimization
- Minify CSS and JavaScript
- Lazy loading for images
- Compress static assets
- Browser caching headers

## 🧪 Testing

### Test Mentee Submission:
1. Go to http://localhost:5000
2. Select "Mentee"
3. Enter name and employee ID
4. Fill the query form and submit

### Test Mentor Workflow:
1. Select "Mentor" role
2. View open queries
3. Accept a query and provide resolution

### Test Admin Dashboard:
1. Select "Admin" role
2. View statistics and charts
3. Edit queries and close them

## 📝 Cosmos DB Queries Reference

```sql
-- Get all open queries
SELECT * FROM c WHERE c.status = 'OPEN'

-- Get queries by complexity
SELECT * FROM c WHERE c.complexity = 'high'

-- Get mentor's assigned queries
SELECT * FROM c WHERE c.assignedMentor.mentorId = 'MENTOR001'

-- Count queries by status
SELECT c.status, COUNT(1) as count FROM c GROUP BY c.status

-- Get queries created in last 7 days
SELECT * FROM c WHERE DateTimeDiff("day", c.createdDate, GetCurrentTimestamp()) < 7
```

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify Node.js is installed: `node --version`
- Check .env file configuration

### Can't connect to Cosmos DB
- Verify endpoint and key in .env
- Check firewall rules in Cosmos DB account
- Ensure database and containers exist

### Frontend not loading
- Check browser console for errors (F12)
- Verify server is running
- Clear browser cache (Ctrl+Shift+Delete)

### API endpoints returning errors
- Check network tab in browser DevTools
- Verify CORS is enabled in server.js
- Review server console for errors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Azure Cosmos DB SDK for JavaScript](https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-samples)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Chart.js Documentation](https://www.chartjs.org/)

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💼 Support

For issues or questions:
1. Check troubleshooting section
2. Review error messages in console
3. Check Azure Cosmos DB documentation
4. Verify API endpoints with Postman

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Built with**: Node.js, Express, Bootstrap, Chart.js, Azure Cosmos DB
