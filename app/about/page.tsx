import React from "react";

const About = () => {
  return (
    <div
      className="relative mx-auto flex h-screen w-screen items-center justify-center bg-slate-900 bg-cover bg-center p-4 text-white sm:p-6 md:p-8 lg:p-10"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <div className="mx-auto mt-8 flex max-w-screen-lg flex-col gap-6">
        <h2 className="text-lg font-semibold sm:text-xl md:text-2xl lg:text-4xl">
          What Makes ShipFilez Different?
        </h2>
        <ul className="list-disc pl-4 text-xs sm:pl-6 sm:text-sm md:text-base lg:text-lg">
          <li className="mb-2">
            <strong>True Peer-to-Peer Connection:</strong> Your data is
            transferred directly between devices using peer-to-peer technology.
            No servers. No middlemen. Just a pure, efficient, and private
            connection between you and your recipient.
          </li>
          <li className="mb-2">
            <strong>No Size Limits:</strong> Gone are the days of worrying about
            file size restrictions. Whether you’re sharing a small document or a
            large video file, ShipFilez handles it all with ease.
          </li>
          <li className="mb-2">
            <strong>End-to-End Encryption:</strong> Every transfer is protected
            with <strong>DTLS (Datagram Transport Layer Security)</strong>,
            ensuring that your data remains encrypted from start to finish.
          </li>
          <li className="mb-2">
            <strong>Blazing-Fast Transfers:</strong> Optimized for speed,
            ShipFilez ensures fast and reliable data transfer, no matter the
            size or location of your file.
          </li>
        </ul>

        <h2 className="text-lg font-semibold sm:text-xl md:text-2xl lg:text-3xl">
          Our Mission
        </h2>
        <div>
          <p className="mb-4 text-xs sm:text-sm md:text-base lg:text-lg">
            At ShipFilez, our mission is to make file sharing:
          </p>
          <ul className="list-disc pl-4 text-xs sm:pl-6 sm:text-sm md:text-base lg:text-lg">
            <li>
              <strong>Secure</strong> – Protecting your data is our top
              priority.
            </li>
            <li>
              <strong>Simple</strong> – We believe technology should make life
              easier.
            </li>
            <li>
              <strong>Unlimited</strong> – Share without boundaries, wherever
              you are.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
