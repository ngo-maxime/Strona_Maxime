import Link from "next/link";
import type { ReactNode } from "react";

// Linki z edytora Sanity: wewnętrzne przez next/link, zewnętrzne w nowej karcie z bezpiecznym rel.
// Odrzucamy schematy inne niż http(s)/mailto/tel (np. javascript:).
export default function PortableLink({
  value,
  children,
}: {
  value?: { href?: string };
  children: ReactNode;
}) {
  const href = value?.href ?? "";
  const className =
    "text-arylideYellow underline underline-offset-4 transition-colors hover:text-white";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={className}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }
  return <>{children}</>;
}
