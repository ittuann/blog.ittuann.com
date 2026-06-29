import { useState, useEffect, useMemo } from "react";
import { IconTags, IconSparkleHighlight } from "@tabler/icons-react";

interface PostData {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  category: string[];
  pinned?: number;
  heroImageSrc: string;
}

interface Props {
  posts: PostData[];
}

export default function PostsList({ posts }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    setSelectedTag(tag);
  }, []);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set("tag", tag);
    } else {
      url.searchParams.delete("tag");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const tag of post.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((p) => p.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  const yearGroups = useMemo(() => {
    const map = new Map<number, PostData[]>();
    for (const post of filteredPosts) {
      const y = new Date(post.pubDate).getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(post);
    }
    return [...map.entries()].sort(([a], [b]) => b - a);
  }, [filteredPosts]);

  const sortedTags = Object.entries(tagCounts).sort(
    ([a, countA], [b, countB]) => countB - countA || a.localeCompare(b),
  );

  return (
    <section className="mx-auto max-w-280 px-6 py-12">
      {/* Tag Filter Bar */}
      {sortedTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleTagChange(null)}
            className={[
              "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              !selectedTag
                ? "bg-primary text-card"
                : "border-border text-foreground hover:bg-muted/60 border",
            ].join(" ")}
          >
            All
            <span
              className={[
                "rounded-full px-1.5 py-0.5 text-xs leading-none",
                !selectedTag
                  ? "bg-card/20 text-card"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {posts.length}
            </span>
          </button>

          {sortedTags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={[
                "flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                selectedTag === tag
                  ? "bg-primary text-card"
                  : "border-border text-foreground hover:bg-muted/60 border",
              ].join(" ")}
            >
              {tag}
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-xs leading-none",
                  selectedTag === tag
                    ? "bg-card/20 text-card"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Posts Timeline */}
      {yearGroups.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No posts found.
        </p>
      ) : (
        yearGroups.map(([year, yearPosts]) => (
          <div key={year} className="mb-4">
            <div className="mb-2 flex items-center py-3">
              <span className="text-foreground/50 w-16 shrink-0 pr-1 text-right text-xl font-bold">
                {year}
              </span>
              <div className="flex w-6 shrink-0 items-center justify-center">
                <div className="border-primary/40 bg-background size-3 rounded-full border-2" />
              </div>
              <div className="bg-border/50 ml-1 h-px flex-1" />
            </div>

            <div className="relative">
              <div className="bg-border/40 left-4.75rem absolute top-0 bottom-6 w-px" />
              {yearPosts.map((post) => {
                const d = new Date(post.pubDate);
                const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

                return (
                  <div key={post.id} className="mb-5 flex items-center">
                    <span className="text-muted-foreground/80 w-16 shrink-0 pr-2 text-right text-sm tabular-nums">
                      {dateStr}
                    </span>
                    <div className="z-10 flex w-6 shrink-0 items-center justify-center">
                      {post.pinned !== undefined ? (
                        <IconSparkleHighlight
                          size={16}
                          stroke={2}
                          className="text-primary"
                        />
                      ) : (
                        <div className="bg-border size-2 rounded-full" />
                      )}
                    </div>
                    <a
                      href={`/posts/${post.id}/`}
                      className="group hover:border-border/30 hover:bg-muted/40 -mr-2.5 ml-2 flex flex-1 items-center gap-3 rounded-2xl border border-transparent p-2.5 transition-all"
                    >
                      <div className="w-4.5rem aspect-4/3 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={post.heroImageSrc}
                          alt=""
                          width={144}
                          height={108}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {post.category.map((cat) => (
                            <span
                              key={cat}
                              className="bg-secondary text-primary rounded-full px-2 py-0.5 text-xs font-medium tracking-tight"
                            >
                              {cat}
                            </span>
                          ))}
                          {post.tags.length > 0 && (
                            <span className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
                              <IconTags size={14} stroke={2} />
                              {post.tags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTagChange(tag);
                                  }}
                                  className="hover:text-primary cursor-pointer transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
