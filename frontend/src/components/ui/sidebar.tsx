import { cn } from "@/lib/utils";
import { NavLink, NavLinkProps } from "react-router-dom";
import React, { useState, useRef, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface SidebarLinkItem {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHovering = useRef(false);

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    isHovering.current = false;
    // If mouse went off the left edge of the screen, keep sidebar open
    if (e.clientX <= 4) return;
    leaveTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const handleClickCapture = () => {
    // If a nav link fires setSidebarOpen(false) while mouse is still here, re-open
    if (isHovering.current) {
      setTimeout(() => setOpen(true), 0);
    }
  };

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white dark:bg-neutral-800 border-r border-gray-100 flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "16.5rem" : "4.5rem") : "16.5rem",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClickCapture={handleClickCapture}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-white border-b border-gray-100 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-700 dark:text-neutral-200 cursor-pointer h-5 w-5"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: SidebarLinkItem;
  className?: string;
  onClick?: () => void;
  props?: Omit<NavLinkProps, "to">;
}) => {
  const { open, animate } = useSidebar();
  return (
    <NavLink
      to={link.href}
      end
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-start gap-3 group/sidebar py-2 px-2 rounded-xl transition-all duration-150",
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-neutral-600 hover:bg-gray-50 hover:text-neutral-900",
          className
        )
      }
      {...(props as Omit<NavLinkProps, "to">)}
    >
      <span className="flex-shrink-0">{link.icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="text-sm font-medium group-hover/sidebar:translate-x-0.5 transition duration-150 whitespace-pre !p-0 !m-0 overflow-hidden"
      >
        {link.label}
      </motion.span>
    </NavLink>
  );
};
