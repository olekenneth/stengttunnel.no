'use client'

import { useEffect, useState } from "react";
import { Card, Dropdown, DropdownProps } from "semantic-ui-react";
import { IFavorite, IRoad } from "@/lib/types";

interface IDropdownOption {
  key: string;
  value: string;
  text: string;
  content?: React.ReactNode;
}

type HeaderProps = {
  roads: IRoad[];
  favorites: IFavorite[];
  setFavorites: (f: IFavorite[]) => void;
};

const Header = (props: HeaderProps) => {
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDropdownOptions(
      props.roads.map((r: IRoad) => ({
        key: r.urlFriendly,
        value: r.urlFriendly,
        text: r.roadName,
        content: (
          <a
            onClick={(e) => {
              e.preventDefault();
              return false;
            }}
            href={"/" + r.urlFriendly}
          >
            {r.roadName}
          </a>
        ),
      }))
    );
  }, [props.roads]);

  useEffect(() => {
    // Only set open state on client side after mount to avoid hydration mismatch
    setIsOpen(props.favorites.length === 0);
  }, [props.favorites.length]);

  const addFavorite = (event: any, data: DropdownProps) => {
    props.setFavorites(data.value as IFavorite[]);

    setTimeout(() => {
      if ("activeElement" in document) {
        (document.activeElement as HTMLElement).blur();
      }
    }, 100);
  };

  if (dropdownOptions.length < 1) {
    return null;
  }

  return (
    <Card fluid>
      <Dropdown
        placeholder="Velg tunnel(er)"
        onChange={addFavorite}
        fluid
        search
        selection
        multiple
        closeOnChange
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        value={props.favorites}
        disabled={!Boolean(dropdownOptions.length)}
        loading={!Boolean(dropdownOptions.length)}
        options={dropdownOptions}
      />
    </Card>
  );
};

export default Header;
