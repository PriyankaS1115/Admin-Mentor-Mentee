const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cosmos DB Configuration
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

let database;
let queriesContainer;
let usersContainer;
let actionLogsContainer;

// Initialize Cosmos DB
async function initializeCosmosDB() {
  try {
    const databaseDef = { id: process.env.DATABASE_NAME };
    const dbResponse = await cosmosClient.databases.createIfNotExists(databaseDef);
    database = dbResponse.database;
    console.log('✓ Database initialized:', database.id);

    // Create containers if they don't exist
    const containerDefs = [
      { id: process.env.QUERIES_CONTAINER, partitionKey: '/menteeId' },
      { id: process.env.USERS_CONTAINER, partitionKey: '/userId' },
      { id: process.env.ACTION_LOGS_CONTAINER, partitionKey: '/adminId' },
    ];

    for (const containerDef of containerDefs) {
      const containerResponse = await database.containers.createIfNotExists(containerDef);
      console.log(`✓ Container created: ${containerDef.id}`);
    }

    queriesContainer = database.container(process.env.QUERIES_CONTAINER);
    usersContainer = database.container(process.env.USERS_CONTAINER);
    actionLogsContainer = database.container(process.env.ACTION_LOGS_CONTAINER);

  } catch (error) {
    console.error('Error initializing Cosmos DB:', error);
    process.exit(1);
  }
}

// ==================== MENTEE APIS ====================

// Submit Query
app.post('/api/queries/submit', async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      questionTitle,
      category,
      complexity,
      meetingType,
      preferredSlot,
      detailedQuery,
    } = req.body;

    const query = {
      id: uuidv4(),
      menteeId: employeeId,
      employeeName,
      employeeId,
      questionTitle,
      category,
      complexity,
      meetingType,
      preferredSlot,
      detailedQuery,
      status: 'OPEN',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      assignedMentor: null,
      resolution: null,
      closedDate: null,
    };

    const response = await queriesContainer.items.create(query);
    res.status(201).json({ success: true, data: response.resource });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Mentee Queries
app.get('/api/queries/mentee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const query = `SELECT * FROM c WHERE c.menteeId = '${employeeId}' ORDER BY c.createdDate DESC`;
    const result = await queriesContainer.items.query(query).fetchAll();
    res.json({ success: true, data: result.resources });
  } catch (error) {
    console.error('Error fetching mentee queries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== MENTOR APIS ====================

// Get All Open Queries
app.get('/api/queries/open', async (req, res) => {
  try {
    const query = `SELECT * FROM c WHERE c.status = 'OPEN' ORDER BY c.createdDate DESC`;
    const result = await queriesContainer.items.query(query).fetchAll();
    res.json({ success: true, data: result.resources });
  } catch (error) {
    console.error('Error fetching open queries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign Mentor to Query
app.put('/api/queries/:queryId/assign-mentor', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { mentorId, mentorName, preferredSlots } = req.body;

    const item = await queriesContainer.item(queryId, queryId).read();
    const query = item.resource;
    query.assignedMentor = {
      mentorId,
      mentorName,
      preferredSlots,
      assignedDate: new Date().toISOString(),
    };
    query.status = 'ASSIGNED';
    query.updatedDate = new Date().toISOString();

    const response = await queriesContainer.item(queryId, query.menteeId).replace(query);
    
    // Log action
    await logAction('MENTOR_ASSIGNED', mentorId, queryId, 'Mentor assigned to query');
    
    res.json({ success: true, data: response.resource });
  } catch (error) {
    console.error('Error assigning mentor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add Resolution
app.put('/api/queries/:queryId/resolution', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { mentorId, resolution } = req.body;

    const item = await queriesContainer.item(queryId, queryId).read();
    const query = item.resource;
    query.resolution = {
      mentorId,
      content: resolution,
      providedDate: new Date().toISOString(),
    };
    query.status = 'RESOLVED';
    query.updatedDate = new Date().toISOString();

    const response = await queriesContainer.item(queryId, query.menteeId).replace(query);
    
    // Log action
    await logAction('RESOLUTION_PROVIDED', mentorId, queryId, 'Resolution provided');
    
    res.json({ success: true, data: response.resource });
  } catch (error) {
    console.error('Error adding resolution:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ADMIN APIS ====================

// Get Dashboard Stats
app.get('/api/admin/dashboard/stats', async (req, res) => {
  try {
    const openQuery = `SELECT COUNT(1) as count FROM c WHERE c.status = 'OPEN'`;
    const closedQuery = `SELECT COUNT(1) as count FROM c WHERE c.status = 'CLOSED'`;
    const resolvedQuery = `SELECT COUNT(1) as count FROM c WHERE c.status = 'RESOLVED'`;
    const lowComplexityQuery = `SELECT COUNT(1) as count FROM c WHERE c.complexity = 'low'`;
    const mediumComplexityQuery = `SELECT COUNT(1) as count FROM c WHERE c.complexity = 'medium'`;
    const highComplexityQuery = `SELECT COUNT(1) as count FROM c WHERE c.complexity = 'high'`;

    const [openResult, closedResult, resolvedResult, lowResult, medResult, highResult] = await Promise.all([
      queriesContainer.items.query(openQuery).fetchAll(),
      queriesContainer.items.query(closedQuery).fetchAll(),
      queriesContainer.items.query(resolvedQuery).fetchAll(),
      queriesContainer.items.query(lowComplexityQuery).fetchAll(),
      queriesContainer.items.query(mediumComplexityQuery).fetchAll(),
      queriesContainer.items.query(highComplexityQuery).fetchAll(),
    ]);

    const stats = {
      openQueries: openResult.resources[0]?.count || 0,
      closedQueries: closedResult.resources[0]?.count || 0,
      resolvedQueries: resolvedResult.resources[0]?.count || 0,
      byComplexity: {
        low: lowResult.resources[0]?.count || 0,
        medium: medResult.resources[0]?.count || 0,
        high: highResult.resources[0]?.count || 0,
      },
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Queries
app.get('/api/queries/all', async (req, res) => {
  try {
    const query = `SELECT * FROM c ORDER BY c.createdDate DESC`;
    const result = await queriesContainer.items.query(query).fetchAll();
    res.json({ success: true, data: result.resources });
  } catch (error) {
    console.error('Error fetching all queries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Query Fields (Admin)
app.put('/api/queries/:queryId/update', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { adminId, updates, comments } = req.body;

    const item = await queriesContainer.item(queryId, queryId).read();
    const query = item.resource;

    // Apply updates
    Object.assign(query, updates);
    query.updatedDate = new Date().toISOString();

    const response = await queriesContainer.item(queryId, query.menteeId).replace(query);
    
    // Log action
    await logAction('QUERY_UPDATED', adminId, queryId, comments);
    
    res.json({ success: true, data: response.resource });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Close Query (Admin)
app.put('/api/queries/:queryId/close', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { adminId, comments } = req.body;

    const item = await queriesContainer.item(queryId, queryId).read();
    const query = item.resource;

    query.status = 'CLOSED';
    query.closedDate = new Date().toISOString();
    query.adminComments = comments;
    query.updatedDate = new Date().toISOString();

    const response = await queriesContainer.item(queryId, query.menteeId).replace(query);
    
    // Log action
    await logAction('QUERY_CLOSED', adminId, queryId, comments);
    
    res.json({ success: true, data: response.resource });
  } catch (error) {
    console.error('Error closing query:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Action Logs
app.get('/api/admin/action-logs', async (req, res) => {
  try {
    const query = `SELECT * FROM c ORDER BY c.timestamp DESC`;
    const result = await actionLogsContainer.items.query(query).fetchAll();
    res.json({ success: true, data: result.resources });
  } catch (error) {
    console.error('Error fetching action logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to log actions
async function logAction(actionType, userId, queryId, details) {
  try {
    const log = {
      id: uuidv4(),
      adminId: userId,
      actionType,
      queryId,
      details,
      timestamp: new Date().toISOString(),
    };
    await actionLogsContainer.items.create(log);
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize and Start Server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await initializeCosmosDB();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
