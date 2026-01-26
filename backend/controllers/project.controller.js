// Project Controller
// Handles all project-related operations (CRUD)
// Admin/LabHead has full access, ProjectManager can manage their assigned projects

const { Project, Institution, User, PurchaseRequest } = require('../models');
const { Op } = require('sequelize');

// Get all projects (with optional filtering)
exports.getAllProjects = async (req, res) => {
  try {
    const { institutionId, projectManagerId, isActive } = req.query;
    
    // Build filter conditions
    const where = {};
    if (institutionId) where.institutionId = institutionId;
    if (projectManagerId) where.projectManagerId = projectManagerId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: Institution,
          as: 'institution',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: PurchaseRequest,
          as: 'purchaseRequests',
          attributes: ['id', 'status']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id, {
      include: [
        {
          model: Institution,
          as: 'institution',
          attributes: ['id', 'name', 'address', 'contactEmail']
        },
        {
          model: User,
          as: 'projectManager',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: PurchaseRequest,
          as: 'purchaseRequests',
          include: [{
            model: User,
            as: 'requester',
            attributes: ['id', 'firstName', 'lastName']
          }]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, source, description, startDate, endDate, budget, institutionId, projectManagerId } = req.body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required and cannot be empty'
      });
    }

    if (!source || source.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project source is required and cannot be empty'
      });
    }

    if (!institutionId) {
      return res.status(400).json({
        success: false,
        message: 'Institution ID is required'
      });
    }

    // Verify institution exists
    const institution = await Institution.findByPk(institutionId);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: `Institution with ID ${institutionId} not found`
      });
    }

    // Verify project manager exists if provided
    if (projectManagerId) {
      const manager = await User.findByPk(projectManagerId);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${projectManagerId} not found`
        });
      }
    }

    const project = await Project.create({
      name: name.trim(),
      source: source.trim(),
      description,
      startDate,
      endDate,
      budget,
      institutionId,
      projectManagerId,
      isActive: true
    });

    // Fetch complete project with associations
    const completeProject = await Project.findByPk(project.id, {
      include: [
        { model: Institution, as: 'institution', attributes: ['id', 'name'] },
        { model: User, as: 'projectManager', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: completeProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, source, description, startDate, endDate, budget, institutionId, projectManagerId, isActive } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`
      });
    }

    // Validate name and source if provided
    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project name cannot be empty'
      });
    }

    if (source !== undefined && source.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project source cannot be empty'
      });
    }

    // Verify institution exists if changing
    if (institutionId && institutionId !== project.institutionId) {
      const institution = await Institution.findByPk(institutionId);
      if (!institution) {
        return res.status(404).json({
          success: false,
          message: `Institution with ID ${institutionId} not found`
        });
      }
    }

    // Verify project manager exists if changing
    if (projectManagerId && projectManagerId !== project.projectManagerId) {
      const manager = await User.findByPk(projectManagerId);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${projectManagerId} not found`
        });
      }
    }

    await project.update({
      name: name ? name.trim() : project.name,
      source: source ? source.trim() : project.source,
      description: description !== undefined ? description : project.description,
      startDate: startDate !== undefined ? startDate : project.startDate,
      endDate: endDate !== undefined ? endDate : project.endDate,
      budget: budget !== undefined ? budget : project.budget,
      institutionId: institutionId !== undefined ? institutionId : project.institutionId,
      projectManagerId: projectManagerId !== undefined ? projectManagerId : project.projectManagerId,
      isActive: isActive !== undefined ? isActive : project.isActive
    });

    // Fetch updated project with associations
    const updatedProject = await Project.findByPk(id, {
      include: [
        { model: Institution, as: 'institution', attributes: ['id', 'name'] },
        { model: User, as: 'projectManager', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};
