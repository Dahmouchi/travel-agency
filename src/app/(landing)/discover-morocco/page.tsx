/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FlightCard from "@/components/discover/FlightCard";
import VideoModal from "@/components/VideoModal";
import prisma from "@/lib/prisma";
import { Tour } from "@prisma/client";
import TourList from "../_components/DiscoverFilter";

const page = async () => {
  const tourNational: Tour[] | null = await prisma.tour.findMany({
    where: {
      isDiscover: true,
    },
    include: {
      reviews: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });
  console.log(tourNational);
  return (
    <div>
      <div className="breadcumb-area min-h-[80vh] bg-center">
        <div className="container flex items-center justify-center">
          <div className="row">
            <div className="col-12">
              <div className="breadcumb-wrap max-w-3xl">
                <h3>Experience Morocco, Create Memories</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="shape">
          <svg width="128" height="357" viewBox="0 0 128 357" fill="none">
            <path
              d="M-9.73063 357C-11.832 304.262 -1.65343 268.562 21.3305 247.878C27.4705 242.355 34.4642 238.095 41.2608 233.944C44.6099 231.887 48.0903 229.757 51.4066 227.519C63.6866 219.217 71.3041 210.301 74.5875 200.338C75.1457 198.713 75.5397 196.981 75.7695 195.212C68.2505 198.569 62.1762 199.688 56.5944 198.749C50.5201 197.703 43.5592 193.19 41.6548 185.43C40.3086 179.871 42.2787 173.987 46.974 169.691C52.5229 164.601 60.1405 163.23 65.8865 166.262C74.686 170.882 78.4948 181.639 78.0679 191.783C98.3923 181.603 114.58 162.002 121.77 138.72C129.289 114.318 126.695 86.4868 114.809 64.2508C110.048 55.3348 103.711 46.9963 97.6043 38.9466C86.375 24.1467 74.7845 8.87758 72.6831 -10.3623C70.8116 -28.1583 78.0679 -46.4596 91.2016 -57L92.3508 -55.2312C79.7753 -45.124 72.8473 -27.6529 74.686 -10.6511C76.6889 7.93905 87.6227 22.3419 99.1475 37.5388C105.32 45.6607 111.69 54.0714 116.55 63.1318C128.698 85.8731 131.358 114.39 123.675 139.369C116.221 163.591 99.2131 183.913 77.9366 194.201C77.6739 196.584 77.1814 198.894 76.4591 201.06C72.9786 211.528 65.1313 220.769 52.4573 229.36C49.1082 231.634 45.5949 233.764 42.213 235.821C35.5148 239.9 28.5868 244.16 22.5782 249.538C0.0867844 269.753 -9.82913 304.839 -7.76058 356.856L-9.73063 357ZM59.3525 166.767C55.1825 166.767 51.1111 168.716 48.2873 171.315C44.2159 175.033 42.4757 180.087 43.6249 184.816C45.2994 191.638 51.5379 195.645 56.9556 196.584C62.1762 197.486 67.955 196.367 75.1457 193.154C75.4412 193.01 75.7695 192.866 76.065 192.721C76.7217 182.975 73.1756 172.398 65.0656 168.139C63.2269 167.2 61.2568 166.767 59.3525 166.767Z"
              fill="white"
              fillOpacity="0.18"
            />
          </svg>
        </div>
        <div className="shape-s2">
          <img src="/images/chape3.png" alt="" className="w-24 h-auto" />
        </div>
        <div className="shape-s3">
          <img src="/images/chape2.png" alt="" className="w-24 h-auto" />
        </div>
      </div>
      <section
        className={
          "about-section section-padding flex items-center justify-center "
        }
      >
        <div className="lg:max-w-7xl lg:px-0 px-4">
          <div className="flex lg:flex-row flex-col items-center justify-between gap-14">
            <div className="lg:block hidden">
              <div className="about-image">
                <div className="img-1">
                  <img src={"/images/product3.jpg"} alt="" />
                  <VideoModal />
                </div>
                <div className="img-2">
                  <img src={"/images/product2.jpg"} alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="about-content">
                <h3>
                  {" "}
                  Discover Morocco with<span> Happy Trip</span>{" "}
                </h3>
                <p>
                  Embark on a journey across Morocco&apos;s most captivating
                  destinations with Happy Trip. Traverse the golden dunes of the
                  Sahara Desert, lose yourself in the colorful souks of
                  Marrakech and Fes, wander through the blue-washed alleys of
                  Chefchaouen, and breathe in the ocean air along
                  Essaouira&apos;s sunlit coast.
                </p>
                <p>
                  Immerse yourself in Morocco&apos;s vibrant rhythm — a blend of
                  ancient traditions, breathtaking landscapes, and warm
                  hospitality.
                </p>
                <p>
                  Whether you&apos;re drawn to the allure of majestic mountains,
                  the charm of desert nights, or the serenity of coastal
                  escapes, Happy Trip, your trusted Morocco travel agency,
                  crafts unforgettable experiences tailored to your dreams.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="shape-1">
          <img src="/images/about/shape1.svg" alt="" />
        </div>
        <div className="shape-2">
          <img src="/images/about/shape2.svg" alt="" />
        </div>
        <div className="shape-3">
          <img src="/images/shape3.png" alt="" />
        </div>
        <div className="shape-4">
          <img src="/images/about/shape4.svg" alt="" />
        </div>
        <div className="shape-5">
          <img src="/images/about/shape5.svg" alt="" />
        </div>
        <div className="shape-6">
          <img src="/images/about/shape6.svg" alt="" />
        </div>
      </section>
      <div className="w-full min-h-[90vh] px-4 lg:px-34 py-3">
        <h1 className="lg:text-4xl text-xl font-bold text-center py-9">
          Explorez le Maroc
        </h1>
        <TourList tourNational={tourNational || []} />
      </div>
    </div>
  );
};

export default page;
