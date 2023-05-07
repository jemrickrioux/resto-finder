import { forwardRef, Fragment, ReactNode, Ref } from "react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import Link from "next/link";
import { Button } from "~/components/Button";
import { signOut } from "next-auth/react";

// eslint-disable-next-line react/display-name
const MyLink = forwardRef(
  (props: { href: string; children: ReactNode }, ref: Ref<any>) => {
    const { href, children, ...rest } = props;
    return <Link href={href}>{children}</Link>;
  }
);

const links = [
  //{ href: "/app/addresses", label: "Mes adresses" },
  //{ href: "/app/liked", label: "Mes favoris" },
  { href: "/sign-out", label: "Sign out" },
];

export function Menu(props: { children: ReactNode; disabled: boolean }) {
  return (
    <HeadlessMenu as="div" className={"relative"}>
      <HeadlessMenu.Button disabled={props.disabled}>
        {props.children}
      </HeadlessMenu.Button>
      <HeadlessMenu.Items className={"absolute w-full px-4 py-4"}>
        {links.map((link, index) => (
          /* Use the `active` state to conditionally style the active item. */
          <HeadlessMenu.Item key={link.href} as={Fragment}>
            {link.label !== "Sign out" ? (
              ({ active }) => (
                <MyLink href={link.href}>
                  <div
                    className={`${
                      active ? "bg-primary text-white" : "bg-white text-black"
                    } ${index === 0 ? "rounded-t-lg" : ""} p-4`}
                  >
                    {link.label}
                  </div>
                </MyLink>
              )
            ) : (
              <div
                onClick={() => {
                  void signOut();
                }}
                className={`${
                  links.length === 1 ? "rounded-lg" : "rounded-b-lg"
                } cursor-pointer bg-white p-4 text-black text-primary hover:underline`}
              >
                Déconnecter
              </div>
            )}
          </HeadlessMenu.Item>
        ))}
      </HeadlessMenu.Items>
    </HeadlessMenu>
  );
}
