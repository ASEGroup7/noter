import { User } from "@clerk/clerk-sdk-node";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import axios from "axios";

interface CommentBubbleProps {
  userId: string,
  content: string,
}

export default async function CommentBubble(props: CommentBubbleProps) {
  const { data }  = await axios.get("/api/user", {
    params: { id: props.userId }
  })

  const userData = data.user;

  return <div>
    <Avatar>
      <AvatarImage src={userData.imageUrl} className="w-10" /><span><strong>{userData.username}: </strong></span>  
      <AvatarFallback />
      
    </Avatar>
   {props.content}
  </div>;
}