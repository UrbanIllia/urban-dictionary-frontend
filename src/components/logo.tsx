import clsx from 'clsx';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex flex-row items-center justify-center gap-4">
      <svg
        className="h-9 w-9 md:h-10 md:w-10"
        aria-hidden="true"
        focusable="false"
      >
        <use href="/icons/sprite.svg#icon-UrbanDictionary" />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={clsx(
            'text-[16px] font-bold tracking-tight text-[#0F172A]',
            'md:text-[22px] xl:text-[24px]'
          )}
        >
          Urban’s
        </span>

        <span
          className={clsx(
            'mt-1 text-[12px] font-bold tracking-wide text-[#3B82F6]',
            'md:text-[15px] xl:text-[16px]'
          )}
        >
          Dictionary
        </span>
      </div>
    </Link>
  );
};

export default Logo;
