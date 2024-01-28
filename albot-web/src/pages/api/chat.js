import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

async function handler(req, res) {
    console.log("req: ",req)
  const supabase = createMiddlewareClient({ req, res });
  console.log("supabase: ",supabase)
  const body = await req.json();
  console.log("body: ",body)

  body.model = "gpt-3.5-turbo";

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = await OpenAIStream(body);

  return new Response(stream, { status: 200 });
}

export default handler;