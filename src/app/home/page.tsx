import clsx from 'clsx';
import Link from 'next/link';

const Home = () => {
  return (
    <div
      className={clsx(
        'flex h-screen justify-center px-4 pb-12 pt-45 bg-linear-to-b from-white to-black  ',
        'md:px-8 md:pt-60',
        'xl:pt-75'
      )}
    >
      <div>
        <Link
          href="/training"
          className="flex flex-row items-center justify-center gap-4"
        >
          <svg
            className="h-14 w-14 md:h-17 md:w-17 xl:h-40 xl:w-40"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/icons/sprite.svg#icon-Craftwork-two" />
          </svg>
          <p
            className={clsx(
              'text-[18px] font-semibold',
              'md:text-[22px] xl:text-6xl'
            )}
          >
            Urban`s Dictionary
          </p>
        </Link>
      </div>
    </div>
  );
};
export default Home;
