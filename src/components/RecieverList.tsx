import React, { useState, useEffect, useMemo, Fragment } from "react";
import _ from "lodash";
import { getCharPattern } from "../helper/Helper";
import { useSession } from "next-auth/react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Props = {
  userList?: string[];
  setReciever: (value) => void;
  isError: boolean;
};

export default function RecieverList(props: Props) {
  const { userList, setReciever, isError } = props;

  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredUserList = useMemo(() => {
    const searchQueryPattern = RegExp(
      query.split("").map(getCharPattern).join("")
    );

    return _.filter(userList, (user) => {
      return searchQueryPattern.test(user);
    });
  }, [query, userList]);

  useEffect(() => setReciever(selected), [setReciever, selected]);

  return (
    <div className="w-full">
      <div className="w-full">
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full border border-gray-200 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(reciever: string) => reciever}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredUserList.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredUserList.map((person) => (
                    <Combobox.Option
                      key={`send-to-${person}`}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-gray-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {person}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-gray-600"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
      {isError && (
        <div className="mt-4">
          <h6 className="text-red-700">!! 받는 이를 선택해야합니다.</h6>
        </div>
      )}
    </div>
  );
}
