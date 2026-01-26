// Models index file
// Centralizes all model exports and defines relationships between models
// Relationships:
// - Institution has many Projects
// - Project belongs to Institution
// - Project has many PurchaseRequests
// - PurchaseRequest belongs to Project
// - User can manage Projects (as ProjectManager)
// - User can create PurchaseRequests

const User = require('./User');
const Institution = require('./Institution');
const Project = require('./Project');
const PurchaseRequest = require('./PurchaseRequest');
const LabInfo = require('./LabInfo');
const Team = require('./Team');
const Article = require('./Article');

// Define relationships

// Institution → Project (one-to-many)
Institution.hasMany(Project, {
  foreignKey: 'institutionId',
  as: 'projects',
  onDelete: 'CASCADE'
});
Project.belongsTo(Institution, {
  foreignKey: 'institutionId',
  as: 'institution'
});

// User → Project (as ProjectManager, one-to-many)
User.hasMany(Project, {
  foreignKey: 'projectManagerId',
  as: 'managedProjects',
  onDelete: 'SET NULL'
});
Project.belongsTo(User, {
  foreignKey: 'projectManagerId',
  as: 'projectManager'
});

// Project → PurchaseRequest (one-to-many)
Project.hasMany(PurchaseRequest, {
  foreignKey: 'projectId',
  as: 'purchaseRequests',
  onDelete: 'CASCADE'
});
PurchaseRequest.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// User → PurchaseRequest (as requester, one-to-many)
User.hasMany(PurchaseRequest, {
  foreignKey: 'requestedById',
  as: 'requestedPurchases',
  onDelete: 'RESTRICT'
});
PurchaseRequest.belongsTo(User, {
  foreignKey: 'requestedById',
  as: 'requester'
});

// User → PurchaseRequest (as reviewer, one-to-many)
User.hasMany(PurchaseRequest, {
  foreignKey: 'reviewedById',
  as: 'reviewedPurchases',
  onDelete: 'SET NULL'
});
PurchaseRequest.belongsTo(User, {
  foreignKey: 'reviewedById',
  as: 'reviewer'
});

// User → User (as approver, one-to-many) - Day 3: User Approval System
User.hasMany(User, {
  foreignKey: 'approvedById',
  as: 'approvedUsers',
  onDelete: 'SET NULL'
});
User.belongsTo(User, {
  foreignKey: 'approvedById',
  as: 'approver'
});

// User → Article (as author, one-to-many) - Day 6: Scientific Articles
User.hasMany(Article, {
  foreignKey: 'userId',
  as: 'articles',
  onDelete: 'CASCADE'
});
Article.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

// Project → Article (optional association, one-to-many)
Project.hasMany(Article, {
  foreignKey: 'projectId',
  as: 'articles',
  onDelete: 'SET NULL'
});
Article.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// Team → Article (optional association, one-to-many)
Team.hasMany(Article, {
  foreignKey: 'teamId',
  as: 'articles',
  onDelete: 'SET NULL'
});
Article.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});

module.exports = {
  User,
  Institution,
  Project,
  PurchaseRequest,
  LabInfo,
  Team,
  Article
};
