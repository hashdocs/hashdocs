export function ViewsHeader() {
  return (
    <div className="grid grid-cols-12 border-b bg-shade-overlay px-6 py-4 text-xs uppercase text-shade-pencil-light ">
      <div className="col-span-3 grid">{"Email"}</div>
      <div className="col-span-2 grid">{"Link"}</div>
      <div className="col-span-2 grid justify-center">{"Date"}</div>
      <div className="col-span-2 grid justify-center">{"Duration (min)"}</div>
      <div className="col-span-1 grid justify-center">{"Version"}</div>
      <div className="col-span-2 grid justify-center">{"Completion %"}</div>
    </div>
  );
}
