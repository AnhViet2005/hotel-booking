"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

const POPULAR_DESTINATIONS = [
  { city: "TP. Hồ Chí Minh", country: "Việt Nam" },
  { city: "Vũng Tàu", country: "Việt Nam" },
  { city: "Đà Nẵng", country: "Việt Nam" },
  { city: "Đà Lạt", country: "Việt Nam" },
  { city: "Nha Trang", country: "Việt Nam" },
];

interface LocationSelectProps {
  location: string;
  setLocation: (location: string) => void;
}

export default function LocationSelect({ location, setLocation }: LocationSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className="flex-1 flex items-center pl-8 py-5 md:py-4 w-full group cursor-pointer">
          <MapPin className="text-accent-500 w-6 h-6 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="text-left w-full">
            <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-1">
              Địa điểm
            </p>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-base text-foreground font-bold outline-none w-full bg-transparent placeholder:text-muted-foreground/50 placeholder:font-normal cursor-text"
            />
          </div>
        </div>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mt-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={10}
          align="start"
        >
          <div className="mb-3">
            <h3 className="text-base font-bold text-gray-900 px-2">Các điểm đến thịnh hành</h3>
          </div>
          <div className="flex flex-col gap-1">
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setLocation(dest.city);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left",
                  location === dest.city && "bg-blue-50"
                )}
              >
                <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{dest.city}</p>
                  <p className="text-sm text-gray-500">{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
