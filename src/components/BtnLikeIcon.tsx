"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface BtnLikeIconProps {
  className?: string;
  colorClass?: string;
  sizeClass?: string;
  isLiked?: boolean;
  userId?: string | null;
  tourId: string;
  isAuthenticated: boolean;
  onAuthRequired?: () => void; // <-- this triggers login/register modal
}

export default function BtnLikeIcon({
  className,
  colorClass = "text-white bg-black/30 hover:bg-black/50",
  sizeClass = "w-8 h-8",
  isLiked = false,
  userId,
  tourId,
  isAuthenticated,
  onAuthRequired,
}: BtnLikeIconProps) {
  const [likedState, setLikedState] = useState(isLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    // If user is NOT authenticated → open login/register modal
    if (!isAuthenticated) {
      if (onAuthRequired) onAuthRequired();
      toast.info("Please login to like this tour");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/favorite", { userId, tourId });
      setLikedState(res.data.liked);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex cursor-pointer items-center justify-center rounded-full transition-colors",
        className,
        colorClass,
        sizeClass,
        likedState && "text-red-500"
      )}
      onClick={toggleLike}
    >
      {likedState ? (
        <HeartIconSolid className="size-5 " />
      ) : (
        <HeartIcon className="size-5" />
      )}
    </div>
  );
}
