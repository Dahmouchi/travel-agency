/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarDays, Eye, MapIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import SafeHTML from "../SafeHTML";

const FlightCard = ({
  img,
  name,
  oneway,
  ville,
  departure,
  destination,
  tourid,
}: any) => {
  return (
    <div className="featured-flight-items ">
      <div className="featured-image">
        <div
          className="w-full  bg-amber-600 h-[35vh] rounded-2xl bg-cover bg-center relative"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="absolute top-3 right-3 space-y-2">
            <div className="text flex items-center gap-2 text-gray-500  bg-white bg-opacity-80 px-3 py-1 rounded-full">
              <MapPinIcon className="w-4" />
              <p className="text-md ">{ville}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="featured-content ">
        <div className="flex items-center my-3 justify-between w-full mb-3">
          <div className="text flex items-center gap-2 text-gray-500">
            <CalendarDays className="w-4" />
            <p className="text-md ">{oneway} DAYS MOROCCO TOUR</p>
          </div>

          {/*  <div
            className={`items-baseline text-right z-50 py-2  bg-[#4FA8FF] cardd w-fit rounded-full px-8 right-0`}
          >
            <p className="text-xl text-white">
              {" "}
              <b className=" ">{price}0</b>MAD
            </p>
          </div>*/}
        </div>

        <div className="featured-cont">
          <div className="content">
            <h4>
              <span className="font-semibold text-2xl line-clamp-1">
                {destination}
              </span>
            </h4>
          </div>
        </div>
        <div className="line-clamp-2 my-3  ">
          <SafeHTML html={name} />
        </div>
        <div className="text flex items-center gap-2 text-gray-50  w-fit bg-blue-600 bg-opacity-80 px-3 py-1 rounded-full">
          <MapIcon className="w-3" />
          <p className="text-xs ">Departure : {departure}</p>
        </div>
        <div className="my-4 border-b-[1px] border-gray-400 w-full h-1"></div>

        <div className="flex justify-between items-center w-full gap-2">
          <Link
            href={`/discover-morocco/${tourid}`}
            className="bg-[#D97D55] carddd rounded-lg cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex itce justify-between px-4 py-3 w-full text-white"
          >
            <Eye className="w-6 h-6" />
            <span className="text-white w-full text-center select-none">
              Programme
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
