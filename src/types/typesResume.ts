

export interface Post {
    postName: string,
    descriptionPost: string
}

export type post = Post[];

export interface Positions {
    [key: string]: any;
    idPosition?: number,
    nameCompany?: string,
    cityCompany?: string,
    post?: Post[],
    workingTime?: WorkingTime,
}

export interface Date {
    year: number,
    month: number
}

export interface WorkingTime {
    sinceDate: string,
    toDate: string,
    countTime?: Date
}


export interface DateBirth {
    day?: string,
    month?: string,
    year?: string
}

export interface BasicInfo {
    firstName?: string,
    lastName?: string,
    patronymic?: string,
    gender?: string,
    city?: string,
    workPermit?: string[],
    citizenship?: string[],
    socialContactsLinks?: ContactLinks[],
    dateBirth?: DateBirth,
    elAddress?: string,
    phoneNumber?: string,
}

export interface ContactLinks {
    nameSelectedSocial: string,
    link: string
}

export type SocialNetwork = 'facebook' | 'twitter' | 'vk' | 'instagram' | 'pinterest' | 'telegram';

//skils types
export type skills = string[];


export interface ProjectsProfileLinks {
    nameLink: string,
    url: string
}

export interface Education {
    educationClass?: string,
    nameInstituation?: string,
    faculty?: string,
    yearGraduation?: string
}

type workResume = string;
// a - Yes, i have commercial experience
// b - No, but I have pet projects
// c -I have no pet projects and commercial experience

export interface Projects {
    idProject: number,
    name: string,
    description: string,
    url: string
}

export type statusSearchResume = 
'Actively looking for a job' | 'Considering offers' | 
'Offered a job, still deciding' | 'Starting a new job soon' |
'Not looking for a job'

export type levelIsResume = 
'Intern' | 'Junior' | 
'Middle' | 'Senior'

export type currenySalary = 
'USD' | 'EUR' | 'GBP'|
'RUB' | 'KZT' | 'UAH'

export type workFormat = 'On-site' | 'Remote' | 'Hybrid'

export type busyness = 'Permanent job' | 'Part-time job' | 'Internship'

export interface Salary {
    currency: currenySalary | undefined,
    amount: string
}

export interface WorkingConditions {
    salary?: Salary,
    descriptionResume: string,
    busyness?: busyness[], //занятость
    workFormat?: workFormat[] //формат работы
}

export type Resume = {
    idResumeDb?: string,
    nameResume?: string,
    isResumeCompleted?: boolean,
    basicInfo?: BasicInfo,
    education?: Education,
    skills?: skills,
    projectsProfile?: ProjectsProfileLinks[],
    typeWorkResume?: workResume,
    positions?: Positions[],
    petProjects?: Projects[],
    amountTimeWorked?: Date | string,
    statusSearchResume?: statusSearchResume,
    levelIsResume?: levelIsResume,
    salary?: Salary,
    descriptionResume?: string,
    busyness?: string[], //занятость
    workFormat?: string[], //формат работы
    photo?: string // фото резюме
}

export type ResumeState = {
    resumesState: Resume
}
