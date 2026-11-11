const IsLoaded = () => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 md:w-8 xl:h-10 md:h-8 xl:w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600 text-xl md:text-2xl  xl:text-4xl">
          Loading training...
        </p>
      </div>
    </main>
  );
};
export default IsLoaded;
