"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import App from "next/app";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import Image from "next/image";

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
      className="fixed top-0 z-10 box-border flex w-full justify-center pt-3"
    >
      <a href="/" className="absolute left-8 top-5">
        <Image
          src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913696/qjfojuvybafoiuhqhr70.svg"
          width={100}
          height={100}
          alt="Picture of the author"
        />
      </a>

      <SlideTabs />
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
      className="relative mx-auto flex w-fit rounded-full border-2 border-dashed border-[#ffffff] bg-[#0c3b5f] p-1 px-6"
    >
      <Tab setPosition={setPosition}>
        <a href="/about">ABOUT</a>
      </Tab>
      <Tab setPosition={setPosition}>
        <a href="/blog">BLOG</a>
      </Tab>
      <Tab setPosition={setPosition}>
        <a href="/faq">FAQ</a>
      </Tab>
      <Tab setPosition={setPosition}>
        <a href="/nearby">NEARBY SHARE</a>
      </Tab>
      <Tab setPosition={setPosition}>
        <a href="/privacy">PRIVACY</a>
      </Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: any;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
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
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-[#D9F8FF] mix-blend-difference md:px-5 md:py-3 md:text-base"
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
      className="absolute z-0 h-7 rounded-full bg-[#ffd700] md:h-12"
    />
  );
};

export default App;
