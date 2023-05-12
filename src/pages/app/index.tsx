import { type NextPage } from "next";
import { Finder } from "~/components/Finder";
import React, { useContext, useState } from "react";
import { Results } from "~/context/resultsContext";
import { Modal } from "~/components/Modal";
import { AppLayout } from "~/layouts/AppLayout";
import { Button } from "~/components/Button";
import { Loading } from "~/components/Loading";
import { useRedirects } from "~/hooks/useRedirects";

const Index: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { choices, recommandation, resetChoices } = useContext(Results);

  useRedirects();

  return (
    <AppLayout
      title={"On Manges Quoi | App"}
      description={"Trouves ton lunch!"}
    >
      <>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}></Modal>

        <div className=" flex  flex-col ">
          <section
            className={
              "flex w-full flex-col items-center text-center md:w-[1000px]"
            }
          >
            <div className={"flex w-full flex-col items-center"}>
              {choices.length !== 0 && !recommandation && <Loading />}
              {choices.length === 0 && <Finder />}
              {choices.length !== 0 && recommandation && (
                <div className={"flex flex-col items-center"}>
                  <Button
                    text={"Je veux recommencer"}
                    size={"sm"}
                    action={resetChoices}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </>
    </AppLayout>
  );
};

export default Index;
