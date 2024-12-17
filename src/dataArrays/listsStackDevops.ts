export const arrayStacks: Array<string> = [
    'Backend Development', 
    'Full-stack Development', 
    'Mobile Development', 
    'Web Frontend Development',
    'Lead Developer',
    'Team Lead',
    'DevOps Engineer',
    'QA Engineer'
];

//additional skills
export const arrTestTagesSearch: Array<string> = [
    'JUnit', 'Mocha', 'Jest', 'Postman'
]

export const arrApiTagesSearch: Array<string> = [
    'RESTful', 'SOAP', 'OpenAPI'
]

export const arrInstrumentalDevsTagesSearch: Array<string> = [
    'Git', 'Docker', 'Webpack', 'Jenkins', 'GitLab CI'
]

//roles devs
export const arrBackTagsSearch: Array<string> = [
    'Django', 'Flask', 'Spring Boot', 'Express.js', 'Ruby on Rails', 
    'Laravel', 'NestJS', 'Gin', 'Python', 'Java', 'PHP', 'Ruby', 
    'Rust', 'Node.js', 'ASP.NET Core', 'C#', 'Kotlin', 'Go', 
    'Elixir', 'Hapi.js', 'Koa.js', 'Apache Kafka', 'Redis', 'RabbitMQ',
    'SQL', 'NoSQL', 'GraphQL',
    ...arrApiTagesSearch
];

export const arrFrontTagsSearch: Array<string> = [
    'Typescript', 'JavaScript', 'HTML', 'html', 'CSS', 'bootsctrap', 
    'React', 'Angular', 'Redux', 'Vuejs', 'Sass', 'Next.js', 'GraphQL', 
];

export const arrFullTagsSearch: Array<string> = 
[
    'Django', 'Flask', 'Spring Boot', 'Express.js', 'Ruby on Rails', 
    'Laravel', 'NestJS', 'Gin', 'Python', 'Java', 'PHP', 'Ruby', 'Rust',
    'Typescript', 'JavaScript', 'HTML', 'html', 'CSS', 'bootsctrap', 
    'React', 'Angular', 'Redux', 'Node.js', 'Go', '.NET', 'C#',
    'SQL', 'NoSQL', 'GraphQL'
]; 

export const arrMobileTagsSearch: Array<string> = [
    'Swift', 'Objective-C', 'Kotlin', 'Java', 'Flutter', 
    'React Native', 'Xamarin', 'Apache Cordova', 'Ionic'
];

export const arrLeadTagesSearch: Array<string> = [
    'Django', 'Flask', 'Spring Boot','React',
    'Python', 'Java', 'PHP', 'JavaScript', 'AWS', 'Azure',
    ...arrApiTagesSearch,
    ...arrInstrumentalDevsTagesSearch
]

export const arrTeamLeadTagesSearch: Array<string> = [
    'Angular', 'Node.js', 'Go', 'JavaScript', 'PHP',
    'Agile','Scrum',
    ...arrApiTagesSearch
]

export const arrDevOpsEngineerTagesSearch: Array<string> = [
    'AWS', 'Azure', 'Grafana', 'Prometheus',
    'Bush', 'PowerShell', 'Ansible', 'Puppet',
    'TCP/IP', 'HTTP', 'DNS', 'Python'
]

export const arrQaEngineerTagesSearch: Array<string> = [
    'Python', 'Java', 'JavaScript',
    'JIRA', 'TestRail',
    ...arrApiTagesSearch,
    ...arrInstrumentalDevsTagesSearch
]


// all tages
const allTags = [
    ...arrBackTagsSearch,
    ...arrFrontTagsSearch,
    ...arrFullTagsSearch,
    ...arrMobileTagsSearch,
    ...arrTestTagesSearch,
    ...arrInstrumentalDevsTagesSearch,
    ...arrApiTagesSearch,
    ...arrDevOpsEngineerTagesSearch,
    ...arrQaEngineerTagesSearch,
    ...arrTeamLeadTagesSearch,
    ...arrLeadTagesSearch,
    'English language'
];

export const arrAllTagesSearch: Array<string> = allTags.filter((value, index, self) => 
    self.indexOf(value) === index
);
