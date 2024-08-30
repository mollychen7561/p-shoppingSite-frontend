import { List, ListItem, Card } from "@material-tailwind/react";

interface CategoryListProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export function CategoryList({ setCategory }: CategoryListProps) {
  return (
    <Card className="w-full">
      <List>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("jewelery")}
        >
          <ListItem className="truncate md:whitespace-normal md:max-w-[8rem] lg:whitespace-nowrap">
            Jewelery
          </ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("electronics")}
        >
          <ListItem className="truncate md:whitespace-normal md:max-w-[8rem] lg:whitespace-nowrap">
            Electronics
          </ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("men's clothing")}
        >
          <ListItem className="truncate md:whitespace-normal md:max-w-[8rem]">
            Men&apos;s Clothing
          </ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("women's clothing")}
        >
          <ListItem className="truncate md:whitespace-normal md:max-w-[8rem] ">
            Women&apos;s Clothing
          </ListItem>
        </a>
      </List>
    </Card>
  );
}
