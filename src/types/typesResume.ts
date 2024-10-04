interface ProfileLinks{
    name: string,
    url: string
}

interface CurrentPostition{
    namePosition: string,
    nameCompany: string,
    workingHours: string 
}

interface DateBirth{
    day: string,
    month: string,
    year: string
}

export interface BasicInfo{
    firstName: string,
    lastName: string,
    patronymic: string,
    gender: string,
    city: string,
    workPermit: string[],
    citizenship: string[],
    dateBirth: DateBirth,
    // desiredPosition: string,
    // currentPostition: CurrentPostition, 
    elAddress: string,
    phoneNumber: string,
    // profileLinks: ProfileLinks[]
}

//добавлено из BasicInfo
interface Others{
    desiredPosition: string,
    currentPostition: CurrentPostition, 
    profileLinks: ProfileLinks[]
}

//skils types
interface Skils{
    stack: string,
    progrLanguages: string[],
    frameworks: string[],
    db: string[],
    operSystem: string[],
    additionalSkils: string
}

interface ProjectLinks{
    name: string,
    url: string,
    description: string
}

interface Portfolio{
    projects: string,
    projectsLinks: ProjectLinks[]
}

export interface Education{
    educationClass: string,
    nameInstituation?: string,
    faculty?: string,
    yearGraduation?: string
}

export type Resume = {
    idResume: number,
    nameResume: string,
    isResumeCompleted: boolean,
    basicInfo?: BasicInfo,
    education?: Education,
    skils?: Skils,
    portfolio?: Portfolio,
}

export type ResumeState = {
    resumesState: Resume[]
}
