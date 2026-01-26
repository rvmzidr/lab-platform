-- ============================================================
-- DAY 3 - MIGRATION: INFORMATIONS DU LABORATOIRE
-- Création des tables pour le contenu statique public
-- ============================================================

-- Table pour les informations générales du laboratoire
CREATE TABLE IF NOT EXISTS lab_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    created_year INT NOT NULL,
    mission TEXT NOT NULL,
    presentation TEXT,
    context TEXT,
    objectives TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table pour les équipes de recherche
CREATE TABLE IF NOT EXISTS teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    expertise TEXT,
    objectives TEXT,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des informations du laboratoire
INSERT INTO lab_info (
    full_name, 
    short_name, 
    address, 
    created_year, 
    mission,
    presentation,
    context,
    objectives
) VALUES (
    'Laboratoire de Recherche en Energie et Matière pour le développement des sciences nucléaires (LR16CNSTN02)',
    'LR16CNSTN02',
    'Pôle Technologique. 2020 Sidi Thabet, Tunis, Tunisie',
    2016,
    'Applications pacifiques des sciences nucléaires pour le développement durable',
    'Le laboratoire LR16CNSTN02, créé en 2016, est situé au Pôle Technologique Sidi Thabet, Tunis. Il dispose d''une expertise héritée de l''ancienne unité de recherche UR04CNSTN02 "Maîtrise et développement des techniques nucléaires pour la protection de l''homme et de son environnement" et s''inscrit dans la continuité de ses travaux de recherche fondamentale et appliquée.',
    'Le Laboratoire de Recherche en Energie et Matière (LR16CNSTN02) s''inscrit dans le cadre des efforts nationaux pour le développement des applications pacifiques des sciences nucléaires. La maîtrise des technologies nucléaires représente un enjeu stratégique pour la Tunisie, notamment dans les domaines de la santé, de l''agriculture, de l''environnement et de l''énergie.',
    'Développer la recherche fondamentale et appliquée dans le domaine de l''énergie nucléaire et des matériaux. Contribuer au développement des applications pacifiques du nucléaire en Tunisie. Former des chercheurs et des ingénieurs hautement qualifiés. Renforcer la coopération scientifique nationale et internationale.'
);

-- Insertion des 4 équipes de recherche
INSERT INTO teams (name, description, expertise, objectives, display_order) VALUES
(
    'Équipe Techniques Radiochimiques',
    'Cette équipe se concentre sur le développement et l''application des techniques radiochimiques pour la sécurité alimentaire et la protection de l''environnement.',
    'Analyse par activation neutronique, spectrométrie gamma, radioprotection, contrôle qualité alimentaire, surveillance environnementale',
    'Développer des méthodes d''analyse radiochimique de haute précision. Contribuer à la sécurité alimentaire par le contrôle des contaminants. Surveiller la radioactivité environnementale. Assurer la formation dans le domaine de la radioprotection.',
    1
),
(
    'Équipe Matériaux Irradiés',
    'Cette équipe étudie le comportement des matériaux sous irradiation, avec des applications en dosimétrie et en production d''énergie.',
    'Dosimétrie par thermoluminescence, caractérisation de matériaux irradiés, effets de l''irradiation, développement de dosimètres, applications énergétiques',
    'Caractériser les modifications induites par l''irradiation dans les matériaux. Développer de nouveaux systèmes dosimétriques. Étudier les applications énergétiques des matériaux irradiés. Contribuer à la radioprotection par la dosimétrie.',
    2
),
(
    'Équipe Modélisation Physique des Systèmes Nucléaires',
    'Cette équipe développe des modèles théoriques et des simulations numériques pour la compréhension et l''optimisation des systèmes nucléaires.',
    'Modélisation Monte Carlo, calculs neutroniques, simulation de réacteurs, codes de calcul (MCNP, GEANT4), physique des réacteurs',
    'Développer des modèles de simulation précis pour les systèmes nucléaires. Optimiser les configurations de réacteurs de recherche. Étudier la neutronique et la protection radiologique. Former aux techniques de modélisation nucléaire.',
    3
),
(
    'Équipe Instrumentation Nucléaire Haute Résolution',
    'Cette équipe conçoit et développe des systèmes de détection et de mesure nucléaire de haute précision.',
    'Détecteurs à semi-conducteurs, électronique nucléaire, systèmes d''acquisition de données, spectrométrie haute résolution, développement instrumental',
    'Concevoir et réaliser des instruments de mesure nucléaire innovants. Améliorer les performances des systèmes de détection. Développer l''électronique associée aux détecteurs. Transférer les technologies développées vers les applications industrielles.',
    4
);

-- ============================================================
-- FIN DE LA MIGRATION DAY 3
-- ============================================================
