import { Input } from "@material-tailwind/react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="mb-4">
      <Input
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:max-w-[8rem] lg:max-w-[30rem]"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        }
      />
    </div>
  );
}
