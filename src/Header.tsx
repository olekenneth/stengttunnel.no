import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Card, Select } from "antd";
import { IFavorite, IRoad } from "./types";
const { Option } = Select;

type HeaderProps = {
  roads: IRoad[];
  favorites: IFavorite[];
  setFavorites: (f: IFavorite[]) => void;
};

const Header = ({ roads, favorites, setFavorites }: HeaderProps) => {
  const [dropdownOptions, setDropdownOptions] = useState<ReactNode[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  console.log(favorites);

  useEffect(() => {
    setDropdownOptions(
      roads.map((r: IRoad) => <Option key={r.urlFriendly}>{r.roadName}</Option>)
    );
  }, [roads]);

  const addFavorite = (selected: IFavorite[]) => {
    console.log("adding", selected, "to favorites");
    setFavorites(selected);

    setTimeout(() => {
      setDropdownOpen(false);
    }, 100);
  };

  return (
    <>
      <Card>
        <Select
          mode="tags"
          open={dropdownOpen}
          placeholder="Velg tunnel(er)"
          onChange={addFavorite}
          onDropdownVisibleChange={(visible) => setDropdownOpen(visible)}
          style={{ width: "100%" }}
          defaultValue={favorites}
          loading={!Boolean(dropdownOptions.length)}
        >
          {dropdownOptions}
        </Select>
      </Card>
    </>
  );
};

export default Header;
