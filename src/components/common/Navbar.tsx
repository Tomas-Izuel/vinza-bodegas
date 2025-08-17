import { Avatar, AvatarFallback } from "../ui/avatar";

export default function TopNav() {
  return (
    <nav className="bg-primary text-white px-6 py-2 flex items-center justify-between h-16">
      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-wider font-inria-serif">
          VINZA
        </h1>
      </div>
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </nav>
  );
}
