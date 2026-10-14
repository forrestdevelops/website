// Site-wide content. Replace the [BRACKETED] placeholders with real values.
export const site = {
  name: "forrestdevelops",
  tagline: "Real-world tech, from the server room to the cloud.",
  description:
    "Write-ups and videos on observability, cloud infrastructure, AI agents and homelab builds — what worked, what broke, and how to fix it.",
  location: "Indianapolis, IN",
  githubUrl: "https://github.com/forrestdevelops",
  githubHandle: "forrestdevelops",
  tags: ["observability", "cloud", "agentic AI", "homelab", "IT leadership"],
};

export const nav = [
  { href: "/blog", label: "/blog", key: "blog" },
  { href: "/videos", label: "/videos", key: "videos" },
  { href: "/#about", label: "/about" },
  { href: "/store", label: "/store", key: "store" },
] as const;
