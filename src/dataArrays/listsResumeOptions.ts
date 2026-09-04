import { busyness, currenySalary, levelIsResume, statusSearchResume, workFormat } from "../types/typesResume";

export const arrStatusSearchResume: Array<statusSearchResume> = [
    'Actively looking for a job',
    'Considering offers',
    'Offered a job, still deciding',
    'Starting a new job soon',
    'Not looking for a job'
];

export const arrBusynessResume: Array<busyness> = [
    'Permanent job',
    'Part-time job',
    'Internship'
];

export const arrWorkFormatResume: Array<workFormat> = [
    'On-site',
    'Remote',
    'Hybrid'
];

export const arrCurrencyResume: Array<currenySalary> = [
    'USD',
    'EUR',
    'GBP',
    'RUB',
    'KZT',
    'UAH'
];

export const arrLevelsGradeResume: Array<levelIsResume> = [
    'Intern',
    'Junior',
    'Middle',
    'Senior'
];
