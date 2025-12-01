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
      if (data?.user) {
        return new Response(JSON.stringify(data.user), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ message: "User updated successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
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
    console.error("Supabase Function Error:", error); // Log the full error object
    // The "unexpected token <" or "doctype" error often indicates that the client
    // is receiving an HTML response instead of JSON. This usually happens if:
    // 1. The Supabase Edge Function failed to deploy or start correctly.
    // 2. The client is hitting an incorrect URL or a different server.
    // 3. Environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are misconfigured.
    // Ensure the function is deployed and accessible, and client requests are correct.
    return new Response(JSON.stringify({ error: error.message, details: error.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});