/* eslint-disable @typescript-eslint/no-explicit-any */
// Shared between the browser (app/composables/usePageSettings.ts) and the Nitro
// server (server/api/public/page-settings.get.ts) so the DB↔app mapping and the
// fallback defaults can never drift apart.

export interface PageSettings {
  indexHeroImage: string
  indexHeroVideo: string
  aboutHeroImage: string
  aboutHeroVideo: string
  aboutBelieveImage: string
  blogHeroImage: string
  blogHeroVideo: string
  servicesBrandingImage: string
  servicesMarketingImage: string
  servicesVideoImage: string
  servicesVideoShowreel: string
  careersHeroImage: string
  careersHeroVideo: string
  careersMiddleImage: string
  contactHeroImage: string
  contactHeroVideo: string
}

export const defaultPageSettings: PageSettings = {
  indexHeroImage: '/Images/hero.png',
  indexHeroVideo: '',
  aboutHeroImage: '/Images/Branding.jpeg',
  aboutHeroVideo: '/Background_Videos/About.mp4',
  aboutBelieveImage: '/Images/what_we_believe.jpg',
  blogHeroImage: '/Images/Branding.jpeg',
  blogHeroVideo: '/Background_Videos/Blog.mp4',
  servicesBrandingImage: '/Images/Branding.jpeg',
  servicesMarketingImage: '/Images/Digital_Marketing.jpeg',
  servicesVideoImage: '/Images/Video_Production.jpeg',
  servicesVideoShowreel: '/Background_Videos/Portfolio.mp4',
  careersHeroImage: '/Images/Designing.jpeg',
  careersHeroVideo: '/Background_Videos/Careers.mp4',
  careersMiddleImage: '/Images/Take_My_Familt_-_1.png',
  contactHeroImage: '/Images/Marketing.jpeg',
  contactHeroVideo: '/Background_Videos/Contact.mp4'
}

export function mapDbToPageSettings(db: any): PageSettings {
  return {
    indexHeroImage: db.index_hero_image || defaultPageSettings.indexHeroImage,
    indexHeroVideo: db.index_hero_video || defaultPageSettings.indexHeroVideo,
    aboutHeroImage: db.about_hero_image || defaultPageSettings.aboutHeroImage,
    aboutHeroVideo: db.about_hero_video || defaultPageSettings.aboutHeroVideo,
    aboutBelieveImage: db.about_believe_image || defaultPageSettings.aboutBelieveImage,
    blogHeroImage: db.blog_hero_image || defaultPageSettings.blogHeroImage,
    blogHeroVideo: db.blog_hero_video || defaultPageSettings.blogHeroVideo,
    servicesBrandingImage: db.services_branding_image || defaultPageSettings.servicesBrandingImage,
    servicesMarketingImage: db.services_marketing_image || defaultPageSettings.servicesMarketingImage,
    servicesVideoImage: db.services_video_image || defaultPageSettings.servicesVideoImage,
    servicesVideoShowreel: db.services_video_showreel || defaultPageSettings.servicesVideoShowreel,
    careersHeroImage: db.careers_hero_image || defaultPageSettings.careersHeroImage,
    careersHeroVideo: db.careers_hero_video || defaultPageSettings.careersHeroVideo,
    careersMiddleImage: db.careers_middle_image || defaultPageSettings.careersMiddleImage,
    contactHeroImage: db.contact_hero_image || defaultPageSettings.contactHeroImage,
    contactHeroVideo: db.contact_hero_video || defaultPageSettings.contactHeroVideo
  }
}

export function mapPageSettingsToDb(settings: PageSettings) {
  return {
    index_hero_image: settings.indexHeroImage,
    index_hero_video: settings.indexHeroVideo,
    about_hero_image: settings.aboutHeroImage,
    about_hero_video: settings.aboutHeroVideo,
    about_believe_image: settings.aboutBelieveImage,
    blog_hero_image: settings.blogHeroImage,
    blog_hero_video: settings.blogHeroVideo,
    services_branding_image: settings.servicesBrandingImage,
    services_marketing_image: settings.servicesMarketingImage,
    services_video_image: settings.servicesVideoImage,
    services_video_showreel: settings.servicesVideoShowreel,
    careers_hero_image: settings.careersHeroImage,
    careers_hero_video: settings.careersHeroVideo,
    careers_middle_image: settings.careersMiddleImage,
    contact_hero_image: settings.contactHeroImage,
    contact_hero_video: settings.contactHeroVideo
  }
}
