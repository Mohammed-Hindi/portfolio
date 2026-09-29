// ============================================
// Skills Data
// ============================================

export const skills = {
  frontend: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'Vue.js', level: 'Advanced' },
    { name: 'HTML/CSS', level: 'Advanced' },
    { name: 'Tailwind CSS', level: 'Advanced' },
    { name: 'Bootstrap', level: 'Advanced' },
    { name: 'Axios', level: 'Intermediate' },
    { name: 'Pinia', level: 'Intermediate' },
  ],
    backend: [
    { name: 'PHP', level: 'Advanced' },
    { name: 'Laravel', level: 'Advanced' },
    { name: 'Eloquent ORM', level: 'Advanced' },
    { name: 'REST APIs', level: 'Advanced' },
    { name: 'Laravel Sanctum', level: 'Advanced' },
    { name: 'MySQL', level: 'Intermediate' },
    { name: 'Python', level: 'Intermediate' },
  ],
  tools: [
    { name: 'Git', level: 'Intermediate' },
    { name: 'GitHub', level: 'Advanced' },
    { name: 'VS Code', level: 'Advanced' },
    { name: 'Postman', level: 'Advanced' },
    { name: 'Laragon', level: 'Advanced' },
    { name: 'Composer', level: 'Intermediate' },
    { name: 'Vite', level: 'Intermediate' },
  ],
};

// ============================================
// Projects Data
// ============================================

export const projects = [
  {
    id: 'masar',
    title: 'Masar Platform',
    category: 'Graduation Project',
    year: '2026',

    description:
      'An end-to-end academic project management platform that digitizes the graduation project lifecycle, from proposal submission and stage tracking to meetings, evaluation, and final archiving.',

    role:
      'Full-Stack Developer',

    stack: [
      'Laravel',
      'Eloquent ORM',
      'Laravel Sanctum',
      'Vue.js',
      'Pinia',
      'MySQL',
      'RESTful APIs',
      'Ollama LLM'
    ],

    highlights: [
      'MVC architecture',
      '93RESTful API endpoints',
      'Five-role permission system',
      'Multi-role Vue.js interfaces',
      'Localized LLM integration',
      'Academic project lifecycle management'
    ],

    roles: [
      'Super Admin',
      'Supervision Committee',
      'Academic Supervisor',
      'Team Leader',
      'Student'
    ],

    github: {
      backend: 'https://github.com/iMumd/Mashroui',
      frontend: 'https://github.com/Mohammed-Hindi/Mafhroui-Vue'
    },

    liveUrl: 'https://masar.slidd.app/',

    caseStudy: {
      problem:
        'Graduation projects involve multiple stages, users, documents, meetings, evaluations, and approvals. Managing this workflow manually makes tracking and coordination difficult.',

      solution:
        'Masar provides a centralized platform for managing the complete academic project lifecycle while giving each user role the tools and permissions required for its responsibilities.',

      architecture:
        'The platform follows an MVC-based Laravel backend with a relational MySQL database and a Vue.js frontend communicating through RESTful APIs.',

      backend:
        'Engineered approximately 68–70 RESTful API endpoints using Laravel and Eloquent ORM, secured with Laravel Sanctum authentication and a custom role-permission system.',

      frontend:
        'Built multi-role Vue.js interfaces and managed application state with Pinia to keep project workflows consistent across different user roles.',

      ai:
        'Integrated an Ollama-powered localized LLM chatbot to assist students with project ideation and structured proposal generation.',

      outcome:
        'Designed with institutional adoption in mind, with an architecture intended to scale to more than 3,000 users.'
    }
  },


  // ==========================================
  // Project 02
  // ==========================================

  {
    id: 'specialty-recommendation',
    title: 'AI-Driven Specialty Recommendation System',
    category: 'Academic Platform',
    year: '2026',

    description:
      'An academic pathway assessment platform that recommends university majors based on high-school tracks, grades, and questionnaire responses.',

    role:
      'Full-Stack Developer',

    stack: [
      'Laravel',
      'Vue.js',
      'MySQL',
      'Gemini API'
    ],

    highlights: [
      'Academic pathway assessment',
      'Holland-based questionnaire',
      'AI-powered recommendations',
      'Dynamic student evaluation',
      'Responsive Vue.js interface'
    ],

    github: {
      repository:
        'https://github.com/Mohammed-Hindi/Specialty-Recommendation-System'
    },

    liveUrl: null,

    caseStudy: {
      problem:
        'Students finishing high school may struggle to determine which university specialty matches their interests, personality, academic background, and available study tracks.',

      solution:
        'The system combines questionnaire responses and academic information to generate recommendations for university majors.',

      architecture:
        'A Laravel backend API handles the assessment logic and data processing while Vue.js provides the interactive student interface.',

      ai:
        'Integrated the Google Gemini API to process questionnaire responses and generate compatibility scores for matching students with suitable majors.',

      validation:
        'The system was piloted with more than 20 recent high-school graduates to evaluate the recommendation experience.'
    }
  },


  // ==========================================
  // Project 03
  // ==========================================

  {
    id: 'rimal-restaurant',
    title: 'Rimal Restaurant E-Menu & Ordering System',
    category: 'Business System',
    year: '2026',

    description:
      'A digital e-menu and restaurant ordering system designed to replace paper-based workflows and connect waitstaff, cashier, and kitchen operations.',

    role:
      'Full-Stack Developer',

    stack: [
      'PHP',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Bootstrap',
      'MySQL'
    ],

    highlights: [
      'Digital e-menu',
      'Restaurant ordering workflow',
      'Multi-user operational interface',
      'Waitstaff → Cashier → Kitchen workflow',
      'MySQL database optimization'
    ],

    github: {
      frontend:
        'https://github.com/Mohammed-Hindi/al-remal-frontend',

      backend:
        'https://github.com/Mohammed-Hindi/al-remal-backend'
    },

    liveUrl: 'https://alremal.9ninmedia.com/login',

    caseStudy: {
      problem:
        'Paper-based restaurant ordering can create delays and mismatches when orders move between waitstaff, cashier, and kitchen staff.',

      solution:
        'The system digitizes the restaurant ordering workflow and provides connected interfaces for different operational roles.',

      workflow:
        'Waitstaff → Cashier → Kitchen',

      backend:
        'Built the backend and database layer with PHP and MySQL, including query optimization for improved reliability during operational peak periods.',

      frontend:
        'Developed responsive interfaces using HTML5, CSS3, JavaScript, and Bootstrap for the different operational users.'
    }
  }
];