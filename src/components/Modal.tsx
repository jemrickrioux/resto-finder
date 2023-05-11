import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "~/components/Button";
import { FieldGroup, Label } from "~/components/form/FormItems";
import { LocationData } from "~/context/locationContext";
import { api } from "~/utils/api";

export function Modal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // The open/closed state lives outside of the Dialog and is managed by you
  const [name, setName] = useState("");
  const utils = api.useContext();
  const distance = useContext(LocationData);
  const save = api.user.addAddress.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  async function handleSubmit() {
    // ...
    if (!name || !distance.coordinates.lat || !distance.coordinates.lng)
      return null;
    await save.mutateAsync({
      name,
      lat: distance.coordinates.lat,
      lng: distance.coordinates.lng,
    });
    setIsOpen(false);
  }

  return (
    /*
      Pass `isOpen` to the `open` prop, and use `onClose` to set
      the state back to `false` when the user clicks outside of
      the dialog or presses the escape key.
    */
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={"div"}
      className="fixed inset-0 overflow-y-auto"
    >
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white px-6 py-4">
            <Dialog.Title className={"font-primary font-anek text-2xl"}>
              {"Sauvegarder l'adresse"}
            </Dialog.Title>
            <Dialog.Description>
              Votre position actuelle sera sauvegardée comme addresse favorite.
            </Dialog.Description>
            <FieldGroup>
              <Label htmlFor={"name"}>{"Nom de l'adresse"}</Label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type={"text"}
                className={
                  "my-4 w-max rounded-lg border-2 border-primary bg-accent px-2 py-1 text-white"
                }
                name={"name"}
              />
            </FieldGroup>

            {/*
          You can render additional buttons to dismiss your dialog by setting
          `isOpen` to `false`.
        */}
            <div className={"my-4 flex flex-row space-x-2"}>
              <Button
                size={"xs"}
                action={() => setIsOpen(false)}
                text={"Annuler"}
              ></Button>
              <Button
                size={"xs"}
                action={handleSubmit}
                text={"Sauvegarder"}
              ></Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
