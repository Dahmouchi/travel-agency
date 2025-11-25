/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCurrencies, getLanguages, getNavigation } from "@/data/navigation";
import Aside from "./aside";
import SidebarNavigation from "./Header/Navigation/SidebarNavigation";
import { Destination } from "@prisma/client";

interface Props {
  className?: string;
  navItem?: any;
  nationalDestinations: Destination[];
  internationalDestinations: Destination[];
}

const AsideSidebarNavigation = async ({
  className,
  navItem,
  nationalDestinations,
  internationalDestinations,
}: Props) => {
  const navigationMenu = await getNavigation();
  const currencies = await getCurrencies();
  const languages = await getLanguages();

  return (
    <Aside
      openFrom="right"
      type="sidebar-navigation"
      logoOnHeading
      contentMaxWidthClassName="max-w-md"
    >
      <div className="flex h-full flex-col">
        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          <SidebarNavigation
            data={navItem}
            currencies={currencies}
            languages={languages}
            nationalDestinations={nationalDestinations}
            internationalDestinations={internationalDestinations}
          />
        </div>
      </div>
    </Aside>
  );
};

export default AsideSidebarNavigation;
