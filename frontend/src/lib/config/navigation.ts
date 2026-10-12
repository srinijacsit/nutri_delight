export interface NavItem {
  name: string;
  href: string;
  disabled?: boolean;
}

export const mainNav: NavItem[] = [
  { name: "Home", href: "/" },
  // Future routes (commented out to prevent broken links in Phase 2)
  // { name: "Menu", href: "/menu" },
  // { name: "Bulk Order", href: "/bulk-order" },
  // { name: "Orders", href: "/orders" },
];

export const footerNav: NavItem[] = [
  { name: "Home", href: "/" },
];
