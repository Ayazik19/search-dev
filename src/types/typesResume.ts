

export interface Post {
    postName: string,
    descriptionPost: string
}

export type post = Post[];

export interface Positions {
    [key: string]: any;
    idPosition?: number,
    generalTimeWork?: string,
    nameCompany?: string,
    cityCompany?: string,
    post?: Post[],
    workingTime?: WorkingTime,
}

export interface Date{
    year: number,
    month: number
}

export interface WorkingTime {
    sinceDate: string,
    toDate: string,
    countTime?: Date
}


interface DateBirth {
    day: string,
    month: string,
    year: string
}

export interface BasicInfo {
    firstName: string,
    lastName: string,
    patronymic: string,
    gender: string,
    city: string,
    workPermit: string[],
    citizenship: string[],
    dateBirth: DateBirth,
    elAddress: string,
    phoneNumber: string,
}


//skils types
export type skills = string[];


export interface ProfileLinks {
    nameLink: string,
    url: string
}

export interface Education {
    educationClass: string,
    nameInstituation?: string,
    faculty?: string,
    yearGraduation?: string
}

type workResume = string;
// a - Yes, i have commercial experience
// b - No, but I have pet projects
// c -I have no pet projects and commercial experience

export interface Projects{
    idProject: number,
    name: string,
    description: string,
    url: string
}

export type statusSearchResume = string
export type levelIsResume = string

export type Resume = {
    idResume: number,
    nameResume: string,
    isResumeCompleted: boolean,
    basicInfo?: BasicInfo,
    education?: Education,
    skills?: skills,
    profileLinks?: ProfileLinks[],
    typeWorkResume?: workResume,
    positions?: Positions[],
    petProjects?: Projects[],
    amountTimeWorked?: Date,
    statusSearchResume?: statusSearchResume,
    levelIsResume?: levelIsResume
}

export type ResumeState = {
    resumesState: Resume[]
}
