"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  isAfter,
  isBefore,
} from "date-fns";
import { vi } from "date-fns/locale";

export interface DateConfig {
  mode: "calendar" | "flexible";
  dateRange: { start: Date | null; end: Date | null };
  flexible: {
    stayLength: "weekend" | "week" | "month" | "other";
    months: string[]; // e.g. "2026-05"
  };
}

interface DateSelectProps {
  dateConfig: DateConfig;
  setDateConfig: (config: DateConfig) => void;
}

const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function DateSelect({ dateConfig, setDateConfig }: DateSelectProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Calendar logic ---
  const handleDateClick = (date: Date) => {
    const { start, end } = dateConfig.dateRange;
    if (!start || (start && end)) {
      // Set start
      setDateConfig({
        ...dateConfig,
        dateRange: { start: date, end: null },
      });
    } else {
      // Set end (make sure end is after start, else swap)
      if (isBefore(date, start)) {
        setDateConfig({
          ...dateConfig,
          dateRange: { start: date, end: start },
        });
      } else {
        setDateConfig({
          ...dateConfig,
          dateRange: { start, end: date },
        });
      }
    }
  };

  const renderMonth = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="flex-1 w-full md:w-64">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="font-semibold text-gray-900 text-center w-full">
            tháng {format(month, "M yyyy")}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-2 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, month);
            const isStart = dateConfig.dateRange.start && isSameDay(day, dateConfig.dateRange.start);
            const isEnd = dateConfig.dateRange.end && isSameDay(day, dateConfig.dateRange.end);
            const isBetween =
              dateConfig.dateRange.start &&
              dateConfig.dateRange.end &&
              isAfter(day, dateConfig.dateRange.start) &&
              isBefore(day, dateConfig.dateRange.end);
            const isPast = isBefore(day, new Date()) && !isToday(day);

            return (
              <div key={idx} className="relative flex items-center justify-center h-10">
                {isBetween && (
                  <div className="absolute inset-0 bg-blue-50 w-full" />
                )}
                {isStart && dateConfig.dateRange.end && (
                  <div className="absolute inset-y-0 right-0 bg-blue-50 w-1/2" />
                )}
                {isEnd && dateConfig.dateRange.start && (
                  <div className="absolute inset-y-0 left-0 bg-blue-50 w-1/2" />
                )}
                <button
                  onClick={() => isCurrentMonth && !isPast && handleDateClick(day)}
                  disabled={!isCurrentMonth || isPast}
                  className={cn(
                    "relative w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors",
                    !isCurrentMonth ? "text-transparent" : "text-gray-900 hover:bg-gray-100",
                    isPast && isCurrentMonth ? "text-gray-300 cursor-not-allowed hover:bg-transparent" : "",
                    (isStart || isEnd) && "bg-blue-600 text-white font-bold hover:bg-blue-700 z-10"
                  )}
                >
                  {isCurrentMonth ? format(day, "d") : ""}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Flexible logic ---
  const toggleMonth = (mStr: string) => {
    const current = dateConfig.flexible.months;
    const next = current.includes(mStr) ? current.filter((m) => m !== mStr) : [...current, mStr];
    setDateConfig({
      ...dateConfig,
      flexible: { ...dateConfig.flexible, months: next },
    });
  };

  const setStayLength = (length: "weekend" | "week" | "month" | "other") => {
    setDateConfig({
      ...dateConfig,
      flexible: { ...dateConfig.flexible, stayLength: length },
    });
  };

  const renderFlexible = () => {
    // Generate next 6 months for selection
    const upcomingMonths = Array.from({ length: 6 }).map((_, i) => {
      const d = addMonths(new Date(), i);
      return { str: format(d, "yyyy-MM"), label: format(d, "MMM yyyy", { locale: vi }) };
    });

    return (
      <div className="p-4 space-y-8 w-full max-w-[600px]">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Bạn muốn ở bao lâu?</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "weekend", label: "Cuối tuần" },
              { id: "week", label: "1 tuần" },
              { id: "month", label: "Một tháng" },
              { id: "other", label: "Khác" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    dateConfig.flexible.stayLength === opt.id ? "border-blue-600" : "border-gray-300"
                  )}
                  onClick={() => setStayLength(opt.id as any)}
                >
                  {dateConfig.flexible.stayLength === opt.id && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Bạn muốn đi khi nào?</h3>
          <p className="text-sm text-gray-500 mb-4">Chọn tối đa 3 tháng</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {upcomingMonths.map((m) => (
              <button
                key={m.str}
                onClick={() => toggleMonth(m.str)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center w-[100px] h-[100px] border rounded-2xl transition-all",
                  dateConfig.flexible.months.includes(m.str)
                    ? "border-black border-2"
                    : "border-gray-200 hover:border-gray-400"
                )}
              >
                <CalendarIcon className="w-6 h-6 mb-2 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">
                  Th {format(new Date(m.str), "M")}
                </span>
                <span className="text-sm text-gray-500">{format(new Date(m.str), "yyyy")}</span>
              </button>
            ))}
            <button className="flex-shrink-0 flex items-center justify-center w-12 h-[100px] rounded-full border border-gray-200 hover:border-gray-400 ml-2">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Display string logic ---
  let displayText = "Thêm ngày";
  if (dateConfig.mode === "calendar") {
    if (dateConfig.dateRange.start && dateConfig.dateRange.end) {
      displayText = `${format(dateConfig.dateRange.start, "d 'thg' M")} - ${format(
        dateConfig.dateRange.end,
        "d 'thg' M"
      )}`;
    } else if (dateConfig.dateRange.start) {
      displayText = format(dateConfig.dateRange.start, "d 'thg' M");
    }
  } else {
    // Flexible mode display
    const len = dateConfig.flexible.stayLength;
    const lenStr = len === "weekend" ? "Cuối tuần" : len === "week" ? "1 tuần" : len === "month" ? "1 tháng" : "Khác";
    const mStr = dateConfig.flexible.months.length > 0 ? ` trong ${dateConfig.flexible.months.length} tháng` : "";
    displayText = `${lenStr}${mStr}`;
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className="flex-1 flex items-center px-8 py-5 md:py-4 w-full group cursor-pointer border-x border-border md:border-x-0">
          <CalendarIcon className="text-accent-500 w-6 h-6 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <div className="text-left w-full">
            <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase mb-1">
              Ngày đi - về
            </p>
            <input
              type="text"
              placeholder="Thêm ngày"
              value={displayText}
              readOnly
              className="text-base text-foreground font-bold outline-none w-full bg-transparent cursor-pointer truncate"
            />
          </div>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-6 mt-2 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={10}
          align="center"
        >
          {/* Tabs */}
          <div className="flex items-center justify-center w-full border-b border-gray-200 mb-6">
            <button
              onClick={() => setDateConfig({ ...dateConfig, mode: "calendar" })}
              className={cn(
                "pb-3 px-8 text-sm font-semibold relative transition-colors",
                dateConfig.mode === "calendar" ? "text-black" : "text-gray-500 hover:text-black"
              )}
            >
              Lịch
              {dateConfig.mode === "calendar" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setDateConfig({ ...dateConfig, mode: "flexible" })}
              className={cn(
                "pb-3 px-8 text-sm font-semibold relative transition-colors",
                dateConfig.mode === "flexible" ? "text-black" : "text-gray-500 hover:text-black"
              )}
            >
              Ngày linh hoạt
              {dateConfig.mode === "flexible" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Content */}
          {dateConfig.mode === "calendar" ? (
            <div className="flex flex-col relative w-full max-w-[650px]">
              <div className="flex gap-8">
                {renderMonth(currentMonth)}
                {renderMonth(addMonths(currentMonth, 1))}
              </div>
              
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="absolute top-0 left-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-full text-sm">Ngày chính xác</button>
                  <button className="px-4 py-2 border border-gray-200 hover:border-gray-900 rounded-full text-sm">± 1 ngày</button>
                  <button className="px-4 py-2 border border-gray-200 hover:border-gray-900 rounded-full text-sm">± 2 ngày</button>
                  <button className="px-4 py-2 border border-gray-200 hover:border-gray-900 rounded-full text-sm">± 3 ngày</button>
                  <button className="px-4 py-2 border border-gray-200 hover:border-gray-900 rounded-full text-sm">± 7 ngày</button>
                </div>
              </div>
            </div>
          ) : (
            renderFlexible()
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
