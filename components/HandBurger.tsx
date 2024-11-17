import { motion } from "framer-motion";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

export const HandBurger = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div className=" ">
      {/* Hamburger/Close Icon */}
      <motion.div
        className="text-yellow-400 z-50 absolute right-6 top-4 text-4xl cursor-pointer"
        onClick={() => setOpen(!open)}
        initial={{ rotate: 0 }}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {open ? <AiOutlineClose /> : <GiHamburgerMenu />}
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        className="absolute z-40 right-0 top-0 w-[100vw] rounded-md h-[100vh] bg-blue-900 bg-opacity-80 flex flex-col items-center justify-center gap-8"
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <ul className="text-center text-white text-2xl space-y-6">
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            Home
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            About
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            Services
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            Contact
          </motion.li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
