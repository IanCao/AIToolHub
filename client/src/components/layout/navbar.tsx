import { Link } from "wouter";
import { categories, languages } from "@shared/schema";
import { Search } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/language-context";

export default function Navbar() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();

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
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Search className="h-5 w-5" />
          </div>
        </div>
      </div>
    </nav>
  );
}