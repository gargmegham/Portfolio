module.exports = {
  siteTitle: 'Megham Garg | Software Engineer',
  siteDescription:
    'Megham Garg is a software engineer based in Haryana, India who is solving problems by creating software solutions.',
  siteKeywords:
    'megham garg, software developer, javascript, vue, react, python, django, ai, data science, machine learning',
  siteUrl: 'https://meghamgarg.com/',
  siteLanguage: 'en_US',
  name: 'Megham Garg',
  location: 'Haryana, India',
  email: 'meghamgarg@gmail.com',
  github: 'https://github.com/gargmegham/',
  twitterHandle: '@garg_megham',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/gargmegham/',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/megham-garg/',
    },
    {
      name: 'Star',
      url: 'https://www.upwork.com/freelancers/~0170461d5a03bcee8d',
    },
  ],
  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],
  navHeight: 100,
  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },
  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
