import { Link } from "wouter";
import { categories } from "@shared/schema";
import { Search } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">AI Tools Hub</a>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category}>
                  <Link href={`/category/${category.toLowerCase()}`}>
                    <a className="px-3 py-2 text-sm font-medium hover:text-primary">
                      {category}
                    </a>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <Search className="h-5 w-5" />
          </div>
        </div>
      </div>
    </nav>
  );
}
