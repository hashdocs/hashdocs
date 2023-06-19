export const errorHandler = (error: any) => {
  console.error(error);

  return new Response(JSON.stringify(error), { status: 500 });
};
