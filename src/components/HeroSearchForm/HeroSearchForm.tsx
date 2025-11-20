
import {
  Airplane02Icon,
  Car05Icon,
  HotAirBalloonFreeIcons,
  House03Icon,
  RealEstate02Icon,
} from '@hugeicons/core-free-icons'
import { IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { ExperiencesSearchForm } from './ExperiencesSearchForm'
import { FlightSearchForm } from './FlightSearchForm'
import { RealEstateHeroSearchForm } from './RealEstateHeroSearchForm'
import { RentalCarSearchForm } from './RentalCarSearchForm'
import { StaySearchForm } from './StaySearchForm'
import { ListingType } from '@/types/type'

export const formTabs: {
  name: ListingType
  icon: IconSvgElement
  href: string
  formComponent: React.ComponentType<{ formStyle: 'default' | 'small' }>
}[] = [
  { name: 'Stays', icon: House03Icon, href: '/', formComponent: StaySearchForm },
  { name: 'Cars', icon: Car05Icon, href: '/car', formComponent: RentalCarSearchForm },
  { name: 'Experiences', icon: HotAirBalloonFreeIcons, href: '/experience', formComponent: ExperiencesSearchForm },
  { name: 'RealEstates', icon: RealEstate02Icon, href: '/real-estate', formComponent: RealEstateHeroSearchForm },
  { name: 'Flights', icon: Airplane02Icon, href: '/flight-categories/all', formComponent: FlightSearchForm },
]

const HeroSearchForm = ({ className, initTab = 'Stays' }: { className?: string; initTab: ListingType }) => {
  return (
    <div className={clsx('hero-search-form', className)}>
      {formTabs.map((tab) =>
        tab.name === initTab ? (
          <Fragment key={tab.name}>
            <tab.formComponent formStyle={'default'} />
          </Fragment>
        ) : null
      )}
    </div>
  )
}

export default HeroSearchForm
