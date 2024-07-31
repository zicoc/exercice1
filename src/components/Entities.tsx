"use client";

import transformToJSON from "@/lib/file";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useState, useTransition } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";

export default function Entities() {
  const entities = [
    "Agency",
    "Calendar",
    "Calendar_dates",
    "Routes",
    "Shapes",
    "Stops",
    "Stop_times",
    "Trips",
  ];

  const [entity, setEntity] = useState("agency");

  const [page, setPage] = useState(0);

  const [items, setItems] = useState<any[]>();

  const [isPending, startTransition] = useTransition();

  const [active, setActive] = useState(1);

  const getItemProps = (index: number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => setActive(index),
    } as any);

  const next = () => {
    setPage((prev) => prev + 1);
    if (active === 5) return;
    setActive(active + 1);
  };

  const prev = () => {
    setPage((prev) => (prev ? prev - 1 : 0));
    if (active === 1) return;
    setActive(active - 1);
  };

  const onEntity = (value: string) => {
    setEntity(value);
    setPage(0);
    setActive(1);
    startTransition(async () => {
      const data = await transformToJSON(`${entity}.txt`);
      setItems(data);
    });
  };

  useEffect(() => {
    (async function loadData() {
      const data = await transformToJSON(`${entity}.txt`);
      setItems(data);
    })();
  }, []);

  const headers = Object.keys(items?.length ? items[0] : {});

  return (
    <div className="flex-1">
      <span className="mr-10">Entities:</span>
      <Listbox value={entity} onChange={onEntity}>
        <ListboxButton>{entity}</ListboxButton>
        <ListboxOptions anchor="bottom">
          {entities.map((e) => (
            <ListboxOption
              key={e}
              value={e.toLowerCase()}
              className="group flex gap-2 bg-green-400 data-[focus]:bg-blue-100"
            >
              <CheckIcon className="invisible size-5 group-data-[selected]:visible" />
              {e}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <table className="table-fixed mt-10">
        {/* using table because of timeless */}
        {headers && items ? (
          <>
            <thead>
              <tr>
                {headers.map((h: any) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.slice(page, 12).map((item, index) => (
                <tr key={item[headers[0]] + "" + index}>
                  {headers.map((h) => (
                    <td key={h}>{item[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <div className="text-center mt-10">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </table>
      <div className="flex items-center gap-4 mt-10">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={active === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton {...getItemProps(1)}>1</IconButton>
          <IconButton {...getItemProps(2)}>2</IconButton>
          <IconButton {...getItemProps(3)}>3</IconButton>
          <IconButton {...getItemProps(4)}>4</IconButton>
          <IconButton {...getItemProps(5)}>5</IconButton>
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={active === 5}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
