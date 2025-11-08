export const windowData = [
  {
    id: 'hero',
    title: 'Hero',
    description: 'Welcome to my portfolio',
    icon: 'star',
    type: 'hero'
  },
  {
    id: 'about',
    title: 'About',
    description: 'Learn more about me',
    icon: 'user',
    type: 'content'
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'My technical expertise',
    icon: 'code',
    type: 'content'
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'My latest work',
    icon: 'briefcase',
    type: 'content'
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'What clients say',
    icon: 'comments',
    type: 'content'
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Get in touch',
    icon: 'envelope',
    type: 'content'
  }
];

export const skillsData = [
  // Frontend
  { name: 'React', level: 40, icon: 'react', category: 'Frontend' },
  { name: 'Next.js', level: 45, icon: 'code', category: 'Frontend' },
  { name: 'TypeScript', level: 55, icon: 'js', category: 'Language' },
  { name: 'HTML', level: 65, icon: 'html5', category: 'Frontend' },
  { name: 'CSS', level: 60, icon: 'css3', category: 'Styling' },
  { name: 'Tailwind CSS', level: 58, icon: 'palette', category: 'Styling' },

  // Backend
  { name: 'Node.js', level: 57, icon: 'server', category: 'Backend' },
  { name: 'Python', level: 68, icon: 'python', category: 'Language' },
  { name: 'Database Design', level: 55, icon: 'database', category: 'Backend' },
  { name: 'API Development', level: 54, icon: 'cloud', category: 'Backend' },
  { name: 'Cloud Deployment', level: 53, icon: 'cloud', category: 'Backend' },

  // Full-Stack / DevOps
  { name: 'Authentication', level: 50, icon: 'lock', category: 'Full-Stack' },
  { name: 'DevOps', level: 45, icon: 'cogs', category: 'Full-Stack' },
  { name: 'End-to-end Development', level: 40, icon: 'layers', category: 'Full-Stack' },

  // Game Development
  { name: 'Unreal Engine', level: 60, icon: 'gamepad', category: 'Game Dev' },
  { name: 'C++', level: 57, icon: 'c', category: 'Language' },
  { name: 'Blueprint', level: 65, icon: 'project-diagram', category: 'Game Dev' },
  { name: 'Blender', level: 45, icon: 'cube', category: 'Game Dev' },
  { name: '3D Modeling', level: 56, icon: 'cube', category: 'Game Dev' },
  { name: 'Level Design', level: 57, icon: 'map', category: 'Game Dev' },

  // Other / Personal Projects
  { name: 'Java', level: 45, icon: 'coffee', category: 'Language' },
  { name: 'VPS / Server Management', level: 67, icon: 'server', category: 'Other' },
  { name: 'Troubleshooting & Hardware', level: 60, icon: 'tools', category: 'Other' }
];


export const projectsData = [
  {
    id: 1,
    title: 'Dungeon Escape',
    description: 'A first-person puzzle escape game built in Unreal Engine 5.',
    technologies: ['Unreal Engine 5', 'C++', 'Blueprints'],
    image: 'https://img.itch.zone/aW1nLzIzMzE3MzI2LnBuZw==/315x250%23c/L%2FX08m.png', 
    github: '',
    live: 'https://jellybeancb.itch.io/dungeon-escape',
    featured: true
  },
  {
    id: 2,
    title: 'Simple Shooter',
    description: 'Third-person action shooter prototype with Unreal Engine.',
    technologies: ['Unreal Engine', 'C++'],
    image: 'https://img.itch.zone/aW1nLzIzMzE2OTY0LnBuZw==/315x250%23c/lqXVWH.png',
    github: '',
    live: 'https://jellybeancb.itch.io/simple-shooter',
    featured: true
  },
  {
    id: 3,
    title: 'Obstacle Assault',
    description: 'Platformer obstacle course game in UE5.',
    technologies: ['Unreal Engine', 'Blueprints'],
    image: 'https://img.itch.zone/aW1hZ2UvMzkwODMxOS8yMzMxNzMwNC5wbmc=/347x500/%2FCYogb.png',
    github: '',
    live: 'https://jellybeancb.itch.io/obstacle-assault',
    featured: false
  },
  {
    id: 4,
    title: 'Obstacle Assault Vol. 2',
    description: 'A dynamic platforming challenge built in Unreal Engine 5.',
    technologies: ['Unreal Engine 5', 'C++'],
    image: 'https://img.itch.zone/aW1hZ2UvMzkwODI4MC8yMzMxNzI1OC5wbmc=/347x500/7BnV49.png',
    github: '',
    live: 'https://jellybeancb.itch.io/obstacle-assault-vol-2',
    featured: true
  },
  {
    id: 5,
    title: 'Battle Blaster',
    description: 'An action-packed tank combat game built in Unreal Engine 5.',
    technologies: ['Unreal Engine 5', 'C++'],
    image: 'https://img.itch.zone/aW1hZ2UvMzY5MjcwMi8yMzMxNzExNy5wbmc=/347x500/rS%2FQJa.png',
    github: '',
    live: 'https://jellybeancb.itch.io/battle-blaster',
    featured: true
  }
];


export const testimonialsData = [
  {
    id: 1,
    name: 'Bluestorm gifts Web Manager',
    role: 'Web Manager, Bluestormgifts.co.za',
    content: 'Cruz set up and managed our VPS with incredible professionalism. The server runs smoothly and securely, and communication throughout the process was excellent.',
    avatar: 'https://bluestormgifts.co.za/wp-content/uploads/2024/08/cropped-Blue-storm-Uv-print-logo-single.png', // placeholder avatar
    rating: 5
  }
];


export const servicesData = [
  {
    id: 1,
    title: 'Frontend Development',
    description: 'Modern, responsive web applications using React, Next.js, and TypeScript',
    icon: 'code',
    features: ['React/Next.js', 'TypeScript', 'Responsive Design', 'Performance Optimization']
  },
  {
    id: 2,
    title: 'Backend Development',
    description: 'Scalable server-side solutions with Node.js, Python, and cloud services',
    icon: 'server',
    features: ['Node.js/Python', 'Database Design', 'API Development', 'Cloud Deployment']
  },
  {
    id: 3,
    title: 'Full-Stack Solutions',
    description: 'Complete web applications from concept to deployment',
    icon: 'layers',
    features: ['End-to-end Development', 'Database Integration', 'Authentication', 'DevOps']
  },
  {
    id: 4,
    title: 'Game Development',
    description: 'Creating interactive games and experiences with Unreal Engine and Blender',
    icon: 'gamepad',
    features: ['C++ / Blueprint scripting', '3D modeling & animation', 'Level design & world building', 'Gameplay prototyping']
  },
  {
    id: 5,
    title: 'Hands-On Tech Experience',
    description: 'Learning through tinkering and problem-solving with guidance from my parents',
    icon: 'tools',
    features: [
      'Fixing hardware, soldering, and understanding components with my dad',
      'Exploring Java and web development with my mom',
      'Troubleshooting PC upgrades and learning from mistakes'
    ]
  },
  {
    id: 6,
    title: 'VPS & Server Management',
    description: 'Setting up and managing VPS for Minecraft servers and client websites',
    icon: 'server',
    features: ['Configuring VPS', 'Deploying Minecraft servers', 'Hosting websites', 'Managing server resources']
  }
];



export const contactInfo = {
  email: 'Jessechettyreal@gmail.com',
  phone: '+27 66 371 8217',
  location: 'Johannesburg',
  social: {
    //github: 'https://github.com',
    //linkedin: 'https://linkedin.com',
    //twitter: 'https://twitter.com'
  }
};

