import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const Button = ({
  text,
  link,
  size,
  action,
  submit,
  color = "primary",
}: {
  text: string;
  link?: string;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  action?: () => void | Promise<any>;
  submit?: boolean;
  color?: string;
}) => {
  const colorStyles =
    color === "primary"
      ? " bg-primary border-primary border-2"
      : " bg-secondary border-secondary border-2";
  const styles = `group text-accent w-max cursor-pointer rounded-lg ${colorStyles} md:px-4 px-2 md:py-2 py-1 text-center hover:scale-105 transition hover:shadow-xl ease-in-out font-brandon uppercase md:text-${size} flex items-center`;
  if (link) {
    return (
      <Link href={link} passHref>
        <button type={"button"} onClick={action} className={styles}>
          <span className={`text-${size}`}>{text}</span>
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
