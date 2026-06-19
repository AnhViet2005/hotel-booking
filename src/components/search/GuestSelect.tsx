"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface GuestConfig {
  adults: number;
  children: number;
  rooms: number;
  isBusinessTrip: boolean;
  bringsPet: boolean;
}

interface GuestSelectProps {
  guests: GuestConfig;
  setGuests: (config: GuestConfig) => void;
}

export default function GuestSelect({ guests, setGuests }: GuestSelectProps) {
  const [open, setOpen] = useState(false);

  const updateField = (field: keyof GuestConfig, value: number | boolean) => {
    setGuests({ ...guests, [field]: value });
  };

  const displayText = `${guests.adults} người lớn${guests.children > 0 ? ` · ${guests.children} trẻ em` : ''} · ${guests.rooms} phòng`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className="flex-1 flex items-center px-8 py-5 md:py-4 w-full group cursor-pointer">
          <Users className="text-accent-500 w-6 h-6 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="text-left w-full">
            <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-1">
              Số khách
            </p>
            <input
              type="text"
              placeholder="2 người, 1 phòng"
              value={displayText}
              readOnly
              className="text-base text-foreground font-bold outline-none w-full bg-transparent cursor-pointer truncate"
            />
          </div>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[380px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={10}
          align="end"
        >
          <div className="space-y-5">
            {/* Người lớn */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Người lớn</span>
              <div className="flex items-center gap-4 border border-gray-200 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => updateField('adults', Math.max(1, guests.adults - 1))}
                  disabled={guests.adults <= 1}
                  className="p-1 text-blue-500 disabled:text-gray-300 hover:bg-blue-50 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-medium">{guests.adults}</span>
                <button
                  type="button"
                  onClick={() => updateField('adults', guests.adults + 1)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trẻ em */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Trẻ em</span>
              <div className="flex items-center gap-4 border border-gray-200 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => updateField('children', Math.max(0, guests.children - 1))}
                  disabled={guests.children <= 0}
                  className="p-1 text-blue-500 disabled:text-gray-300 hover:bg-blue-50 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-medium">{guests.children}</span>
                <button
                  type="button"
                  onClick={() => updateField('children', guests.children + 1)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Phòng */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-base font-semibold text-gray-900">Phòng</span>
              <div className="flex items-center gap-4 border border-gray-200 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => updateField('rooms', Math.max(1, guests.rooms - 1))}
                  disabled={guests.rooms <= 1}
                  className="p-1 text-blue-500 disabled:text-gray-300 hover:bg-blue-50 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-medium">{guests.rooms}</span>
                <button
                  type="button"
                  onClick={() => updateField('rooms', guests.rooms + 1)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-base text-gray-700">Đi công tác?</span>
              <button
                type="button"
                role="switch"
                aria-checked={guests.isBusinessTrip}
                onClick={() => updateField('isBusinessTrip', !guests.isBusinessTrip)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  guests.isBusinessTrip ? "bg-blue-600" : "bg-gray-400"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 bg-white w-4 h-4 rounded-full transition-transform",
                    guests.isBusinessTrip ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-700">Mang thú cưng đi cùng</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={guests.bringsPet}
                  onClick={() => updateField('bringsPet', !guests.bringsPet)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    guests.bringsPet ? "bg-blue-600" : "bg-gray-400"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 bg-white w-4 h-4 rounded-full transition-transform",
                      guests.bringsPet ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500">Động vật trợ giúp không được xem là vật nuôi.</p>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Đọc thêm về chủ đề đi du lịch cùng động vật trợ giúp
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2.5 px-4 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Xong
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
