"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authcontext";
import { AssistantContext } from "@/context/AssistantContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvex } from "convex/react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/src/components/magicui/blur-fade";
import Image from "next/image";
import AddNewAssistant from "./AddNewAssistant";
import CreateNewAssistant from "./CreateNewAssistant";
import SearchAssistant from "./SearchAssistant";
import Profile from "./Profile";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LogOut, UserCircle2 } from "lucide-react";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { AssistantType } from "../../ai_assistance/page";


function AssistantsList() {
  const { user, setUser } = useContext(AuthContext);
  const { assistant, setAssistant } = useContext(AssistantContext);
  const convex = useConvex();
  const router = useRouter();

  const [assistantList, setAssistantList] = useState<AssistantType[]>([]);
  const [openProfile, setOpenProfile] = useState(false);

  // Fetch only selected assistants for the user
  useEffect(() => {
    if (!user?._id) return;

    const fetchAssistants = async () => {
      try {
        const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
          uid: user._id as Id<"users">,
        });
        setAssistantList(result);
      } catch (err) {
        console.error("Failed to fetch user assistants:", err);
      }
    };

    fetchAssistants();
  }, [user?._id, convex]);

  const handleLogOut = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user_token");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-black border-r-[0.5px] p-4">
      {/* Logo */}
      <Image src="/logo.jpg" alt="logo" width={40} height={40} className="object-cover h-[50px] w-[50px]" />

      {/* Create/Add Buttons */}
      <div className="mt-3">
        {user?.orderId ? (
          <CreateNewAssistant>
            <Button className="w-full text-sm font-medium dark:bg-cyan-950 dark:text-white/95 cursor-pointer">
              + Create Your Own
            </Button>
          </CreateNewAssistant>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button disabled className="w-full text-sm font-medium dark:bg-cyan-950 dark:text-white/95 cursor-no-drop">
                  + Create Your Own
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade to Pro to unlock this feature</p>
            </TooltipContent>
          </Tooltip>
        )}

        <AddNewAssistant>
          <Button className="w-full mt-3 text-sm font-medium cursor-pointer dark:bg-cyan-950 dark:text-white/95">
            + Add New Assistant
          </Button>
        </AddNewAssistant>
      </div>

      {/* Search */}
      <div className="mt-4">
        <SearchAssistant list={assistantList} />
      </div>

      {/* Assistants List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-4 space-y-4 pr-1">
        {assistantList
          ?.slice()
          .sort((a, b) => (a.name === assistant?.name ? -1 : b.name === assistant?.name ? 1 : 0))
          .map((assist, index) => (
            <BlurFade key={index} delay={index * 0.05} inView>
              <div
                className={`p-2 flex items-center gap-2 hover:bg-gray-200 hover:dark:bg-slate-900 rounded-xl cursor-pointer ${
                  assistant?.name === assist.name ? "bg-gray-200 dark:bg-zinc-800" : ""
                }`}
                onClick={() => setAssistant(assist)}
              >
                <Image
                  src={assist.image}
                  alt={assist.name}
                  width={60}
                  height={60}
                  className="rounded-xl w-[60px] h-[60px] object-cover"
                />
                <div className="p-1 flex flex-col justify-center">
                  <h2 className="font-medium text-md text-gray-700 dark:text-cyan-400">{assist.name}</h2>
                  <h2 className="text-[13px] text-gray-500 dark:text-gray-300">{assist.title}</h2>
                </div>
              </div>
            </BlurFade>
          ))}
      </div>

      {/* User Profile Dropdown */}
      {user && (
        <div className="pt-4 border-t border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-3 items-center bg-white dark:bg-slate-950 p-2 rounded-lg shadow-sm cursor-pointer">
                <Image src={user.picture} alt="User" width={35} height={35} className="rounded-full shrink-0" />
                <div className="flex flex-col overflow-hidden w-full">
                  <h2 className="text-sm font-medium text-gray-700 truncate dark:text-white/80">{user.name}</h2>
                  <h2 className="text-xs text-gray-500 dark:text-gray-300">{user.orderId ? "Pro Plan 🚀" : "Free Plan 🐝"}</h2>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                <UserCircle2 /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Profile openDialog={openProfile} setOpenDialog={setOpenProfile} />
    </div>
  );
}

export default AssistantsList;
