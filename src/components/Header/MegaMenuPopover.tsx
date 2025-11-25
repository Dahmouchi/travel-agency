import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

type TNavigationItem = {
  id: string;
  name: string;
  href: string;
  isNew?: boolean;
  type?: "mega-menu" | "dropdown" | "link";
  children?: {
    id: string;
    name: string;
    children?: TNavigationItem[];
  }[];
};

type TCategory = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function MegaMenuPopover({
  megamenu,
  featuredCategory,
}: {
  megamenu: TNavigationItem;
  featuredCategory: TCategory;
}) {
  if (megamenu.type !== "mega-menu") {
    return null;
  }

  const renderNavlink = (item: TNavigationItem) => {
    return (
      <li key={item.id} className={`${item.isNew ? "menuIsNew" : ""}`}>
        <Link
          className="font-normal text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          href={item.href || "#"}
        >
          {item.name}
        </Link>
      </li>
    );
  };

  return (
    <div className="hidden lg:block">
      <Popover className="group">
        <PopoverButton className="-m-2.5 flex items-center p-2.5 text-sm font-medium text-neutral-700 group-hover:text-neutral-950 focus:outline-hidden dark:text-neutral-300 dark:group-hover:text-neutral-100">
          Menu
          <ChevronDownIcon
            className="ms-1 size-4 group-data-open:rotate-180"
            aria-hidden="true"
          />
        </PopoverButton>

        <PopoverPanel
          transition
          className="header-popover-full-panel absolute inset-x-0 top-full z-40 w-full transition duration-200 data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="bg-white shadow-lg dark:bg-neutral-900">
            <div className="container">
              <div className="flex py-12 text-sm">
                <div className="grid flex-1 grid-cols-4 gap-6 pr-6 xl:gap-8 xl:pr-20">
                  {megamenu.children?.map((menuChild, index) => (
                    <div key={index}>
                      <p className="font-medium text-neutral-900 dark:text-neutral-200">
                        {menuChild.name}
                      </p>
                      <ul className="mt-4 grid space-y-4">
                        {menuChild.children?.map(renderNavlink)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
}

function CardCategory7({ category }: { category: TCategory }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-neutral-800 shadow-sm">
      <Link
        href={`/category?categorys=${category.id}`}
        className="group block aspect-[4/3] overflow-hidden"
      >
        <img
          src={category.imageUrl || "/placeholder.svg"}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {category.name}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {category.description}
        </p>
        <Link
          href={`/category?categorys=${category.id}`}
          className="mt-4 inline-flex items-center text-sm font-medium text-[#D97D55] hover:text-[#7BA91F]"
        >
          Découvrir
          <ChevronDownIcon className="ml-1 h-4 w-4 rotate-[-90deg]" />
        </Link>
      </div>
    </div>
  );
}
