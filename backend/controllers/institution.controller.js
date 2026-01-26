// Institution Controller
// Handles all institution-related operations (CRUD)
// Only Admin/LabHead can manage institutions

const { Institution, Project } = require('../models');

// Get all institutions
exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.findAll({
      include: [{
        model: Project,
        as: 'projects',
        attributes: ['id', 'name', 'source', 'isActive']
      }],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Institutions retrieved successfully',
      data: institutions
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve institutions',
      error: error.message
    });
  }
};

// Get institution by ID
exports.getInstitutionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const institution = await Institution.findByPk(id, {
      include: [{
        model: Project,
        as: 'projects',
        attributes: ['id', 'name', 'source', 'budget', 'startDate', 'endDate', 'isActive']
      }]
    });

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: `Institution with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Institution retrieved successfully',
      data: institution
    });
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve institution',
      error: error.message
    });
  }
};

// Create new institution (Admin only)
exports.createInstitution = async (req, res) => {
  try {
    const { name, address, contactEmail, contactPhone, description } = req.body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Institution name is required and cannot be empty'
      });
    }

    const institution = await Institution.create({
      name: name.trim(),
      address,
      contactEmail,
      contactPhone,
      description,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Institution created successfully',
      data: institution
    });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create institution',
      error: error.message
    });
  }
};

// Update institution (Admin only)
exports.updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contactEmail, contactPhone, description, isActive } = req.body;

    const institution = await Institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: `Institution with ID ${id} not found`
      });
    }

    // Validate name if provided
    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Institution name cannot be empty'
      });
    }

    await institution.update({
      name: name ? name.trim() : institution.name,
      address: address !== undefined ? address : institution.address,
      contactEmail: contactEmail !== undefined ? contactEmail : institution.contactEmail,
      contactPhone: contactPhone !== undefined ? contactPhone : institution.contactPhone,
      description: description !== undefined ? description : institution.description,
      isActive: isActive !== undefined ? isActive : institution.isActive
    });

    res.status(200).json({
      success: true,
      message: 'Institution updated successfully',
      data: institution
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update institution',
      error: error.message
    });
  }
};

// Delete institution (Admin only)
exports.deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findByPk(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: `Institution with ID ${id} not found`
      });
    }

    await institution.destroy();

    res.status(200).json({
      success: true,
      message: 'Institution deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete institution',
      error: error.message
    });
  }
};
