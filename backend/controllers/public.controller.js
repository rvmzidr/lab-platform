const LabInfo = require('../models/LabInfo');
const Team = require('../models/Team');

// Obtenir les informations du laboratoire
exports.getLabInfo = async (req, res) => {
  try {
    const labInfo = await LabInfo.findOne();
    
    if (!labInfo) {
      return res.status(404).json({ message: "Informations du laboratoire non trouvées" });
    }

    res.json({
      fullName: labInfo.full_name,
      shortName: labInfo.short_name,
      address: labInfo.address,
      createdYear: labInfo.created_year,
      mission: labInfo.mission,
      presentation: labInfo.presentation,
      context: labInfo.context,
      objectives: labInfo.objectives,
      contact: {
        phone: labInfo.phone,
        email: labInfo.email,
        website: labInfo.website
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des informations:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir toutes les équipes de recherche
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      order: [['display_order', 'ASC']]
    });

    const formattedTeams = teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      expertise: team.expertise,
      objectives: team.objectives,
      order: team.display_order
    }));

    res.json(formattedTeams);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir une équipe spécifique
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }

    res.json({
      id: team.id,
      name: team.name,
      description: team.description,
      expertise: team.expertise,
      objectives: team.objectives,
      order: team.display_order
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
