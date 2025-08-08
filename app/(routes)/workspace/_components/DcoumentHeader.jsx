import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton, useClerk } from "@clerk/nextjs";
import { ArrowLeft, Home, LogOut, Share } from "lucide-react";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function DcoumentHeader() {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const router = useRouter();
  const { signOut } = useClerk();
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push('/');
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };
  
  return (
    <div className="flex justify-between items-center p-2 sm:p-3 px-3 sm:px-7 shadow-md">
      <div className="flex items-center gap-2">
        <Button 
          size={isMobile ? "sm" : "default"}
          variant="ghost"
          className="flex items-center gap-1"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && "Back"}
        </Button>
        
        <Button 
          size={isMobile ? "sm" : "default"}
          variant="ghost"
          className="flex items-center gap-1"
          onClick={handleGoHome}
        >
          <Home className="h-4 w-4" />
          {!isMobile && "Home"}
        </Button>
      </div>
      
      {/* Organization switcher - hide on small mobile screens */}
      <div className={`${isMobile ? 'hidden' : 'block'}`}>
        <OrganizationSwitcher 
          appearance={{
            elements: {
              rootBox: "max-w-xs",
              organizationSwitcherTrigger: "py-2"
            }
          }}
        />
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          size={isMobile ? "sm" : "default"}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Share className="h-4 w-4" />
          {!isMobile && "Share"}
        </Button>
        
        <Button 
          size={isMobile ? "sm" : "default"}
          variant="ghost"
          className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isMobile && "Logout"}
        </Button>
        
        <UserButton />
      </div>
    </div>
  );
}

export default DcoumentHeader;
