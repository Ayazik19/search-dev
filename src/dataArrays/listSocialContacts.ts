import iconFacebookSocial from '../../dist/icons/iconFacebookSocial.png';
import iconInstagramSocial from '../../dist/icons/iconInstagramSocial.png';
import iconPinterestSocial from '../../dist/icons/iconPinterestSocial.png';
import iconTelegramSocial from '../../dist/icons/iconTelegramSocial.png';
import iconTwitterSocial from '../../dist/icons/iconTwitterSocial.png';
import iconVkontakteSocial from '../../dist/icons/iconVkontakteSocial.png';
import iconHelpSocialInp from '../../dist/icons/iconHelpSocialInp.png';
import { SocialNetwork } from '../types/typesResume';

interface SocialLinksFormat{
    name: string,
    link: string[]
}

export const iconMap: Record<SocialNetwork, string> = {
    'facebook': iconFacebookSocial,
    'twitter': iconTwitterSocial,
    'vk': iconVkontakteSocial,
    'instagram': iconInstagramSocial,
    'pinterest': iconPinterestSocial,
    'telegram': iconTelegramSocial
};

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
        link: ['https://t.me/']
    }
]