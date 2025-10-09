// @ts-ignore
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.5";

interface UserManagementPayload {
  userId: string;
  updates?: object; // Optional for PATCH, not present in DELETE
}

serve(async (req: Request) => {
  try {
    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get("SUPABASE_URL") ?? "",
      // @ts-ignore
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname;

    // Ensure only authenticated requests can access this function
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];
    const { data: user, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the user is an admin (assuming 'profiles' table has a 'role' column)
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("user_id", user.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (path === "/user-management/users" && method === "GET") {
      const { data: users, error } = await supabaseClient.auth.admin.listUsers();
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (path === "/user-management/users" && method === "PATCH") {
      const body = await req.json() as UserManagementPayload;
      const { userId, updates } = body;
      const { data, error } = await supabaseClient.auth.admin.updateUserById(userId, updates);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (path === "/user-management/users" && method === "DELETE") {
      const body = await req.json() as UserManagementPayload;
      const { userId } = body;
      const { error } = await supabaseClient.auth.admin.deleteUser(userId);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ message: "User deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});