const { Article, User, Project, Team } = require('../models');
const { Op } = require('sequelize');

/**
 * Article Controller - Day 6: Scientific Articles Feature
 * Handles CRUD operations for scientific articles with role-based access
 * - Public routes: Anyone can view published public articles
 * - Member routes: Authenticated users can view all published articles (public + members_only)
 * - Admin routes: Create, update, delete articles
 */

// Get all public articles (no authentication required)
// Filters: status='published', visibility='public'
// Optional query params: year, teamId, search (title/abstract/keywords)
exports.getPublicArticles = async (req, res) => {
  try {
    const { year, teamId, search, page = 1, limit = 10 } = req.query;
    
    // Build where clause
    const whereClause = {
      status: 'published',
      visibility: 'public'
    };

    // Filter by publication year
    if (year) {
      whereClause.publicationDate = {
        [Op.gte]: `${year}-01-01`,
        [Op.lte]: `${year}-12-31`
      };
    }

    // Filter by team
    if (teamId) {
      whereClause.teamId = teamId;
    }

    // Search in title, abstract, keywords
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { abstract: { [Op.like]: `%${search}%` } },
        { keywords: { [Op.like]: `%${search}%` } },
        { authors: { [Op.like]: `%${search}%` } }
      ];
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'expertise']
        }
      ],
      order: [['publicationDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      message: 'Public articles retrieved successfully',
      data: {
        articles: rows,
        totalArticles: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public articles',
      error: error.message
    });
  }
};

// Get all articles for authenticated users (members see public + members_only)
// Admin sees all articles regardless of status/visibility
exports.getAllArticles = async (req, res) => {
  try {
    const { status, visibility, teamId, projectId, year, search, page = 1, limit = 20 } = req.query;
    const userRole = req.user.role;
    
    // Build where clause
    const whereClause = {};

    // For regular members, only show published articles (public + members_only)
    if (userRole !== 'admin') {
      whereClause.status = 'published';
    } else {
      // Admin can filter by status
      if (status) {
        whereClause.status = status;
      }
    }

    // Filter by visibility
    if (visibility) {
      whereClause.visibility = visibility;
    }

    // Filter by team
    if (teamId) {
      whereClause.teamId = teamId;
    }

    // Filter by project
    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Filter by year
    if (year) {
      whereClause.publicationDate = {
        [Op.gte]: `${year}-01-01`,
        [Op.lte]: `${year}-12-31`
      };
    }

    // Search
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { abstract: { [Op.like]: `%${search}%` } },
        { keywords: { [Op.like]: `%${search}%` } },
        { authors: { [Op.like]: `%${search}%` } }
      ];
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source', 'description']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'expertise']
        }
      ],
      order: [['publicationDate', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      message: 'Articles retrieved successfully',
      data: {
        articles: rows,
        totalArticles: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source', 'description', 'startDate', 'endDate']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'expertise', 'objectives']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check visibility permissions
    // Public articles: everyone can see if published
    // Members_only articles: only authenticated users can see if published
    // Draft/archived: only admin can see
    if (req.user) {
      // Authenticated user
      if (req.user.role === 'admin') {
        // Admin can see everything
      } else {
        // Regular member can only see published articles
        if (article.status !== 'published') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Article is not published.'
          });
        }
      }
    } else {
      // Public access (no authentication)
      if (article.status !== 'published' || article.visibility !== 'public') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Article is not publicly available.'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Article retrieved successfully',
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
};

// Get articles by project ID
exports.getArticlesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userRole = req.user ? req.user.role : null;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const whereClause = { projectId };

    // For public/member access, only show published articles
    if (userRole !== 'admin') {
      whereClause.status = 'published';
      if (!userRole) {
        // Public access: only public visibility
        whereClause.visibility = 'public';
      }
    }

    const articles = await Article.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'expertise']
        }
      ],
      order: [['publicationDate', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Project articles retrieved successfully',
      data: {
        project: {
          id: project.id,
          name: project.name
        },
        articles
      }
    });
  } catch (error) {
    console.error('Error fetching project articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project articles',
      error: error.message
    });
  }
};

// Get articles by team ID
exports.getArticlesByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userRole = req.user ? req.user.role : null;

    // Verify team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const whereClause = { teamId };

    // For public/member access, only show published articles
    if (userRole !== 'admin') {
      whereClause.status = 'published';
      if (!userRole) {
        // Public access: only public visibility
        whereClause.visibility = 'public';
      }
    }

    const articles = await Article.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source']
        }
      ],
      order: [['publicationDate', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Team articles retrieved successfully',
      data: {
        team: {
          id: team.id,
          name: team.name,
          expertise: team.expertise
        },
        articles
      }
    });
  } catch (error) {
    console.error('Error fetching team articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team articles',
      error: error.message
    });
  }
};

// Create new article (Admin only)
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      abstract,
      authors,
      keywords,
      publicationDate,
      journal,
      doi,
      pdfUrl,
      status,
      visibility,
      projectId,
      teamId
    } = req.body;

    // Validate required fields
    if (!title || !authors) {
      return res.status(400).json({
        success: false,
        message: 'Title and authors are required'
      });
    }

    // Validate foreign keys if provided
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    if (teamId) {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
    }

    // Create article
    const article = await Article.create({
      title,
      abstract,
      authors,
      keywords,
      publicationDate,
      journal,
      doi,
      pdfUrl,
      status: status || 'draft',
      visibility: visibility || 'members_only',
      userId: req.userId, // From JWT middleware
      projectId,
      teamId
    });

    // Fetch created article with associations
    const createdArticle = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: createdArticle
    });
  } catch (error) {
    console.error('Error creating article:', error);
    
    // Handle unique constraint violation (duplicate DOI)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'An article with this DOI already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
};

// Update article (Admin only)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      abstract,
      authors,
      keywords,
      publicationDate,
      journal,
      doi,
      pdfUrl,
      status,
      visibility,
      projectId,
      teamId
    } = req.body;

    // Find article
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Validate foreign keys if provided
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    if (teamId) {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
    }

    // Update article
    await article.update({
      title: title || article.title,
      abstract: abstract !== undefined ? abstract : article.abstract,
      authors: authors || article.authors,
      keywords: keywords !== undefined ? keywords : article.keywords,
      publicationDate: publicationDate !== undefined ? publicationDate : article.publicationDate,
      journal: journal !== undefined ? journal : article.journal,
      doi: doi !== undefined ? doi : article.doi,
      pdfUrl: pdfUrl !== undefined ? pdfUrl : article.pdfUrl,
      status: status || article.status,
      visibility: visibility || article.visibility,
      projectId: projectId !== undefined ? projectId : article.projectId,
      teamId: teamId !== undefined ? teamId : article.teamId
    });

    // Fetch updated article with associations
    const updatedArticle = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error updating article:', error);
    
    // Handle unique constraint violation (duplicate DOI)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'An article with this DOI already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating article',
      error: error.message
    });
  }
};

// Delete article (Admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await article.destroy();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message
    });
  }
};

// Get article statistics (Admin only)
exports.getArticleStats = async (req, res) => {
  try {
    const totalArticles = await Article.count();
    const publishedArticles = await Article.count({ where: { status: 'published' } });
    const draftArticles = await Article.count({ where: { status: 'draft' } });
    const archivedArticles = await Article.count({ where: { status: 'archived' } });
    const publicArticles = await Article.count({ 
      where: { status: 'published', visibility: 'public' } 
    });
    const membersOnlyArticles = await Article.count({ 
      where: { status: 'published', visibility: 'members_only' } 
    });

    // Articles per team
    const articlesByTeam = await Article.findAll({
      attributes: [
        'teamId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'articleCount']
      ],
      where: { teamId: { [Op.not]: null } },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['name']
        }
      ],
      group: ['teamId']
    });

    res.status(200).json({
      success: true,
      message: 'Article statistics retrieved successfully',
      data: {
        total: totalArticles,
        byStatus: {
          published: publishedArticles,
          draft: draftArticles,
          archived: archivedArticles
        },
        byVisibility: {
          public: publicArticles,
          membersOnly: membersOnlyArticles
        },
        byTeam: articlesByTeam
      }
    });
  } catch (error) {
    console.error('Error fetching article statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article statistics',
      error: error.message
    });
  }
};
