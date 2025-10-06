import React from "react";
import { Shield, Star, Users } from "lucide-react";

const TrustRibbon = () => {
  return (
    <div className="bg-gray-100  flex justify-left items-left h-[1cm] w-full rounded-b-lg font-sans">
      <div className="flex items-center space-x-1 mx-2">
        <Shield size={16} />
        <span className="text-sm">Safe</span>
      </div>
      <div className="flex items-center space-x-1 mx-2">
        <Star size={16} />
        <span className="text-sm">Inclusive</span>
      </div>
      <div className="flex items-center space-x-1 mx-2">
        <Users size={16} />
        <span className="text-xs">4.7 Satisfaction</span>
      </div>
    </div>
  );
};

export default TrustRibbon;
