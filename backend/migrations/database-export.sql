-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.4.3 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour lab_platform
CREATE DATABASE IF NOT EXISTS `lab_platform` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lab_platform`;

-- Listage de la structure de table lab_platform. articles
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abstract` text COLLATE utf8mb4_unicode_ci,
  `authors` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publicationDate` date DEFAULT NULL,
  `journal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdfUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `visibility` enum('public','members_only') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'members_only',
  `userId` int NOT NULL,
  `projectId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doi` (`doi`),
  KEY `idx_article_status` (`status`),
  KEY `idx_article_visibility` (`visibility`),
  KEY `idx_article_publication_date` (`publicationDate`),
  KEY `idx_article_user` (`userId`),
  KEY `idx_article_project` (`projectId`),
  KEY `idx_article_team` (`teamId`),
  CONSTRAINT `fk_article_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_article_team` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_article_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table lab_platform.articles : ~10 rows (environ)
DELETE FROM `articles`;
INSERT INTO `articles` (`id`, `title`, `abstract`, `authors`, `keywords`, `publicationDate`, `journal`, `doi`, `pdfUrl`, `status`, `visibility`, `userId`, `projectId`, `teamId`, `createdAt`, `updatedAt`) VALUES
	(1, 'Analyse par Activation Neutronique des Contaminants dans les Produits Alimentaires Tunisiens', 'Cette étude présente une analyse complète des contaminants métalliques dans divers produits alimentaires tunisiens en utilisant la technique d\'activation neutronique. Les résultats montrent des concentrations généralement inférieures aux normes internationales, avec quelques dépassements localisés nécessitant une surveillance continue. L\'étude contribue à l\'évaluation de la sécurité alimentaire en Tunisie et propose des recommandations pour le contrôle qualité.', 'Ahmed Ben Salem, Fatma Mansouri, Leila Kallel, Mohamed Trabelsi', 'activation neutronique, sécurité alimentaire, contaminants, spectrométrie gamma, Tunisie', '2024-09-15', 'Journal of Radioanalytical and Nuclear Chemistry', '10.1007/s10967-024-09234-5', 'https://doi.org/10.1007/s10967-024-09234-5', 'published', 'public', 1, NULL, 1, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(2, 'Development of New Thermoluminescent Dosimeters Based on Tunisian Natural Minerals', 'We report on the development and characterization of novel thermoluminescent dosimeters using natural minerals found in Tunisia. The dosimetric properties including sensitivity, linearity, fading, and energy dependence were evaluated. These materials show promising characteristics for environmental radiation monitoring and personal dosimetry applications, offering a cost-effective alternative to commercial dosimeters.', 'Nadia Khmiri, Omar Jebali, Sonia Mezghani, Tarek Abidi', 'thermoluminescence, dosimetry, natural minerals, radiation detection, environmental monitoring', '2025-02-28', 'Radiation Measurements', '10.1016/j.radmeas.2025.106892', 'https://doi.org/10.1016/j.radmeas.2025.106892', 'published', 'public', 1, NULL, 2, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(3, 'Monte Carlo Simulation of Neutron Transport in Research Reactor Core Configurations', 'This paper presents detailed Monte Carlo simulations of neutron transport in various research reactor core configurations using MCNP6 code. The study focuses on neutron flux distributions, reactivity parameters, and radiation shielding optimization. Simulation results were validated against experimental measurements, showing excellent agreement. The methodology provides a powerful tool for reactor design optimization and safety assessment.', 'Khaled Gharbi, Mehdi Oueslati, Amal Zouari, Riadh Hamdi', 'Monte Carlo, MCNP, neutron transport, reactor physics, nuclear safety', '2024-11-20', 'Annals of Nuclear Energy', '10.1016/j.anucene.2024.110567', 'https://doi.org/10.1016/j.anucene.2024.110567', 'published', 'public', 1, NULL, 3, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(4, 'Design and Performance Evaluation of a High-Resolution Gamma Spectrometry System', 'We present the design, construction, and performance evaluation of a high-resolution gamma spectrometry system based on HPGe detector technology. The system features advanced digital signal processing, automated calibration procedures, and optimized shielding configuration. Performance tests demonstrate excellent energy resolution (0.8 keV at 122 keV) and low background levels, making it suitable for environmental radioactivity monitoring and nuclear forensics applications.', 'Samira Bouden, Ines Bouazizi, Carlos Garcia, Jean-Pierre Dubois', 'gamma spectrometry, HPGe detector, nuclear instrumentation, radiation measurement, digital signal processing', '2025-05-10', 'Nuclear Instruments and Methods in Physics Research A', '10.1016/j.nima.2025.169234', 'https://doi.org/10.1016/j.nima.2025.169234', 'published', 'public', 1, NULL, 4, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(5, 'Protocoles Internes de Radioprotection pour les Laboratoires du CNSTN', 'Ce rapport technique présente les protocoles mis à jour pour la radioprotection dans les laboratoires du Centre National des Sciences et Technologies Nucléaires. Il inclut les procédures de manipulation des sources radioactives, les protocoles de décontamination, les limites d\'exposition recommandées, et les mesures d\'urgence. Ces protocoles sont conformes aux normes internationales de l\'AIEA et adaptés au contexte tunisien.', 'Fatma Mansouri, Ahmed Kacem, Leila Bouguerra', 'radioprotection, sécurité, protocoles, laboratoire, CNSTN', '2025-08-15', 'Rapport Technique Interne CNSTN-RT-2025-003', NULL, NULL, 'published', 'members_only', 1, NULL, 1, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(6, 'Étude Préliminaire sur l\'Effet de l\'Irradiation Gamma sur les Polymères Locaux', 'Rapport d\'étude interne sur l\'effet de l\'irradiation gamma sur différents types de polymères produits localement en Tunisie. Les modifications structurales, mécaniques et optiques ont été caractérisées par diverses techniques analytiques. Les résultats préliminaires montrent des changements significatifs dans les propriétés des matériaux qui pourraient avoir des applications industrielles intéressantes.', 'Nadia Khmiri, Tarek Abidi, Sonia Mezghani', 'irradiation gamma, polymères, modifications structurales, applications industrielles', '2025-10-05', 'Document de Travail Interne LR16CNSTN02', NULL, NULL, 'published', 'members_only', 1, NULL, 2, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(7, 'Optimization of Nuclear Waste Storage Configurations Using Multi-Physics Simulations', 'This ongoing research investigates optimal configurations for nuclear waste storage using coupled neutronics-thermal-hydraulics simulations. Preliminary results indicate that specific geometric arrangements can significantly improve heat dissipation while maintaining subcriticality margins. Further validation through experimental benchmarks is in progress. Expected submission to Nuclear Engineering and Design in Q2 2026.', 'Mehdi Oueslati, Khaled Gharbi, Riadh Hamdi', 'nuclear waste, storage optimization, multi-physics simulation, thermal analysis, criticality safety', NULL, 'Nuclear Engineering and Design (En préparation)', NULL, NULL, 'draft', 'members_only', 1, NULL, 3, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(8, 'Novel Silicon Carbide Detector for Harsh Environment Applications', 'Work in progress on the development of a silicon carbide-based radiation detector capable of operating in high-temperature and high-radiation environments. Initial prototypes show promising radiation hardness and thermal stability. Characterization of detection efficiency and energy resolution is ongoing. Manuscript in preparation for submission to IEEE Transactions on Nuclear Science.', 'Ines Bouazizi, Samira Bouden, Maria Rossi', 'SiC detector, radiation hardness, high temperature, nuclear instrumentation, harsh environment', NULL, NULL, NULL, NULL, 'draft', 'members_only', 1, NULL, 4, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(9, 'Mediterranean Network for Nuclear Safety: Achievements and Future Perspectives', 'This collaborative review summarizes five years of achievements by the Mediterranean Network for Nuclear Safety, involving research institutions from Tunisia, France, Italy, Spain, and Morocco. The network has facilitated knowledge exchange, joint research projects, and harmonization of safety standards. We present case studies, lessons learned, and strategic recommendations for strengthening regional cooperation in nuclear safety and security.', 'Ahmed Kacem, Jean-Pierre Dubois, Maria Rossi, Carlos Garcia, Hassan El-Amrani, Fatma Mansouri', 'nuclear safety, international collaboration, Mediterranean region, knowledge exchange, safety standards', '2024-12-10', 'Nuclear Safety and Security Journal', '10.1016/j.nss.2024.11.008', 'https://doi.org/10.1016/j.nss.2024.11.008', 'published', 'public', 1, NULL, NULL, '2026-01-12 11:23:59', '2026-01-12 11:23:59'),
	(10, 'Baseline Radioactivity Levels in Tunisian Coastal Sediments: A Comprehensive Survey', 'This comprehensive study presents baseline radioactivity levels (natural and anthropogenic radionuclides) in coastal sediments along the Tunisian coastline. Samples were collected from 50 locations and analyzed using gamma spectrometry. Results indicate natural radioactivity levels comparable to global averages, with no evidence of significant anthropogenic contamination. The dataset provides valuable reference values for future environmental monitoring programs.', 'Amal Zouari, Khaled Gharbi, Leila Kallel, Omar Jebali', 'environmental radioactivity, coastal sediments, gamma spectrometry, baseline survey, Tunisia', '2025-07-22', 'Journal of Environmental Radioactivity', '10.1016/j.jenvrad.2025.107089', 'https://doi.org/10.1016/j.jenvrad.2025.107089', 'published', 'public', 1, NULL, 1, '2026-01-12 11:23:59', '2026-01-12 11:23:59');

-- Listage de la structure de table lab_platform. institutions
CREATE TABLE IF NOT EXISTS `institutions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each institution',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Institution name - cannot be empty',
  `address` text COLLATE utf8mb4_unicode_ci COMMENT 'Physical address of the institution',
  `contactEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Primary contact email for the institution',
  `contactPhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Primary contact phone number',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Additional information about the institution',
  `isActive` tinyint(1) DEFAULT '1' COMMENT 'Whether the institution is currently active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_institution_name` (`name`),
  KEY `idx_institution_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Research institutions that contain projects';

-- Listage des données de la table lab_platform.institutions : ~0 rows (environ)
DELETE FROM `institutions`;

-- Listage de la structure de table lab_platform. lab_info
CREATE TABLE IF NOT EXISTS `lab_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_year` int NOT NULL,
  `mission` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `presentation` text COLLATE utf8mb4_unicode_ci,
  `context` text COLLATE utf8mb4_unicode_ci,
  `objectives` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table lab_platform.lab_info : ~0 rows (environ)
DELETE FROM `lab_info`;
INSERT INTO `lab_info` (`id`, `full_name`, `short_name`, `address`, `created_year`, `mission`, `presentation`, `context`, `objectives`, `phone`, `email`, `website`, `created_at`, `updated_at`) VALUES
	(1, 'Laboratoire de Recherche en Energie et Matière pour le développement des sciences nucléaires (LR16CNSTN02)', 'LR16CNSTN02', 'Pôle Technologique. 2020 Sidi Thabet, Tunis, Tunisie', 2016, 'Applications pacifiques des sciences nucléaires pour le développement durable', 'Le laboratoire LR16CNSTN02, créé en 2016, est situé au Pôle Technologique Sidi Thabet, Tunis. Il dispose d\'une expertise héritée de l\'ancienne unité de recherche UR04CNSTN02 "Maîtrise et développement des techniques nucléaires pour la protection de l\'homme et de son environnement" et s\'inscrit dans la continuité de ses travaux de recherche fondamentale et appliquée.', 'Le Laboratoire de Recherche en Energie et Matière (LR16CNSTN02) s\'inscrit dans le cadre des efforts nationaux pour le développement des applications pacifiques des sciences nucléaires. La maîtrise des technologies nucléaires représente un enjeu stratégique pour la Tunisie, notamment dans les domaines de la santé, de l\'agriculture, de l\'environnement et de l\'énergie.', 'Développer la recherche fondamentale et appliquée dans le domaine de l\'énergie nucléaire et des matériaux. Contribuer au développement des applications pacifiques du nucléaire en Tunisie. Former des chercheurs et des ingénieurs hautement qualifiés. Renforcer la coopération scientifique nationale et internationale.', '+216 71 537 666', 'lr16cnstn02@gmail.com', 'http://www.cnstn.rnrt.tn', '2026-01-07 11:14:07', '2026-01-07 12:07:01');

-- Listage de la structure de table lab_platform. projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each project',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Project name - cannot be empty',
  `source` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Funding source or origin of the project',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Detailed description of the project',
  `startDate` datetime DEFAULT NULL COMMENT 'Project start date',
  `endDate` datetime DEFAULT NULL COMMENT 'Project end date',
  `budget` decimal(15,2) DEFAULT NULL COMMENT 'Total project budget',
  `institutionId` int NOT NULL COMMENT 'Foreign key to institution (Institution contains Projects)',
  `projectManagerId` int DEFAULT NULL COMMENT 'Foreign key to user who manages this project (ProjectManager role)',
  `isActive` tinyint(1) DEFAULT '1' COMMENT 'Whether the project is currently active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_project_name` (`name`),
  KEY `idx_project_institution` (`institutionId`),
  KEY `idx_project_manager` (`projectManagerId`),
  KEY `idx_project_active` (`isActive`),
  KEY `idx_project_dates` (`startDate`,`endDate`),
  CONSTRAINT `projects_ibfk_33` FOREIGN KEY (`institutionId`) REFERENCES `institutions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projects_ibfk_34` FOREIGN KEY (`projectManagerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Research projects within institutions';

-- Listage des données de la table lab_platform.projects : ~0 rows (environ)
DELETE FROM `projects`;

-- Listage de la structure de table lab_platform. purchase_requests
CREATE TABLE IF NOT EXISTS `purchase_requests` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each purchase request',
  `itemName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the item to purchase - cannot be empty',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Detailed description of the item and purpose',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Quantity requested - must be positive',
  `estimatedPrice` decimal(15,2) NOT NULL COMMENT 'Estimated price per unit - must be non-negative',
  `totalPrice` decimal(15,2) DEFAULT NULL COMMENT 'Total price (quantity × estimatedPrice), calculated automatically',
  `status` enum('DRAFT','PENDING','APPROVED','REJECTED','DELIVERED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT' COMMENT 'Current status in the purchase request lifecycle',
  `projectId` int NOT NULL COMMENT 'Foreign key to project (Project contains PurchaseRequests)',
  `requestedById` int NOT NULL COMMENT 'Foreign key to user who created this request',
  `reviewedById` int DEFAULT NULL COMMENT 'Foreign key to Admin/LabHead who approved/rejected this request',
  `reviewedAt` datetime DEFAULT NULL COMMENT 'Timestamp when the request was approved/rejected',
  `deliveredAt` datetime DEFAULT NULL COMMENT 'Timestamp when the items were delivered',
  `rejectionReason` text COLLATE utf8mb4_unicode_ci COMMENT 'Reason for rejection (if status is REJECTED)',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes or comments',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_item` (`itemName`),
  KEY `idx_purchase_status` (`status`),
  KEY `idx_purchase_project` (`projectId`),
  KEY `idx_purchase_requester` (`requestedById`),
  KEY `idx_purchase_reviewer` (`reviewedById`),
  KEY `idx_purchase_dates` (`createdAt`,`reviewedAt`,`deliveredAt`),
  KEY `idx_purchase_project_status` (`projectId`,`status`),
  CONSTRAINT `purchase_requests_ibfk_49` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchase_requests_ibfk_50` FOREIGN KEY (`requestedById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `purchase_requests_ibfk_51` FOREIGN KEY (`reviewedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Purchase requests within projects with status lifecycle';

-- Listage des données de la table lab_platform.purchase_requests : ~0 rows (environ)
DELETE FROM `purchase_requests`;

-- Listage de la structure de table lab_platform. teams
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `expertise` text COLLATE utf8mb4_unicode_ci,
  `objectives` text COLLATE utf8mb4_unicode_ci,
  `display_order` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table lab_platform.teams : ~4 rows (environ)
DELETE FROM `teams`;
INSERT INTO `teams` (`id`, `name`, `description`, `expertise`, `objectives`, `display_order`, `created_at`, `updated_at`) VALUES
	(1, 'Équipe Techniques Radiochimiques', 'Cette équipe se concentre sur le développement et l\'application des techniques radiochimiques pour la sécurité alimentaire et la protection de l\'environnement.', 'Analyse par activation neutronique, spectrométrie gamma, radioprotection, contrôle qualité alimentaire, surveillance environnementale', 'Développer des méthodes d\'analyse radiochimique de haute précision. Contribuer à la sécurité alimentaire par le contrôle des contaminants. Surveiller la radioactivité environnementale. Assurer la formation dans le domaine de la radioprotection.', 1, '2026-01-07 11:14:07', '2026-01-07 11:14:07'),
	(2, 'Équipe Matériaux Irradiés', 'Cette équipe étudie le comportement des matériaux sous irradiation, avec des applications en dosimétrie et en production d\'énergie.', 'Dosimétrie par thermoluminescence, caractérisation de matériaux irradiés, effets de l\'irradiation, développement de dosimètres, applications énergétiques', 'Caractériser les modifications induites par l\'irradiation dans les matériaux. Développer de nouveaux systèmes dosimétriques. Étudier les applications énergétiques des matériaux irradiés. Contribuer à la radioprotection par la dosimétrie.', 2, '2026-01-07 11:14:07', '2026-01-07 11:14:07'),
	(3, 'Équipe Modélisation Physique des Systèmes Nucléaires', 'Cette équipe développe des modèles théoriques et des simulations numériques pour la compréhension et l\'optimisation des systèmes nucléaires.', 'Modélisation Monte Carlo, calculs neutroniques, simulation de réacteurs, codes de calcul (MCNP, GEANT4), physique des réacteurs', 'Développer des modèles de simulation précis pour les systèmes nucléaires. Optimiser les configurations de réacteurs de recherche. Étudier la neutronique et la protection radiologique. Former aux techniques de modélisation nucléaire.', 3, '2026-01-07 11:14:07', '2026-01-07 11:14:07'),
	(4, 'Équipe Instrumentation Nucléaire Haute Résolution', 'Cette équipe conçoit et développe des systèmes de détection et de mesure nucléaire de haute précision.', 'Détecteurs à semi-conducteurs, électronique nucléaire, systèmes d\'acquisition de données, spectrométrie haute résolution, développement instrumental', 'Concevoir et réaliser des instruments de mesure nucléaire innovants. Améliorer les performances des systèmes de détection. Développer l\'électronique associée aux détecteurs. Transférer les technologies développées vers les applications industrielles.', 4, '2026-01-07 11:14:07', '2026-01-07 11:14:07');

-- Listage de la structure de table lab_platform. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant unique pour chaque utilisateur',
  `firstName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User first name from UML diagram',
  `lastName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User last name from UML diagram',
  `nationalId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unique national identification number',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User email address for authentication and communication',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Bcrypt hashed password for secure authentication',
  `role` enum('admin','projectManager','member') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member' COMMENT 'User role controlling access permissions:\n      - admin: LabHead from UML, has full access to all resources, can validate purchase requests and supervise projects\n      - projectManager: Can create and manage projects, submit purchase requests\n      - member: Can view assigned projects and articles, limited access',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','DISABLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT 'User account status for approval workflow:\n      - PENDING: New registration awaiting Lab Head approval, cannot login\n      - APPROVED: Approved by Lab Head, can login and access system\n      - REJECTED: Registration rejected by Lab Head, cannot login or re-register\n      - DISABLED: Previously approved user has been disabled, cannot login',
  `approvedById` int DEFAULT NULL COMMENT 'ID of admin who approved/rejected this user',
  `approvedAt` datetime DEFAULT NULL COMMENT 'Timestamp when user was approved/rejected',
  `rejectionReason` text COLLATE utf8mb4_unicode_ci COMMENT 'Reason for account rejection if status is REJECTED',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nationalId` (`nationalId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nationalId_2` (`nationalId`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `nationalId_3` (`nationalId`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `nationalId_4` (`nationalId`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `nationalId_5` (`nationalId`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `nationalId_6` (`nationalId`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `nationalId_7` (`nationalId`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `nationalId_8` (`nationalId`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `nationalId_9` (`nationalId`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `nationalId_10` (`nationalId`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `nationalId_11` (`nationalId`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `nationalId_12` (`nationalId`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `nationalId_13` (`nationalId`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `nationalId_14` (`nationalId`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `nationalId_15` (`nationalId`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `nationalId_16` (`nationalId`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `nationalId_17` (`nationalId`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `nationalId_18` (`nationalId`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `nationalId_19` (`nationalId`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `nationalId_20` (`nationalId`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `nationalId_21` (`nationalId`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `nationalId_22` (`nationalId`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `nationalId_23` (`nationalId`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `nationalId_24` (`nationalId`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `nationalId_25` (`nationalId`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `nationalId_26` (`nationalId`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `nationalId_27` (`nationalId`),
  UNIQUE KEY `nationalId_28` (`nationalId`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `nationalId_29` (`nationalId`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `nationalId_30` (`nationalId`),
  UNIQUE KEY `email_29` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_nationalId` (`nationalId`),
  KEY `idx_role` (`role`),
  KEY `fk_users_approver` (`approvedById`),
  CONSTRAINT `fk_users_approver` FOREIGN KEY (`approvedById`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`approvedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des utilisateurs avec contrôle d''accès basé sur les rôles';

-- Listage des données de la table lab_platform.users : ~6 rows (environ)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `firstName`, `lastName`, `nationalId`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `status`, `approvedById`, `approvedAt`, `rejectionReason`) VALUES
	(1, 'Lab', 'Administrator', 'ADMIN001', 'admin@lab.com', '$2a$10$Le6rZJ5DyZJx/v5CVMxr3.FVEsRcgtwPLPR8pHdII952PObNznKG6', 'admin', '2026-01-05 14:40:21', '2026-01-05 14:02:38', 'APPROVED', NULL, '2026-01-06 11:20:42', NULL),
	(2, 'Ramzi', 'Dridi', '147', 'dridir844@gmail.com', '$2a$10$UcnQAz3NFgiGjVRbv9J3xesrX.xtfBVZjwxXJhOO9QPOaw/LMcfWu', 'member', '2026-01-06 10:33:01', '2026-01-06 10:40:37', 'APPROVED', 1, '2026-01-06 10:40:37', NULL),
	(3, 'Ramz', 'Drid', 'dr@gmail.com', 'dr@gmail.com', '$2a$10$5UVmSUp8Y3crIN9uociW3OTFc85TClvC5NV5PYhR8bZFK64OVP1Ty', 'projectManager', '2026-01-06 11:36:16', '2026-01-06 13:48:49', 'APPROVED', 1, '2026-01-06 13:48:49', NULL),
	(4, 'ar', 'ar', '145', 'ar@gmail.com', '$2a$10$ao0FTakvFy./G1wjwyEqv.nz2IZ4HHfQdBrsIV.RjKlW1tSBZoF/G', 'member', '2026-01-06 13:41:00', '2026-01-06 13:45:11', 'REJECTED', 1, '2026-01-06 13:45:11', 'No reason provided'),
	(5, 'ah', 'ah', '148', 'ah@gmail.com', '$2a$10$GUXW37ydzQcwqPwgCTjZ4O1KxdgSyUFdRbaobci.bip0AtVo0t5/e', 'member', '2026-01-06 13:43:23', '2026-01-06 13:46:57', 'REJECTED', 1, '2026-01-06 13:46:57', 'spam'),
	(6, 'ahr', 'ahr', '143', 'ahr@gmail.com', '$2a$10$CA/MWqPecZhFUUoQ58cQxuhAJjsnD9RPaUxJngulG2n2eMaOxF0km', 'member', '2026-01-06 13:44:28', '2026-01-06 13:44:28', 'PENDING', NULL, NULL, NULL),
	(7, 'rr', 'rr', '165', 'rr@gmail.com', '$2a$10$YzYfEf1mw1mKkIV/G4zKo.EJBP6YxGu2w1SJCxXt2ILbgNFHWlofq', 'member', '2026-01-07 08:38:14', '2026-01-08 09:41:14', 'REJECTED', 1, '2026-01-08 09:41:14', 'sapm');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
