export async function GET() {
  return new Response("silly", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}