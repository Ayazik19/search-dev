interface SocialLinksFormat{
    name: string,
    link: string[]
}

export const arrSocialLinks: SocialLinksFormat[] = [
    {
        name: 'facebook',
        link: ['https://www.facebook.com/'],
    },
    {
        name: 'instagram',
        link: ['https://www.instagram.com/'],
    },
    {
        name: 'twitter',
        link: ['https://www.x.com/', 'https://www.twitter.com/'],
    },
    {
        name: 'pinterest',
        link: ['https://ru.pinterest.com/'],
    },
    {
        name: 'vk',
        link: ['https://vk.com/'],
    },
    {
        name: 'telegram',
        link: ['@','https://t.me/'],
    }
]