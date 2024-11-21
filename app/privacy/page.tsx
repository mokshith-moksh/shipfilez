import React from "react";

const Privacy = () => {
  return (
    <div
      className="relative mx-auto flex min-h-screen w-screen flex-col items-center justify-center bg-slate-900 bg-cover bg-center p-4 pt-14 text-white sm:p-6 md:p-8 lg:p-10"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
        Privacy Policy
      </h1>
      <div className=" flex max-w-4xl flex-col text-lg sm:text-base md:text-lg lg:text-xl">
        <p className="mb-4">
          Your privacy matters to us. We do not store your data, ever.
        </p>
        <p className="mb-4">
          The only information we keep is a record of the total number of daily
          users and some basic statistics regarding file transfers. This data
          helps us monitor system performance and identify any issues quickly.
        </p>
        <p className="mb-4">
          For example, we can track the total number of successful and failed
          transfers, as well as how often fallback methods are utilized. This
          enables us to address bugs and improve the platform effectively.
        </p>
        <p className="mb-4">
          Our service is fully compliant with the GDPR (General Data Protection
          Regulation). Since we don’t store your data, your privacy and security
          remain our top priorities.
        </p>
        <p className="mb-4">
          If you have any concerns or questions about our privacy practices,
          feel free to{" "}
          <a href="/contact" className="text-blue-400 underline">
            contact us
          </a>
          . We are always here to help.
        </p>
        <p>
          While we strive to make this platform as secure as possible, we
          encourage you to use it responsibly. Keep your share links private to
          maintain your security and confidentiality.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
