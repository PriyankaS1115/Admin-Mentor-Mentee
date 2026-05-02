# Step-by-Step Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Node Dependencies
```bash
npm install
```

### Step 2: Configure Azure Cosmos DB
1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` with your Cosmos DB credentials:
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

### Step 3: Start the Server
```bash
npm run dev
```

### Step 4: Open in Browser
```
http://localhost:5000
```

---

## Detailed Setup Guide

### Creating Azure Cosmos DB Account

#### Option 1: Using Azure Portal (Web Interface)

1. Go to https://portal.azure.com
2. Click "Create a resource"
3. Search for "Azure Cosmos DB"
4. Click "Create"
5. Select "Azure Cosmos DB for NoSQL"
6. Fill in the details:
   - **Resource Group**: Create new or select existing
   - **Account Name**: e.g., `mentee-mentor-admin-db`
   - **Location**: Select closest region
   - **Capacity Mode**: Start with Provisioned
7. Click "Review + Create" → "Create"
8. Wait for deployment (5-10 minutes)

#### Option 2: Using Azure CLI

```bash
# Install Azure CLI first
az cosmosdb create \
  --name mentee-mentor-admin-db \
  --resource-group myResourceGroup \
  --locations regionName=eastus failoverPriority=0
```

### Getting Cosmos DB Credentials

After creating your Cosmos DB account:

1. Go to your Cosmos DB account in Azure Portal
2. Click "Keys" in the left sidebar
3. Copy:
   - **URI**: This is your COSMOS_ENDPOINT
   - **Primary Key**: This is your COSMOS_KEY

Example:
```
COSMOS_ENDPOINT=https://mentee-mentor-admin-db.documents.azure.com:443/
COSMOS_KEY=abcd1234efgh5678ijkl9012mnop3456qrst7890...
```

### Verifying Cosmos DB Connection

After starting the server, check the console output:
```
✓ Database initialized: MentorAdmin
✓ Container created: Queries
✓ Container created: Users
✓ Container created: ActionLogs
✓ Server running on http://localhost:5000
```

If you see errors:
- Check your .env file format
- Verify endpoint and key are correct
- Ensure your Azure account has access

---

## Installing Recommended VS Code Extensions

### Method 1: Through VS Code UI
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search for each extension name
4. Click "Install"

### Method 2: Through Command Line
```bash
# Install all recommended extensions
code --install-extension humao.rest-client
code --install-extension rangav.vscode-thunder-client
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.liveserver
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension postman.postman-for-vscode
```

### Extension Descriptions

| Extension | Purpose | ID |
|-----------|---------|-----|
| REST Client | Test API endpoints directly in VS Code | humao.rest-client |
| Thunder Client | Alternative API testing tool | rangav.vscode-thunder-client |
| Prettier | Code formatter | esbenp.prettier-vscode |
| Live Server | Local development server | ritwickdey.liveserver |
| ES7 Snippets | JavaScript code snippets | dsznajder.es7-react-js-snippets |
| Postman | API testing & docs | postman.postman-for-vscode |

---

## Project Folder Structure Explanation

```
Mentee-Mentor-Admin/
│
├── server.js                    # Main Express server file
│   ├── Cosmos DB initialization
│   ├── API endpoint definitions
│   ├── Query handlers
│   └── Action logging
│
├── package.json                 # Dependencies and scripts
│   ├── express: Web framework
│   ├── cors: Cross-origin requests
│   ├── @azure/cosmos: Database SDK
│   └── uuid: Unique ID generator
│
├── .env                         # Environment variables (CREATE THIS)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
│
├── public/                      # Frontend files (served by Express)
│   ├── index.html              # Login/role selection page
│   │
│   ├── mentee.html             # Mentee dashboard
│   │   └── Features:
│   │       ├── Submit queries
│   │       ├── Track status
│   │       └── View mentor assignments
│   │
│   ├── mentor.html             # Mentor dashboard
│   │   └── Features:
│   │       ├── View available queries
│   │       ├── Accept queries
│   │       ├── Provide resolutions
│   │       └── Track assignments
│   │
│   ├── admin.html              # Admin dashboard
│   │   └── Features:
│   │       ├── View all queries
│   │       ├── Edit query fields
│   │       ├── View analytics charts
│   │       ├── Close queries
│   │       └── Track action logs
│   │
│   ├── css/
│   │   └── style.css           # Professional styling
│   │       ├── Bootstrap 5 customization
│   │       ├── Color scheme
│   │       ├── Responsive design
│   │       └── Animation effects
│   │
│   └── js/
│       ├── mentee.js           # Mentee functionality
│       │   ├── Form submission
│       │   ├── Query management
│       │   └── Local storage handling
│       │
│       ├── mentor.js           # Mentor functionality
│       │   ├── Query acceptance
│       │   ├── Resolution submission
│       │   └── Statistics update
│       │
│       └── admin.js            # Admin functionality
│           ├── Dashboard stats
│           ├── Chart.js integration
│           ├── Query management
│           └── Action logs tracking
│
├── README.md                    # Project documentation
├── SETUP_GUIDE.md              # This file
└── .github/
    └── copilot-instructions.md # Copilot customization (auto-generated)
```

---

## Testing the Application

### Test Mentee Flow
1. Open http://localhost:5000
2. Click "Mentee"
3. Enter:
   - Name: `John Doe`
   - Employee ID: `EMP001`
4. Fill query form:
   - Question Title: `How to improve coding skills?`
   - Category: `Professional Development`
   - Complexity: `Medium`
   - Meeting Type: `Virtual`
   - Slot: `Afternoon`
   - Details: `I want to improve my programming skills...`
5. Click "Post Query"
6. Should see success message and query in list

### Test Mentor Flow
1. Open http://localhost:5000
2. Click "Mentor"
3. Enter Name: `Jane Smith`
4. See open queries
5. Click "Accept" on a query
6. Select your available slots
7. Click "Accept & Assign"
8. Query moves to "My Assigned Queries" tab
9. Click "Resolve"
10. Provide resolution and submit

### Test Admin Flow
1. Open http://localhost:5000
2. Click "Admin"
3. Enter Name: `Admin User`
4. View dashboard with:
   - Total query count
   - Status distribution
   - Complexity breakdown chart
   - All queries table
   - Action logs
5. Click "Edit" on a query
6. Modify fields and save
7. Or click "Close Query" button

---

## Database Test Queries

Use REST Client extension or Postman to test these endpoints:

### 1. Submit Query (Mentee)
```http
POST http://localhost:5000/api/queries/submit
Content-Type: application/json

{
  "employeeName": "John Doe",
  "employeeId": "EMP001",
  "questionTitle": "How to optimize queries?",
  "category": "Technical",
  "complexity": "high",
  "meetingType": "Virtual",
  "preferredSlot": "morning",
  "detailedQuery": "I need help optimizing database queries for my project..."
}
```

### 2. Get Mentee Queries
```http
GET http://localhost:5000/api/queries/mentee/EMP001
```

### 3. Get Open Queries (Mentor)
```http
GET http://localhost:5000/api/queries/open
```

### 4. Assign Query (Mentor)
```http
PUT http://localhost:5000/api/queries/{queryId}/assign-mentor
Content-Type: application/json

{
  "mentorId": "MENTOR001",
  "mentorName": "Jane Smith",
  "preferredSlots": ["morning", "afternoon"]
}
```

### 5. Get Admin Stats
```http
GET http://localhost:5000/api/admin/dashboard/stats
```

### 6. Get All Queries (Admin)
```http
GET http://localhost:5000/api/queries/all
```

### 7. Get Action Logs (Admin)
```http
GET http://localhost:5000/api/admin/action-logs
```

---

## Troubleshooting Common Issues

### Issue: Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000  (Mac/Linux)
netstat -ano | findstr :5000  (Windows)

# Kill process
kill -9 <PID>  (Mac/Linux)
taskkill /PID <PID> /F  (Windows)

# Or change port in .env
PORT=5001
```

### Issue: Cosmos DB Connection Error
```
Error: Failed to connect to Cosmos DB
```
**Solution:**
1. Check endpoint format: `https://account.documents.azure.com:443/`
2. Verify key length (should be ~88 characters)
3. Test key by removing last character - should fail
4. Check firewall rules in Cosmos DB account

### Issue: CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- CORS is enabled in server.js for localhost
- Check browser console for exact error
- Add URL to CORS whitelist in production

### Issue: Queries Not Saving to Database
**Solution:**
1. Check Network tab in DevTools (F12)
2. Verify response status (should be 201 or 200)
3. Check server console for error messages
4. Verify Cosmos DB containers exist

---

## Performance Tips

1. **Database**: Use proper partition keys (partition by menteeId)
2. **Frontend**: Minimize API calls, cache results in localStorage
3. **Server**: Enable gzip compression in Express
4. **Cosmos DB**: Monitor RUs (Request Units) usage

---

## Production Deployment

### Before Going Live

1. **Security**:
   - Implement user authentication
   - Add JWT tokens
   - Use HTTPS/SSL

2. **Environment**:
   - Set NODE_ENV=production
   - Use environment-specific credentials
   - Enable logging

3. **Database**:
   - Backup Cosmos DB
   - Enable point-in-time restore
   - Monitor performance

4. **Hosting Options**:
   - Azure App Service
   - Heroku
   - AWS Elastic Beanstalk
   - DigitalOcean

### Example Azure App Service Deployment
```bash
# Install Azure CLI
# Login to Azure
az login

# Create app service
az appservice plan create --name myPlan --resource-group myGroup --sku B1

az webapp create --name myapp --resource-group myGroup --plan myPlan --runtime "NODE|18-lts"

# Deploy from local git
az webapp deployment source config-local-git --name myapp --resource-group myGroup
```

---

## Getting Help

1. **Check Console**: Open F12 → Console tab for JavaScript errors
2. **Check Network**: F12 → Network tab to inspect API calls
3. **Server Logs**: Check terminal where server is running
4. **Azure Portal**: Check Cosmos DB metrics and diagnostics
5. **Documentation**: Review README.md and code comments

---

## Next Steps

After successful setup:
1. ✅ Customize color scheme in style.css
2. ✅ Add your company logo to HTML pages
3. ✅ Implement user authentication
4. ✅ Add email notifications
5. ✅ Deploy to production server
6. ✅ Set up monitoring and alerts

---

**Setup Complete!** 🎉

Your Mentee-Mentor-Admin platform is ready to use.
