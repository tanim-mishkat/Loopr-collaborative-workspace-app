import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SK,
});

export async function POST(request) {
  try {
    // Get the current user from your database
    const user = await currentUser();
    
    // Enhanced user authentication check
    if (!user) {
      console.log("No user found in session");
      return new Response(
        JSON.stringify({ error: "User not authenticated", code: "NO_USER" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user.primaryEmailAddress?.emailAddress) {
      console.log("User has no primary email address");
      return new Response(
        JSON.stringify({ error: "User email not found", code: "NO_EMAIL" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get room ID from URL parameters
    const { searchParams } = new URL(request?.url);
    const roomId = searchParams.get('roomId');
    
    // Enhanced room ID validation
    if (!roomId || roomId.trim() === '') {
      console.log("Invalid room ID:", roomId);
      return new Response(
        JSON.stringify({ error: "Valid Room ID is required", code: "INVALID_ROOM_ID" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log authentication attempt
    console.log(`Authenticating user ${user.primaryEmailAddress.emailAddress} for room ${roomId}`);

    // Start an auth session inside your endpoint
    const session = liveblocks.prepareSession(
      user.primaryEmailAddress.emailAddress,
      {
        userInfo: {
          id: user.id,
          name: user.fullName || user.firstName || user.primaryEmailAddress.emailAddress.split('@')[0],
          email: user.primaryEmailAddress.emailAddress,
          avatar: user.imageUrl || "",
        },
      }
    );

    // Allow access to the specific room with full permissions
    session.allow(roomId, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { status, body } = await session.authorize();
    
    console.log(`Successfully authenticated user for room ${roomId}`);
    return new Response(body, { status });
    
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    
    // Enhanced error response
    const errorResponse = {
      error: "Authentication failed",
      code: "AUTH_ERROR",
      details: error.message,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(errorResponse), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}