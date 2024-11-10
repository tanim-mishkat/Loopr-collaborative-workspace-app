import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo_loopr.png" alt="Loopr Logo" width={100} height={100} />
    </div>
  );
}

export default Logo;
