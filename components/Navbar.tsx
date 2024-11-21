"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import App from "next/app";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HandBurger } from "./HandBurger";

type Position = {
  left: number;
  width: number;
  opacity: number;
};

export const Nav = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  return (
    <motion.div
      animate={isHidden ? "hidden" : "visible"}
      whileHover="visible"
      onFocusCapture={() => setIsHidden(false)}
      variants={{
        hidden: {
          y: "-90%",
        },
        visible: {
          y: "0%",
        },
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 z-50 box-border flex w-full justify-center pt-3 "
    >
      <a href="/" className="absolute left-8 top-5 flex gap-4">
        <Image
          src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913696/qjfojuvybafoiuhqhr70.svg"
          width={100}
          height={100}
          alt="Logo"
          className="hidden lg:flex "
        />
        <div className="text-2xl font-bold text-white md:text-2xl lg:text-3xl">
          ShipFilez
        </div>
      </a>

      <SlideTabs />
      <HandBurger />
    </motion.div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto hidden w-fit rounded-full border-2 border-[#ffffff] bg-[#003366] p-1 font-bold md:flex md:px-0 lg:px-6"
    >
      <Tab setPosition={setPosition} link="/about">
        <a href="/about">ABOUT</a>
      </Tab>
      <Tab setPosition={setPosition} link="/contact">
        <a href="/contact">CONTACT</a>
      </Tab>
      <Tab setPosition={setPosition} link="/privacy">
        <a href="/privacy">privacy</a>
      </Tab>
      <Tab setPosition={setPosition} link="/nearby">
        <a href="/nearby">NEARBY SHARE</a>
      </Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  link,
}: {
  children: any;
  link: string;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);
  const router = useRouter();
  return (
    <li
      onClick={() => router.push(link)}
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer text-xs uppercase text-white hover:text-black md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-yellow-400 md:h-12"
    />
  );
};

export default App;
