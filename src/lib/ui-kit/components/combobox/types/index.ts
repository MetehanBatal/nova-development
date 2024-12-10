export interface SingleItem {
  label: string;
  key: string | number;
  icon?: string;
  info?: string;
  link?: string;
  checked?: boolean;
}

export interface GroupedItems {
  title: string;
  key: string | number;
  items: SingleItem[];
}

export type Items = SingleItem[] | GroupedItems[];
