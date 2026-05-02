# 🚀 GETTING STARTED - Complete Installation Guide

## ⚠️ Important: Node.js Installation Required

Before you can run this project, you need to install Node.js and npm.

## Step 1: Install Node.js

### Option 1: Download from Official Website (Recommended)
1. Go to https://nodejs.org/
2. Download **LTS version** (Currently v20.x)
3. Run the installer
4. Accept default settings
5. Restart your computer

### Option 2: Using Windows Package Manager (Winget)
```powershell
winget install OpenJS.NodeJS
```

### Option 3: Using Chocolatey
```powershell
choco install nodejs
```

### Verify Installation
After installation, open a new PowerShell/Command Prompt and run:
```powershell
node --version
npm --version
```

You should see version numbers (e.g., v20.10.0 and 10.2.3)

---

## Step 2: Install Azure Cosmos DB Account

### Create Cosmos DB in Azure Portal:

1. Go to https://portal.azure.com
2. Create a new resource
3. Search for "Azure Cosmos DB"
4. Select "Azure Cosmos DB for NoSQL"
5. Fill in details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new (e.g., "mentee-mentor-rg")
   - **Account Name**: e.g., "mentee-mentor-db"
   - **Location**: Select nearest to you
   - **Capacity Mode**: Provisioned (for testing)
   - **Apply Free Tier Discount**: Yes (if eligible)
6. Click "Review + Create" → "Create"
7. Wait 5-10 minutes for deployment

### Get Your Credentials:

1. Go to your newly created Cosmos DB account
2. Click **Keys** in the left sidebar
3. Copy these values to your `.env` file:
   - **URI** → `COSMOS_ENDPOINT`
   - **Primary Key** → `COSMOS_KEY`

---

## Step 3: Configure Your Project

### 1. Update .env File

Open `.env` in VS Code and add your Cosmos DB credentials:

```
COSMOS_ENDPOINT=https://your-account-name.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
DATABASE_NAME=MentorAdmin
QUERIES_CONTAINER=Queries
USERS_CONTAINER=Users
ACTION_LOGS_CONTAINER=ActionLogs
PORT=5000
NODE_ENV=development
```

**Example:**
```
COSMOS_ENDPOINT=https://mentee-mentor-db.documents.azure.com:443/
COSMOS_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz0123456789ABCDEfGhIjKlMnOpQrStUvWxYz==
```

### 2. Install Dependencies

Open PowerShell in the project folder and run:

```powershell
cd "c:\Users\2000082692\OneDrive - Hexaware Technologies\vs code\Mentee-Mentor-Admin"
npm install
```

This will install all required packages:
- express
- cors
- @azure/cosmos
- body-parser
- dotenv
- uuid
- nodemon (development)

---

## Step 4: Start the Server

### Option 1: Development Mode (Auto-restart on changes)
```powershell
npm run dev
```

### Option 2: Production Mode
```powershell
npm start
```

You should see:
```
✓ Database initialized: MentorAdmin
✓ Container created: Queries
✓ Container created: Users
✓ Container created: ActionLogs
✓ Server running on http://localhost:5000
```

---

## Step 5: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5000**
3. Select your role (Mentee, Mentor, or Admin)
4. Start using the application!

---

## 📦 Required VS Code Extensions

The following extensions are recommended for the best development experience.

### Installation Method 1: Using VS Code UI

1. Open VS Code
2. Press **Ctrl + Shift + X** (Extensions)
3. Search for each extension
4. Click "Install"

### Installation Method 2: Terminal Command

```powershell
# Copy all and paste in PowerShell
code --install-extension humao.rest-client
code --install-extension rangav.vscode-thunder-client
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.liveserver
code --install-extension dsznajder.es7-react-js-snippets
```

### Recommended Extensions List

| # | Extension | ID | Purpose |
|---|-----------|-----|---------|
| 1 | **REST Client** | humao.rest-client | Test API endpoints directly in VS Code |
| 2 | **Thunder Client** | rangav.vscode-thunder-client | Alternative API testing tool |
| 3 | **Prettier** | esbenp.prettier-vscode | Code formatter for better code style |
| 4 | **Live Server** | ritwickdey.liveserver | Local development server |
| 5 | **ES7 Snippets** | dsznajder.es7-react-js-snippets | JavaScript code snippets |
| 6 | **Postman** | postman.postman-for-vscode | API documentation and testing |
| 7 | **Thunder Client** | rangav.vscode-thunder-client | Lightweight REST client |
| 8 | **Error Lens** | usernamehw.errorlens | Display errors inline |

---

## 🧪 Testing the Application

### Quick Test Checklist:

#### 1. Mentee Test
- [ ] Navigate to http://localhost:5000
- [ ] Click "Mentee" card
- [ ] Enter name: "John Doe"
- [ ] Enter employee ID: "EMP001"
- [ ] Fill query form with sample data
- [ ] Click "Post Query"
- [ ] Should see success message
- [ ] Query should appear in list

#### 2. Mentor Test
- [ ] Navigate to http://localhost:5000
- [ ] Click "Mentor" card
- [ ] Enter name: "Jane Smith"
- [ ] See open queries list
- [ ] Click "Accept" on a query
- [ ] Select meeting slots
- [ ] Click "Accept & Assign"
- [ ] Query should move to "My Assigned Queries"

#### 3. Admin Test
- [ ] Navigate to http://localhost:5000
- [ ] Click "Admin" card
- [ ] Enter name: "Admin User"
- [ ] See dashboard with statistics
- [ ] Click "Edit" on a query
- [ ] Modify fields
- [ ] Click "Save Changes"
- [ ] View updated query

---

## 🔍 API Testing with REST Client

Create a file `test.http` in your project root:

```http
### Get All Open Queries
GET http://localhost:5000/api/queries/open

### Submit New Query
POST http://localhost:5000/api/queries/submit
Content-Type: application/json

{
  "employeeName": "Test User",
  "employeeId": "TEST001",
  "questionTitle": "How to improve coding?",
  "category": "Technical",
  "complexity": "medium",
  "meetingType": "Virtual",
  "preferredSlot": "afternoon",
  "detailedQuery": "I want to improve my coding skills..."
}

### Get Dashboard Stats
GET http://localhost:5000/api/admin/dashboard/stats

### Health Check
GET http://localhost:5000/api/health
```

Right-click on any request and select "Send Request"

---

## 🎨 Project Structure Overview

```
Your Project Folder/
├── server.js ........................ Main Express server
├── package.json ..................... Dependencies
├── .env ............................. Your credentials (UPDATE THIS)
├── .env.example ..................... Example file
├── README.md ........................ Full documentation
├── SETUP_GUIDE.md ................... Detailed setup instructions
├── GETTING_STARTED.md ............... This file
│
├── public/ .......................... Frontend files
│   ├── index.html ................... Login page
│   ├── mentee.html .................. Mentee dashboard
│   ├── mentor.html .................. Mentor dashboard
│   ├── admin.html ................... Admin dashboard
│   ├── css/
│   │   └── style.css ................ Styling
│   └── js/
│       ├── mentee.js ................ Mentee logic
│       ├── mentor.js ................ Mentor logic
│       └── admin.js ................. Admin logic
│
└── node_modules/ ................... (Auto-created by npm)
```

---

## ⚡ Quick Commands Reference

```powershell
# Navigate to project
cd "c:\Users\2000082692\OneDrive - Hexaware Technologies\vs code\Mentee-Mentor-Admin"

# Install dependencies (first time only)
npm install

# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# List outdated packages
npm outdated

# Update packages
npm update
```

---

## 🆘 Troubleshooting

### Problem: npm command not found
**Solution:**
- Restart VS Code or PowerShell after installing Node.js
- Check if Node is in PATH: `node --version`

### Problem: Port 5000 is in use
**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env to 5001
```

### Problem: Cosmos DB connection error
**Solution:**
- Verify endpoint format in .env
- Check key is copied correctly
- Ensure database hasn't been deleted

### Problem: Can't access http://localhost:5000
**Solution:**
- Check server is running (should see "Server running on..." message)
- Clear browser cache (Ctrl+Shift+Delete)
- Try http://127.0.0.1:5000

---

## 📚 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Azure Cosmos DB Docs](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [Chart.js Guide](https://www.chartjs.org/docs/)

---

## ✅ Final Checklist

- [ ] Node.js installed and verified
- [ ] Azure Cosmos DB account created
- [ ] .env file updated with credentials
- [ ] npm install completed successfully
- [ ] Server started (npm run dev)
- [ ] Browser opens to http://localhost:5000
- [ ] Can select role and see dashboard
- [ ] Can submit a query (mentee test)
- [ ] Extensions installed in VS Code

---

## 🎉 You're Ready!

Once all steps are complete, your Mentee-Mentor-Admin platform is fully operational!

### Next Steps:
1. Customize color scheme in `public/css/style.css`
2. Add your company logo to HTML pages
3. Implement authentication (optional)
4. Deploy to production
5. Monitor and maintain

---

**Questions?** Refer to:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- Server console for error messages
- Browser DevTools (F12) for frontend issues

**Happy coding!** 🚀
