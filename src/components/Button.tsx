import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const Button = ({
  text,
  link,
  size,
  action,
  submit,
}: {
  text: string;
  link?: string;
  size: "sm" | "md" | "xl";
  action?: () => void | Promise<any>;
  submit?: boolean;
}) => {
  const styles = `group text-accent w-max cursor-pointer rounded-lg border-2 border-primary bg-primary px-4 py-2 text-center hover:scale-105 transition hover:shadow-xl ease-in-out font-brandon uppercase md:text-${size} flex items-center`;
  if (link) {
    return (
      <Link href={link} passHref>
        <button type={"button"} onClick={action} className={styles}>
          <span>{text}</span>
          <ArrowRightIcon className=" bold ml-2 h-6 w-6 transition ease-in-out hover:transform group-hover:translate-x-1" />
        </button>
      </Link>
    );
  }
  return (
    <button
      onClick={action}
      type={submit ? "submit" : "button"}
      className={styles}
    >
      {text}
    </button>
  );
};
