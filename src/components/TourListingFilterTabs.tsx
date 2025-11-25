/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NcInputNumber from "@/components/NcInputNumber";
import { Button } from "@/shared/Button";
import ButtonClose from "@/shared/ButtonClose";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import { Checkbox, CheckboxField, CheckboxGroup } from "@/shared/Checkbox";
import { Description, Fieldset, Label } from "@/shared/fieldset";
import T from "@/utils/getT";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { PriceRangeSlider } from "./PriceRangeSlider";

type CheckboxFilter = {
  label: string;
  name: string;
  tabUIType: "checkbox";
  options: {
    name: string;
    value: string;
    description?: string;
    defaultChecked?: boolean;
  }[];
};
type PriceRangeFilter = {
  name: string;
  label: string;
  tabUIType: "price-range";
  min: number;
  max: number;
};
type SelectNumberFilter = {
  name: string;
  label: string;
  tabUIType: "select-number";
  options: {
    name: string;
    max: number;
  }[];
};

type FilterOption = CheckboxFilter | PriceRangeFilter | SelectNumberFilter;

const CheckboxPanel = ({
  filterOption,
  className,
}: {
  filterOption: CheckboxFilter;
  className?: string;
}) => {
  const searchParams = useSearchParams();
  const [selectedValues, setSelectedValues] = useState<string[]>(() =>
    searchParams.getAll(`${filterOption.name}[]`)
  );

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedValues((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <Fieldset>
      <CheckboxGroup className={className}>
        {filterOption.options.map((option) => {
          const isChecked = selectedValues.includes(option.value);

          return (
            <CheckboxField key={option.value}>
              <Checkbox
                checked={isChecked}
                onChange={(checked) =>
                  handleCheckboxChange(option.value, checked as boolean)
                }
              />
              {isChecked && (
                <input
                  type="hidden"
                  name={`${filterOption.name}[]`}
                  value={option.value}
                />
              )}
              <Label>{option.name}</Label>
              {option.description && (
                <Description>{option.description}</Description>
              )}
            </CheckboxField>
          );
        })}
      </CheckboxGroup>
    </Fieldset>
  );
};

const PriceRagePanel = ({
  filterOption: { min, max, name },
}: {
  filterOption: PriceRangeFilter;
}) => {
  const searchParams = useSearchParams();
  const minParam = searchParams.get("priceMin");
  const maxParam = searchParams.get("priceMax");

  const [rangePrices, setRangePrices] = useState([
    minParam ? Number(minParam) : min,
    maxParam ? Number(maxParam) : max,
  ]);

  return (
    <>
      <PriceRangeSlider
        defaultValue={rangePrices}
        onChange={setRangePrices}
        min={min}
        max={max}
      />
      <input type="hidden" name="priceMin" value={rangePrices[0]} />
      <input type="hidden" name="priceMax" value={rangePrices[1]} />
    </>
  );
};

const NumberSelectPanel = ({
  filterOption: { name, options },
}: {
  filterOption: SelectNumberFilter;
}) => {
  return (
    <div className="relative flex flex-col gap-y-5">
      {options.map((option) => (
        <NcInputNumber
          key={option.name}
          inputName={option.name.toLowerCase().replace(" ", "")}
          label={option.name}
          max={option.max}
        />
      ))}
    </div>
  );
};

const TourListingFilterTabs = ({
  filterOptions = [],
}: {
  filterOptions?: FilterOption[];
}) => {
  const [showAllFilter, setShowAllFilter] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filteredOptions = filterOptions.filter(
    (option) => option && !option.name.toLowerCase().includes("nature")
  );

  const handleFormSubmit = async (formData: FormData) => {
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value && value !== "") {
        params.append(key, value as string);
      }
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
      setShowAllFilter(false);
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.push(window.location.pathname, { scroll: false });
      setShowAllFilter(false);
    });
  };

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) =>
      key.endsWith("[]") ||
      key.startsWith("price") ||
      key.startsWith("duration")
  ).length;

  const renderTabAllFilters = () => {
    return (
      <div className="shrink-0 grow md:grow-0">
        <Button
          outline
          onClick={() => setShowAllFilter(true)}
          className="w-full border-black! ring-1 ring-black ring-inset md:w-auto dark:border-neutral-200! dark:ring-neutral-200"
        >
          <HugeiconsIcon
            icon={FilterVerticalIcon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
          />
          <span>{T["common"]["All filters"]}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute top-0 -right-0.5 flex size-5 items-center justify-center rounded-full bg-black text-[0.65rem] font-semibold text-white ring-2 ring-white dark:bg-neutral-200 dark:text-neutral-900 dark:ring-neutral-900">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <Dialog
          open={showAllFilter}
          onClose={() => setShowAllFilter(false)}
          className="relative z-50 "
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 duration-200 ease-out data-closed:opacity-0"
          />
          <div className="fixed max-h-[85vh] overflow-y-auto inset-0 flex w-screen items-center justify-center pt-3">
            <DialogPanel
              className="flex max-h-full w-full max-w-3xl overflow-y-auto flex-col rounded-2xl bg-white text-left align-middle shadow-xl duration-200 ease-out data-closed:translate-y-16 data-closed:opacity-0 dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              transition
            >
              <div className="relative shrink-0 border-b border-neutral-200 p-4 text-center sm:px-8 dark:border-neutral-800">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                >
                  {T["common"]["Filters"]}
                </DialogTitle>
                <div className="absolute end-2 top-2">
                  <ButtonClose plain onClick={() => setShowAllFilter(false)} />
                </div>
              </div>

              <form
                action={handleFormSubmit}
                className="flex max-h-full flex-col"
              >
                <div className="hidden-scrollbar grow overflow-y-auto text-start">
                  <div className="divide-y divide-neutral-200 px-4 sm:px-8 dark:divide-neutral-800">
                    {filteredOptions.map((filterOption, index) =>
                      filterOption ? (
                        <div key={index} className="py-7">
                          <h3 className="text-xl font-medium">
                            {filterOption.label}
                          </h3>
                          <div className="relative mt-6">
                            {filterOption.tabUIType === "checkbox" && (
                              <CheckboxPanel
                                filterOption={filterOption as CheckboxFilter}
                              />
                            )}
                            {filterOption.tabUIType === "price-range" && (
                              <PriceRagePanel
                                key={index}
                                filterOption={filterOption as PriceRangeFilter}
                              />
                            )}
                            {filterOption.tabUIType === "select-number" && (
                              <NumberSelectPanel
                                key={index}
                                filterOption={
                                  filterOption as SelectNumberFilter
                                }
                              />
                            )}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between bg-neutral-50 p-4 sm:px-8 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                  <ButtonThird
                    className="-mx-3"
                    onClick={handleClearAll}
                    type="button"
                  >
                    {T["common"]["Clear All"]}
                  </ButtonThird>
                  <ButtonPrimary type="submit" disabled={isPending}>
                    {isPending ? "Applying..." : T["common"]["Apply filters"]}
                  </ButtonPrimary>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    );
  };

  if (!filteredOptions || filteredOptions.length === 0) {
    return <div>No filter options available</div>;
  }

  return (
    <div className="flex flex-wrap md:gap-x-4 md:gap-y-2">
      {renderTabAllFilters()}
      <PopoverGroup className="hidden flex-wrap gap-x-4 gap-y-2 md:flex">
        <div className="h-auto w-px bg-neutral-200 dark:bg-neutral-700"></div>
        {filteredOptions.map((filterOption, index) => {
          if (index > 2 || !filterOption) {
            return null;
          }

          const checkedNumber =
            filterOption.tabUIType === "checkbox"
              ? searchParams.getAll(`${filterOption.name}[]`).length
              : 0;

          return (
            <Popover className="relative" key={index}>
              {({ close }) => (
                <>
                  <PopoverButton
                    as={Button}
                    outline
                    className={clsx(
                      "md:px-4",
                      checkedNumber &&
                        "border-black! ring-1 ring-black ring-inset dark:border-neutral-200! dark:ring-neutral-200"
                    )}
                  >
                    <span>{filterOption.label}</span>
                    <ChevronDownIcon className="size-4" />
                    {checkedNumber ? (
                      <span className="absolute top-0 -right-0.5 flex size-5 items-center justify-center rounded-full bg-black text-[0.65rem] font-semibold text-white ring-2 ring-white dark:bg-neutral-200 dark:text-neutral-900 dark:ring-neutral-900">
                        {checkedNumber}
                      </span>
                    ) : null}
                  </PopoverButton>

                  <PopoverPanel
                    transition
                    unmount={false}
                    className="absolute -start-5 top-full z-10 mt-3 w-sm transition data-closed:translate-y-1 data-closed:opacity-0"
                  >
                    <form
                      action={(formData) => {
                        handleFormSubmit(formData);
                        close();
                      }}
                      className="rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <div className="hidden-scrollbar max-h-[28rem] overflow-y-auto px-5 py-6">
                        {filterOption.tabUIType === "checkbox" && (
                          <CheckboxPanel
                            filterOption={filterOption as CheckboxFilter}
                          />
                        )}
                        {filterOption.tabUIType === "price-range" && (
                          <PriceRagePanel
                            key={index}
                            filterOption={filterOption as PriceRangeFilter}
                          />
                        )}
                        {filterOption.tabUIType === "select-number" && (
                          <NumberSelectPanel
                            key={index}
                            filterOption={filterOption as SelectNumberFilter}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between rounded-b-2xl bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                        <ButtonThird
                          className="-mx-3"
                          onClick={handleClearAll}
                          type="button"
                        >
                          {T["common"]["Clear"]}
                        </ButtonThird>
                        <ButtonPrimary type="submit" disabled={isPending}>
                          {isPending ? "Applying..." : T["common"]["Apply"]}
                        </ButtonPrimary>
                      </div>
                    </form>
                  </PopoverPanel>
                </>
              )}
            </Popover>
          );
        })}
      </PopoverGroup>
    </div>
  );
};

export default TourListingFilterTabs;
