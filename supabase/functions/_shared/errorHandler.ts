export const errorHandler = (error: any) => {
  console.error(error);

  return new Response(null, { status: 500, statusText: "Internal Server Error", headers: { "Content-Type": "application/json" } });
};
