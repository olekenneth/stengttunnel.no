import React, { useEffect, useState } from "react";
import { Card, Dropdown, DropdownProps } from "semantic-ui-react";
import { IFavorite, IRoad } from "./types";

interface IDropdownOption {
  key: string;
  value: string;
  text: string;
}

type HeaderProps = {
  roads: IRoad[];
  favorites: IFavorite[];
  setFavorites: (f: IFavorite[]) => void;
};

// Reserve the same vertical space whether the dropdown is loading or ready,
// to avoid a layout shift when the roads list arrives.
const RESERVED_HEIGHT = "62px";

const Header = (props: HeaderProps) => {
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);

  useEffect(() => {
    setDropdownOptions(
      props.roads.map((r: IRoad) => ({
        key: r.urlFriendly,
        value: r.urlFriendly,
        text: r.roadName,
      }))
    );
  }, [props.roads]);

  const addFavorite = (event: any, data: DropdownProps) => {
    props.setFavorites(data.value as IFavorite[]);

    setTimeout(() => {
      if ("activeElement" in document) {
        (document.activeElement as HTMLElement).blur();
      }
    }, 100);
  };

  // While roads are loading, render an empty placeholder of the same height
  // so the layout below does not shift when the dropdown appears.
  if (dropdownOptions.length < 1) {
    return (
      <div
        style={{ minHeight: RESERVED_HEIGHT }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Card fluid style={{ minHeight: RESERVED_HEIGHT }}>
      <Dropdown
        placeholder="Velg tunnel(er)"
        onChange={addFavorite}
        fluid
        search
        selection
        multiple
        closeOnChange
        defaultOpen={props.favorites.length === 0}
        value={props.favorites}
        options={dropdownOptions}
      />
    </Card>
  );
};

export default Header;
