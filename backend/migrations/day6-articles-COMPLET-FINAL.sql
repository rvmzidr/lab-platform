-- ============================================================================
-- DAY 6: ARTICLES SCIENTIFIQUES - SCRIPT SQL COMPLET ET PRÊT À L'EMPLOI
-- ============================================================================
-- Date: 2026-01-12
-- Description: Création de la table articles avec données de test réalistes
-- Instructions: Copiez et collez ce script COMPLET dans phpMyAdmin
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: CRÉATION DE LA TABLE ARTICLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  abstract TEXT DEFAULT NULL,
  authors VARCHAR(500) NOT NULL,
  keywords VARCHAR(500) DEFAULT NULL,
  publicationDate DATE DEFAULT NULL,
  journal VARCHAR(255) DEFAULT NULL,
  doi VARCHAR(100) DEFAULT NULL UNIQUE,
  pdfUrl VARCHAR(500) DEFAULT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  visibility ENUM('public', 'members_only') NOT NULL DEFAULT 'members_only',
  userId INT NOT NULL,
  projectId INT DEFAULT NULL,
  teamId INT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_article_status (status),
  INDEX idx_article_visibility (visibility),
  INDEX idx_article_publication_date (publicationDate),
  INDEX idx_article_user (userId),
  INDEX idx_article_project (projectId),
  INDEX idx_article_team (teamId),
  
  CONSTRAINT fk_article_user 
    FOREIGN KEY (userId) REFERENCES users(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_article_project 
    FOREIGN KEY (projectId) REFERENCES projects(id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_article_team 
    FOREIGN KEY (teamId) REFERENCES teams(id) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Scientific articles published by the laboratory';


-- ============================================================================
-- ÉTAPE 2: INSERTION DES ARTICLES DE TEST
-- ============================================================================
-- Ces données utilisent les équipes créées dans day3-lab-info.sql
-- userId = 1 (admin par défaut)
-- teamId = 1,2,3,4 (les 4 équipes de recherche du laboratoire)
-- projectId = NULL ou 1,2,3 (si vous avez des projets existants)
-- ============================================================================

-- Article 1: PUBLIC - Équipe Techniques Radiochimiques
INSERT INTO articles (
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
  userId, 
  teamId
) VALUES (
  'Analyse par Activation Neutronique des Contaminants dans les Produits Alimentaires Tunisiens',
  'Cette étude présente une analyse complète des contaminants métalliques dans divers produits alimentaires tunisiens en utilisant la technique d''activation neutronique. Les résultats montrent des concentrations généralement inférieures aux normes internationales, avec quelques dépassements localisés nécessitant une surveillance continue. L''étude contribue à l''évaluation de la sécurité alimentaire en Tunisie et propose des recommandations pour le contrôle qualité.',
  'Ahmed Ben Salem, Fatma Mansouri, Leila Kallel, Mohamed Trabelsi',
  'activation neutronique, sécurité alimentaire, contaminants, spectrométrie gamma, Tunisie',
  '2024-09-15',
  'Journal of Radioanalytical and Nuclear Chemistry',
  '10.1007/s10967-024-09234-5',
  'https://doi.org/10.1007/s10967-024-09234-5',
  'published',
  'public',
  1,
  1
);

-- Article 2: PUBLIC - Équipe Matériaux Irradiés
INSERT INTO articles (
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
  userId, 
  teamId
) VALUES (
  'Development of New Thermoluminescent Dosimeters Based on Tunisian Natural Minerals',
  'We report on the development and characterization of novel thermoluminescent dosimeters using natural minerals found in Tunisia. The dosimetric properties including sensitivity, linearity, fading, and energy dependence were evaluated. These materials show promising characteristics for environmental radiation monitoring and personal dosimetry applications, offering a cost-effective alternative to commercial dosimeters.',
  'Nadia Khmiri, Omar Jebali, Sonia Mezghani, Tarek Abidi',
  'thermoluminescence, dosimetry, natural minerals, radiation detection, environmental monitoring',
  '2025-02-28',
  'Radiation Measurements',
  '10.1016/j.radmeas.2025.106892',
  'https://doi.org/10.1016/j.radmeas.2025.106892',
  'published',
  'public',
  1,
  2
);

-- Article 3: PUBLIC - Équipe Modélisation Physique
INSERT INTO articles (
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
  userId, 
  teamId
) VALUES (
  'Monte Carlo Simulation of Neutron Transport in Research Reactor Core Configurations',
  'This paper presents detailed Monte Carlo simulations of neutron transport in various research reactor core configurations using MCNP6 code. The study focuses on neutron flux distributions, reactivity parameters, and radiation shielding optimization. Simulation results were validated against experimental measurements, showing excellent agreement. The methodology provides a powerful tool for reactor design optimization and safety assessment.',
  'Khaled Gharbi, Mehdi Oueslati, Amal Zouari, Riadh Hamdi',
  'Monte Carlo, MCNP, neutron transport, reactor physics, nuclear safety',
  '2024-11-20',
  'Annals of Nuclear Energy',
  '10.1016/j.anucene.2024.110567',
  'https://doi.org/10.1016/j.anucene.2024.110567',
  'published',
  'public',
  1,
  3
);

-- Article 4: PUBLIC - Équipe Instrumentation Nucléaire
INSERT INTO articles (
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
  userId, 
  teamId
) VALUES (
  'Design and Performance Evaluation of a High-Resolution Gamma Spectrometry System',
  'We present the design, construction, and performance evaluation of a high-resolution gamma spectrometry system based on HPGe detector technology. The system features advanced digital signal processing, automated calibration procedures, and optimized shielding configuration. Performance tests demonstrate excellent energy resolution (0.8 keV at 122 keV) and low background levels, making it suitable for environmental radioactivity monitoring and nuclear forensics applications.',
  'Samira Bouden, Ines Bouazizi, Carlos Garcia, Jean-Pierre Dubois',
  'gamma spectrometry, HPGe detector, nuclear instrumentation, radiation measurement, digital signal processing',
  '2025-05-10',
  'Nuclear Instruments and Methods in Physics Research A',
  '10.1016/j.nima.2025.169234',
  'https://doi.org/10.1016/j.nima.2025.169234',
  'published',
  'public',
  1,
  4
);

-- Article 5: MEMBERS ONLY - Équipe Techniques Radiochimiques
INSERT INTO articles (
  title, 
  abstract, 
  authors, 
  keywords, 
  publicationDate, 
  journal, 
  status, 
  visibility, 
  userId, 
  teamId
) VALUES (
  'Protocoles Internes de Radioprotection pour les Laboratoires du CNSTN',
  'Ce rapport technique présente les protocoles mis à jour pour la radioprotection dans les laboratoires du Centre National des Sciences et Technologies Nucléaires. Il inclut les procédures de manipulation des sources radioactives, les protocoles de décontamination, les limites d''exposition recommandées, et les mesures d''urgence. Ces protocoles sont conformes aux normes internationales de l''AIEA et adaptés au contexte tunisien.',
  'Fatma Mansouri, Ahmed Kacem, Leila Bouguerra',
  'radioprotection, sécurité, protocoles, laboratoire, CNSTN',
  '2025-08-15',
  'Rapport Technique Interne CNSTN-RT-2025-003',
  'published',
  'members_only',
  1,
  1
);

-- Article 6: MEMBERS ONLY - Équipe Matériaux Irradiés
INSERT INTO articles (
  title, 
  abstract, 
  authors, 
  keywords, 
  publicationDate, 
  journal, 
  status, 
  visibility, 
  userId, 
  teamId
) VALUES (
  'Étude Préliminaire sur l''Effet de l''Irradiation Gamma sur les Polymères Locaux',
  'Rapport d''étude interne sur l''effet de l''irradiation gamma sur différents types de polymères produits localement en Tunisie. Les modifications structurales, mécaniques et optiques ont été caractérisées par diverses techniques analytiques. Les résultats préliminaires montrent des changements significatifs dans les propriétés des matériaux qui pourraient avoir des applications industrielles intéressantes.',
  'Nadia Khmiri, Tarek Abidi, Sonia Mezghani',
  'irradiation gamma, polymères, modifications structurales, applications industrielles',
  '2025-10-05',
  'Document de Travail Interne LR16CNSTN02',
  'published',
  'members_only',
  1,
  2
);

-- Article 7: DRAFT - Équipe Modélisation Physique
INSERT INTO articles (
  title, 
  abstract, 
  authors, 
  keywords, 
  journal, 
  status, 
  visibility, 
  userId, 
  teamId
) VALUES (
  'Optimization of Nuclear Waste Storage Configurations Using Multi-Physics Simulations',
  'This ongoing research investigates optimal configurations for nuclear waste storage using coupled neutronics-thermal-hydraulics simulations. Preliminary results indicate that specific geometric arrangements can significantly improve heat dissipation while maintaining subcriticality margins. Further validation through experimental benchmarks is in progress. Expected submission to Nuclear Engineering and Design in Q2 2026.',
  'Mehdi Oueslati, Khaled Gharbi, Riadh Hamdi',
  'nuclear waste, storage optimization, multi-physics simulation, thermal analysis, criticality safety',
  'Nuclear Engineering and Design (En préparation)',
  'draft',
  'members_only',
  1,
  3
);

-- Article 8: DRAFT - Équipe Instrumentation Nucléaire
INSERT INTO articles (
  title, 
  abstract, 
  authors, 
  keywords, 
  status, 
  visibility, 
  userId, 
  teamId
) VALUES (
  'Novel Silicon Carbide Detector for Harsh Environment Applications',
  'Work in progress on the development of a silicon carbide-based radiation detector capable of operating in high-temperature and high-radiation environments. Initial prototypes show promising radiation hardness and thermal stability. Characterization of detection efficiency and energy resolution is ongoing. Manuscript in preparation for submission to IEEE Transactions on Nuclear Science.',
  'Ines Bouazizi, Samira Bouden, Maria Rossi',
  'SiC detector, radiation hardness, high temperature, nuclear instrumentation, harsh environment',
  'draft',
  'members_only',
  1,
  4
);

-- Article 9: PUBLIC - Collaboration Internationale
INSERT INTO articles (
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
  userId
) VALUES (
  'Mediterranean Network for Nuclear Safety: Achievements and Future Perspectives',
  'This collaborative review summarizes five years of achievements by the Mediterranean Network for Nuclear Safety, involving research institutions from Tunisia, France, Italy, Spain, and Morocco. The network has facilitated knowledge exchange, joint research projects, and harmonization of safety standards. We present case studies, lessons learned, and strategic recommendations for strengthening regional cooperation in nuclear safety and security.',
  'Ahmed Kacem, Jean-Pierre Dubois, Maria Rossi, Carlos Garcia, Hassan El-Amrani, Fatma Mansouri',
  'nuclear safety, international collaboration, Mediterranean region, knowledge exchange, safety standards',
  '2024-12-10',
  'Nuclear Safety and Security Journal',
  '10.1016/j.nss.2024.11.008',
  'https://doi.org/10.1016/j.nss.2024.11.008',
  'published',
  'public',
  1
);

-- Article 10: PUBLIC - Environmental Monitoring
INSERT INTO articles (
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
  userId, 
  teamId
) VALUES (
  'Baseline Radioactivity Levels in Tunisian Coastal Sediments: A Comprehensive Survey',
  'This comprehensive study presents baseline radioactivity levels (natural and anthropogenic radionuclides) in coastal sediments along the Tunisian coastline. Samples were collected from 50 locations and analyzed using gamma spectrometry. Results indicate natural radioactivity levels comparable to global averages, with no evidence of significant anthropogenic contamination. The dataset provides valuable reference values for future environmental monitoring programs.',
  'Amal Zouari, Khaled Gharbi, Leila Kallel, Omar Jebali',
  'environmental radioactivity, coastal sediments, gamma spectrometry, baseline survey, Tunisia',
  '2025-07-22',
  'Journal of Environmental Radioactivity',
  '10.1016/j.jenvrad.2025.107089',
  'https://doi.org/10.1016/j.jenvrad.2025.107089',
  'published',
  'public',
  1,
  1
);


-- ============================================================================
-- ÉTAPE 3: VÉRIFICATION DES DONNÉES
-- ============================================================================

-- Afficher le résumé des articles insérés
SELECT 
    status,
    visibility,
    COUNT(*) as nombre_articles
FROM articles
GROUP BY status, visibility
ORDER BY status, visibility;

-- Afficher les articles par équipe
SELECT 
    t.name as equipe,
    COUNT(a.id) as nombre_articles,
    SUM(CASE WHEN a.status = 'published' AND a.visibility = 'public' THEN 1 ELSE 0 END) as publics,
    SUM(CASE WHEN a.status = 'published' AND a.visibility = 'members_only' THEN 1 ELSE 0 END) as internes,
    SUM(CASE WHEN a.status = 'draft' THEN 1 ELSE 0 END) as brouillons
FROM teams t
LEFT JOIN articles a ON t.id = a.teamId
GROUP BY t.id, t.name
ORDER BY t.id;

-- Lister tous les articles créés
SELECT 
    a.id,
    a.title,
    a.authors,
    a.status,
    a.visibility,
    t.name as equipe,
    a.publicationDate
FROM articles a
LEFT JOIN teams t ON a.teamId = t.id
ORDER BY a.id;


-- ============================================================================
-- RÉSUMÉ DE CE QUI A ÉTÉ CRÉÉ
-- ============================================================================

/*
ARTICLES PUBLICS (visible par tous):
- 6 articles publiés et publics
- Couvrant les 4 équipes de recherche + 1 collaboration internationale
- Avec DOI, PDF, journaux scientifiques réels

ARTICLES INTERNES (members_only):
- 2 rapports techniques internes
- Protocoles de sécurité et études préliminaires

ARTICLES EN BROUILLON (draft):
- 2 articles en cours de rédaction
- Soumissions prévues en 2026

TOTAL: 10 articles scientifiques représentatifs du laboratoire LR16CNSTN02

ÉQUIPES REPRÉSENTÉES:
1. Techniques Radiochimiques (teamId = 1) - 3 articles
2. Matériaux Irradiés (teamId = 2) - 3 articles  
3. Modélisation Physique (teamId = 3) - 2 articles
4. Instrumentation Nucléaire (teamId = 4) - 2 articles
*/


-- ============================================================================
-- COMMANDES UTILES POUR LA GESTION
-- ============================================================================

-- Publier un brouillon
-- UPDATE articles SET status = 'published', visibility = 'public' WHERE id = 7;

-- Rendre un article public
-- UPDATE articles SET visibility = 'public' WHERE id = 5;

-- Archiver un ancien article
-- UPDATE articles SET status = 'archived' WHERE id = 1;

-- Associer un article à un projet (si vous avez créé des projets)
-- UPDATE articles SET projectId = 1 WHERE id = 1;

-- Voir les articles qui seront visibles par le public
SELECT id, title, authors, publicationDate, journal
FROM articles 
WHERE status = 'published' AND visibility = 'public'
ORDER BY publicationDate DESC;

-- Compter les articles par année de publication
SELECT 
    YEAR(publicationDate) as annee,
    COUNT(*) as nombre
FROM articles
WHERE publicationDate IS NOT NULL
GROUP BY YEAR(publicationDate)
ORDER BY annee DESC;


-- ============================================================================
-- FIN DU SCRIPT - PRÊT À L'EMPLOI!
-- ============================================================================

/*
INSTRUCTIONS D'UTILISATION:

1. Ouvrez phpMyAdmin (Laragon)
2. Sélectionnez votre base de données: lab_platform
3. Cliquez sur l'onglet "SQL"
4. COPIEZ ET COLLEZ CE SCRIPT COMPLET
5. Cliquez sur "Exécuter"

RÉSULTAT ATTENDU:
✅ Table 'articles' créée avec indexes et contraintes
✅ 10 articles insérés avec données réalistes
✅ 6 articles publics visibles sur http://localhost:4200/articles
✅ 4 articles internes/draft visibles uniquement authentifié

APRÈS L'EXÉCUTION:
1. Démarrez le backend: cd backend && npm run dev
2. Démarrez le frontend: cd frontend && ng serve
3. Testez: http://localhost:4200/articles (mode public)
4. Testez: http://localhost:4200/dashboard/articles (admin)

Bon travail! 🎉
*/
