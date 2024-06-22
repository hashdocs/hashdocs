// import UpdateOrgForm from "./_components/updateOrgForm";

import UpdateOrgForm from "./_components/updateOrgForm";

export default function General() {
  return (
    <main className='flex h-full flex-1'>
      <section className="h-full w-full flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-600">General</h1>
              <p className="text-sm text-gray-400">
                Manage your organization settings
              </p>
            </div>
          </div>
          <hr />
          <UpdateOrgForm />
        </div>
      </section>
    </main>
  );
}
