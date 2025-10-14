import Image from "next/image";

const VinzaLogo = () => {
  return (
    <div className="flex flex-col items-center space-y-2 mb-8">
      <Image
        src="/vinza-logo.svg"
        alt="Vinza Logo"
        width={80}
        height={80}
        className="w-20 h-20"
      />
      <h1 className="text-3xl font-bold text-primary font-inria-serif">
        VINZA
      </h1>
    </div>
  );
};

export default VinzaLogo;
