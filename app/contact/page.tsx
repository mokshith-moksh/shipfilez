import React from "react";
import Image from "next/image";

const Contact = () => {
  return (
    <div
      className="relative mx-auto flex min-h-screen w-screen flex-col items-center justify-center bg-slate-900 bg-cover bg-center p-4 pt-14 text-white sm:p-6 md:p-8 lg:p-10"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <h1 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
        Contact
      </h1>
      <p className="mb-8 max-w-3xl text-center text-sm sm:text-base md:text-lg lg:text-xl">
        If you have any questions, requests, or feedback, we do love to hear it!
        We are a small team working on exciting projects in our spare time.
        Please note that responses might not be immediate. Like what we do? You
        can always
        <a
          href="https://buymeacoffee.com/mokshith"
          className="text-blue-400 underline"
        >
          buy us a coffee ☕
        </a>
        .
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-10 md:flex-nowrap">
        {/* Team Member 1 */}
        <div className="flex w-64 flex-col items-center text-center">
          <Image
            src="/ava1.jpeg"
            alt="Mokshith S"
            className="mb-4 rounded-full"
            width={300}
            height={300}
          />
          <h3 className="text-lg font-bold sm:text-xl">Mokshith S</h3>
          <p className="text-sm text-gray-400 sm:text-base">
            Developer / Founder
          </p>
          <a
            href="mailto:mokshithmokshith7@gmail.com"
            className="mt-2 text-sm text-blue-400 hover:underline sm:text-base"
          >
            mokshithmokshith7@gmail.com
          </a>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-wrap justify-center gap-6">
        <a href="https://discord.gg/ECWBD3dv" aria-label="Discord">
          <Image
            src="/discord.png"
            alt="Discord"
            className="h-auto w-10"
            width={40}
            height={40}
          />
        </a>
        <a
          href="https://www.instagram.com/encrypted.ghost_/"
          aria-label="Instagram"
        >
          <Image
            src="/igs.png"
            alt="Insta"
            className="h-auto w-10 bg-transparent"
            width={40}
            height={40}
          />
        </a>
        <a href="https://x.com/mokshith_s_" aria-label="Twitter">
          <Image
            src="/x.svg"
            alt="Twitter"
            className="h-auto w-10"
            width={40}
            height={40}
          />
        </a>
        <a href="www.linkedin.com/in/mokshith-s" aria-label="LinkedIn">
          <Image
            src="/linkedIN.png"
            alt="LinkedIn"
            className="h-auto w-10"
            width={40}
            height={40}
          />
        </a>
      </div>
    </div>
  );
};

export default Contact;
