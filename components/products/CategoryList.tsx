import { List, ListItem, Card } from "@material-tailwind/react";

interface CategoryListProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export function CategoryList({ setCategory }: CategoryListProps) {
  return (
    <Card className="w-full mb-4">
      <List>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("jewelery")}
        >
          <ListItem>Jewelery</ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("electronics")}
        >
          <ListItem>Electronics</ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("men's clothing")}
        >
          <ListItem>Men&apos;s Clothing</ListItem>
        </a>
        <a
          href="#"
          className="text-initial"
          onClick={() => setCategory("women's clothing")}
        >
          <ListItem>Women&apos;s Clothing</ListItem>
        </a>
      </List>
    </Card>
  );
}
